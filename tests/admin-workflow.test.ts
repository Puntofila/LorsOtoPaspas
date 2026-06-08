import test from "node:test";
import assert from "node:assert/strict";

import {
  applyCatalogEntries,
  getCatalogStatusInfo,
  normalizeCatalogStatus,
} from "../src/lib/catalog/status";
import { calculateCommission } from "../src/lib/orders/commission";
import { adminTranslator, getMissingAdminCoreTranslations } from "../src/lib/admin/i18n";
import {
  canArchiveOrder,
  canClaimOrder,
  canEditOrder,
  canViewOrder,
} from "../src/lib/admin/permissions";
import { PRODUCT_OPTIONS } from "../src/lib/catalog/product-options";
import { calculatePromotionDiscount, isPromotionUsable } from "../src/lib/orders/promotion";
import { normalizeAppRole } from "../src/lib/auth/roles";

const brands = [
  {
    slug: "audi",
    name: "Audi",
    models: [
      { slug: "a4", name: "A4", fullName: "Audi A4", years: "2020" },
      { slug: "a6", name: "A6", fullName: "Audi A6", years: "2021" },
    ],
  },
  {
    slug: "bmw",
    name: "BMW",
    models: [{ slug: "x5", name: "X5", fullName: "BMW X5", years: "2022" }],
  },
];

test("not offered catalog entries disappear while unavailable entries remain visible", () => {
  const result = applyCatalogEntries(brands, [
    { brandSlug: "audi", modelSlug: "a4", status: "NOT_OFFERED", note: null },
    { brandSlug: "audi", modelSlug: "a6", status: "OUT_OF_STOCK", note: "Back next week" },
  ]);

  assert.equal(result[0].models.length, 1);
  assert.equal(result[0].models[0].slug, "a6");
  assert.equal(result[0].models[0].catalogStatus, "OUT_OF_STOCK");
  assert.equal(result[0].models[0].catalogNote, "Back next week");
});

test("legacy unavailable status is normalized to out of stock", () => {
  assert.equal(normalizeCatalogStatus("UNAVAILABLE"), "OUT_OF_STOCK");
});

test("not offered is hidden from the public catalog", () => {
  const info = getCatalogStatusInfo("NOT_OFFERED");
  assert.equal(info.visible, false);
  assert.equal(info.orderable, false);
});

test("commission is calculated from integer percentage and total", () => {
  assert.equal(calculateCommission(4250, 12), 510);
  assert.equal(calculateCommission(4250, 0), 0);
});

test("admin translator follows the selected locale", () => {
  assert.equal(adminTranslator("ru")("nav.orders"), "Заказы");
  assert.equal(adminTranslator("en")("nav.orders"), "Orders");
  assert.notEqual(adminTranslator("ar")("nav.orders"), "Orders");
  assert.equal(adminTranslator("ru")("role.DIRECTOR"), "Директор");
});

test("admin core workflow is translated in every supported locale", () => {
  assert.deepEqual(getMissingAdminCoreTranslations("tr"), []);
  assert.deepEqual(getMissingAdminCoreTranslations("ru"), []);
  assert.deepEqual(getMissingAdminCoreTranslations("ar"), []);
});

test("staff only controls own orders while director controls every order", () => {
  const own = { acceptedById: "staff-1", createdById: "staff-1", archivedAt: null };
  const foreign = { acceptedById: "staff-2", createdById: "staff-2", archivedAt: null };

  assert.equal(canViewOrder({ id: "staff-1", role: "STAFF" }, own), true);
  assert.equal(canEditOrder({ id: "staff-1", role: "STAFF" }, foreign), false);
  assert.equal(canArchiveOrder({ id: "staff-1", role: "STAFF" }, own), true);
  assert.equal(canArchiveOrder({ id: "staff-1", role: "STAFF" }, foreign), false);
  assert.equal(canEditOrder({ id: "director-1", role: "DIRECTOR" }, foreign), true);
});

test("staff can claim only an unassigned active order", () => {
  assert.equal(canClaimOrder({ id: "staff-1", role: "STAFF" }, { acceptedById: null, archivedAt: null }), true);
  assert.equal(canClaimOrder({ id: "staff-1", role: "STAFF" }, { acceptedById: "staff-2", archivedAt: null }), false);
  assert.equal(canClaimOrder({ id: "staff-1", role: "STAFF" }, { acceptedById: null, archivedAt: new Date() }), false);
});

test("shared product options contain the real order configurator choices", () => {
  assert.deepEqual(PRODUCT_OPTIONS.patterns.map((item) => item.id), ["sota", "romb"]);
  assert.deepEqual(PRODUCT_OPTIONS.materials.map((item) => item.id), ["hali", "ithal", "premium", "standart"]);
  assert.deepEqual(PRODUCT_OPTIONS.accessories.map((item) => item.id), ["heelPad", "logo"]);
  assert.ok(PRODUCT_OPTIONS.colors.length >= 16);
});

test("promotion discount is capped by the subtotal", () => {
  assert.equal(calculatePromotionDiscount(5000, { type: "PERCENT", amount: 10 }), 500);
  assert.equal(calculatePromotionDiscount(5000, { type: "FIXED", amount: 8000 }), 5000);
});

test("promotion respects activity, dates, minimum and use limit", () => {
  const now = new Date("2026-06-08T12:00:00Z");
  assert.equal(isPromotionUsable({
    isActive: true,
    startsAt: new Date("2026-06-01T00:00:00Z"),
    endsAt: new Date("2026-06-30T23:59:59Z"),
    minSubtotal: 1000,
    maxUses: 10,
    usedCount: 3,
  }, 2500, now), true);
  assert.equal(isPromotionUsable({
    isActive: true,
    startsAt: null,
    endsAt: null,
    minSubtotal: 3000,
    maxUses: null,
    usedCount: 0,
  }, 2500, now), false);
});

test("legacy admin role migrates to director semantics", () => {
  assert.equal(normalizeAppRole("ADMIN"), "DIRECTOR");
  assert.equal(normalizeAppRole("STAFF"), "STAFF");
  assert.equal(normalizeAppRole("unknown"), "CUSTOMER");
});
