import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import type { AppRole } from "@/lib/auth/config";

export type SessionUser = { id: string; role: AppRole; email?: string | null; name?: string | null };

/**
 * Server-side API guard. Returns the session user if their role is allowed,
 * otherwise null. Use in route handlers: `const user = await requireApiRole([...])`.
 */
export async function requireApiRole(allowed: AppRole[]): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user?.id || !allowed.includes(user.role)) return null;
  return user;
}
