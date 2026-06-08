import type { AppRole } from "@/lib/auth/config";

export function normalizeAppRole(role?: string | null): AppRole {
  if (role === "ADMIN") return "DIRECTOR";
  if (role === "DIRECTOR" || role === "STAFF" || role === "CUSTOMER") return role;
  return "CUSTOMER";
}

