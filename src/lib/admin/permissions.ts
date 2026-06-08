import type { AppRole } from "@/lib/auth/config";

export type PermissionUser = { id: string; role: AppRole };
export type PermissionOrder = {
  acceptedById?: string | null;
  createdById?: string | null;
  archivedAt?: Date | string | null;
};

export function isDirector(user: PermissionUser) {
  return user.role === "DIRECTOR";
}

export function ownsOrder(user: PermissionUser, order: PermissionOrder) {
  return order.acceptedById === user.id || order.createdById === user.id;
}

export function canViewOrder(user: PermissionUser, order: PermissionOrder) {
  if (isDirector(user)) return true;
  if (user.role !== "STAFF") return false;
  return !order.acceptedById || ownsOrder(user, order);
}

export function canEditOrder(user: PermissionUser, order: PermissionOrder) {
  if (isDirector(user)) return true;
  return user.role === "STAFF" && ownsOrder(user, order);
}

export function canArchiveOrder(user: PermissionUser, order: PermissionOrder) {
  return canEditOrder(user, order);
}

export function canClaimOrder(user: PermissionUser, order: PermissionOrder) {
  return (
    (user.role === "STAFF" || user.role === "DIRECTOR") &&
    !order.acceptedById &&
    !order.archivedAt
  );
}

