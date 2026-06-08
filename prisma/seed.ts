import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BRANDS } from "../src/lib/data/brands";
import { PRODUCT_OPTIONS } from "../src/lib/catalog/product-options";
import { COMPANY_PROFILE } from "../src/lib/site/company-profile";

const prisma = new PrismaClient();

const TEST_ACCOUNTS = [
  {
    email: "admin@lors.local",
    password: "Admin123!",
    name: "LORS Admin",
    role: "DIRECTOR",
    phone: "+90 555 000 0101",
  },
  {
    email: "staff@lors.local",
    password: "Staff123!",
    name: "LORS Staff",
    role: "STAFF",
    phone: "+90 555 000 0202",
  },
  {
    email: "user@lors.local",
    password: "User123!",
    name: "Demo Customer",
    role: "CUSTOMER",
    phone: "+90 555 000 0303",
  },
] as const;

async function upsertPasswordUser(account: (typeof TEST_ACCOUNTS)[number]) {
  const passwordHash = await bcrypt.hash(account.password, 10);

  return prisma.user.upsert({
    where: { email: account.email },
    update: {
      name: account.name,
      role: account.role,
      phone: account.phone,
      passwordHash,
    },
    create: {
      email: account.email,
      name: account.name,
      role: account.role,
      phone: account.phone,
      passwordHash,
    },
  });
}

async function ensureDemoOrder(userId: string) {
  const number = "LR-DEMO-0001";
  const existing = await prisma.order.findUnique({ where: { number } });
  if (existing) {
    await prisma.order.update({
      where: { number },
      data: { userId, status: "CONFIRMED" },
    });
    return;
  }

  await prisma.order.create({
    data: {
      number,
      userId,
      status: "CONFIRMED",
      subtotal: 4250,
      shipping: 0,
      total: 4250,
      customer: JSON.stringify({
        firstName: "Demo",
        lastName: "Customer",
        email: "user@lors.local",
        phone: "+90 555 000 0303",
      }),
      shippingAdr: JSON.stringify({
        province: "İstanbul",
        district: "Başakşehir",
        neighborhood: "",
        address: "Bagdat Caddesi 100",
        zip: "34000",
      }),
      note: "Seed demo order for account/admin testing",
      locale: "tr",
      items: {
        create: [
          {
            brandSlug: "audi",
            brandName: "Audi",
            modelSlug: "a3-2003-2012-5-kapili-8p",
            modelName: "A3 2003-2012 5. kapılı (8P)",
            fullName: "Audi A3 2003-2012 5. kapılı (8P)",
            years: "2003-2012",
            bodyType: "Hatchback",
            color: "#0f0f10",
            piping: "#c9a44a",
            logo: "audi",
            setType: "full",
            unitPrice: 4250,
            qty: 1,
          },
        ],
      },
    },
  });
}

async function seedCompanyData() {
  for (const branch of COMPANY_PROFILE.branches) {
    await prisma.branch.upsert({
      where: { id: branch.id },
      update: {
        name: branch.name,
        shortName: branch.shortName,
        address: branch.address,
        phone: branch.phone,
        mapsUrl: branch.mapsUrl,
        hours: JSON.stringify(branch.hours),
        isActive: true,
      },
      create: {
        id: branch.id,
        name: branch.name,
        shortName: branch.shortName,
        address: branch.address,
        phone: branch.phone,
        mapsUrl: branch.mapsUrl,
        hours: JSON.stringify(branch.hours),
      },
    });
  }

  for (const [group, options] of Object.entries(PRODUCT_OPTIONS)) {
    for (const [index, option] of options.entries()) {
      const value = option.id;
      const label = "label" in option ? option.label : "labelKey" in option ? option.labelKey : value;
      await prisma.productOption.upsert({
        where: { group_value: { group, value } },
        update: {
          label,
          colorHex: "hex" in option ? option.hex : null,
          priceDelta: "addon" in option ? option.addon : 0,
          sortOrder: index,
          isActive: true,
        },
        create: {
          group,
          value,
          label,
          colorHex: "hex" in option ? option.hex : null,
          priceDelta: "addon" in option ? option.addon : 0,
          sortOrder: index,
        },
      });
    }
  }

  for (const brand of BRANDS) {
    const dbBrand = await prisma.vehicleBrand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: { slug: brand.slug, name: brand.name },
    });
    for (const model of brand.models) {
      await prisma.vehicleModel.upsert({
        where: { brandId_slug: { brandId: dbBrand.id, slug: model.slug } },
        update: {
          name: model.name,
          fullName: model.fullName,
          years: model.years,
          bodyType: model.bodyType,
        },
        create: {
          brandId: dbBrand.id,
          slug: model.slug,
          name: model.name,
          fullName: model.fullName,
          years: model.years,
          bodyType: model.bodyType,
        },
      });
    }
  }
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@lors.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  let demoUserId = "";
  await seedCompanyData();
  for (const account of TEST_ACCOUNTS) {
    const user = await upsertPasswordUser(account);
    if (account.role === "CUSTOMER") demoUserId = user.id;
    console.log(`Seeded ${account.role}: ${account.email} / ${account.password}`);
  }

  if (adminEmail !== "admin@lors.local") {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "DIRECTOR", passwordHash },
      create: {
        email: adminEmail,
        name: "Admin",
        role: "DIRECTOR",
        passwordHash,
      },
    });
    console.log(`Seeded env admin: ${adminEmail} / ${adminPassword}`);
  }

  await ensureDemoOrder(demoUserId);
  console.log("Seeded demo order: LR-DEMO-0001");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
