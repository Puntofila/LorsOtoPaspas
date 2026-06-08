import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./config";

type Role = "CUSTOMER" | "STAFF" | "DIRECTOR";

export async function requireUser(locale: string, redirectTo = "/account") {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/login?callbackUrl=${encodeURIComponent(`/${locale}${redirectTo}`)}`);
  }
  return session.user;
}

export async function requireRole(locale: string, allowed: Role[]) {
  const user = await requireUser(locale, "/admin");
  if (!allowed.includes(user.role)) {
    redirect(`/${locale}`);
  }
  return user;
}
