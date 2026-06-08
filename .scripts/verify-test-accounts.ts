import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/db/prisma";

const TEST_ACCOUNTS = [
  { email: "admin@lors.local", password: "Admin123!", role: "ADMIN" },
  { email: "staff@lors.local", password: "Staff123!", role: "STAFF" },
  { email: "user@lors.local", password: "User123!", role: "CUSTOMER" },
] as const;

async function main() {
  const failures: string[] = [];

  for (const account of TEST_ACCOUNTS) {
    const user = await prisma.user.findUnique({ where: { email: account.email } });
    if (!user) {
      failures.push(`${account.email}: missing`);
      continue;
    }
    if (user.role !== account.role) {
      failures.push(`${account.email}: expected role ${account.role}, got ${user.role}`);
    }
    if (!user.passwordHash) {
      failures.push(`${account.email}: missing password hash`);
      continue;
    }
    const passwordOk = await bcrypt.compare(account.password, user.passwordHash);
    if (!passwordOk) {
      failures.push(`${account.email}: password does not match seeded credentials`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Test account verification failed:\n${failures.join("\n")}`);
  }

  console.log("Test accounts verified: ADMIN, STAFF, CUSTOMER");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
