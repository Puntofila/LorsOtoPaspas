import { prisma } from "@/lib/db/prisma";
import { BRANDS } from "@/lib/data/brands";
import { applyCatalogEntries } from "@/lib/catalog/status";
import { unstable_noStore as noStore } from "next/cache";

export async function getPublicBrands() {
  noStore();
  const entries = await prisma.catalogEntry.findMany({
    select: { brandSlug: true, modelSlug: true, status: true, note: true },
  });
  return applyCatalogEntries(BRANDS, entries);
}

export async function getPublicBrand(slug: string) {
  return (await getPublicBrands()).find((brand) => brand.slug === slug);
}

export async function getPublicModel(brandSlug: string, modelSlug: string) {
  const brand = await getPublicBrand(brandSlug);
  const model = brand?.models.find((item) => item.slug === modelSlug);
  return brand && model ? { brand, model } : undefined;
}
