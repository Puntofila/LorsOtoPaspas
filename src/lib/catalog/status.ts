import type { Brand } from "@/lib/data/brands";

export const CATALOG_STATUSES = ["AVAILABLE", "OUT_OF_STOCK", "NOT_OFFERED"] as const;
export type CatalogStatus = (typeof CATALOG_STATUSES)[number];

export type CatalogStatusEntry = {
  brandSlug: string;
  modelSlug: string | null;
  status: string;
  note: string | null;
};

const STATUS_INFO: Record<CatalogStatus, { visible: boolean; orderable: boolean }> = {
  AVAILABLE: { visible: true, orderable: true },
  OUT_OF_STOCK: { visible: true, orderable: false },
  NOT_OFFERED: { visible: false, orderable: false },
};

export function normalizeCatalogStatus(status?: string | null): CatalogStatus {
  if (status === "UNAVAILABLE") return "OUT_OF_STOCK";
  if (status === "HIDDEN") return "NOT_OFFERED";
  return CATALOG_STATUSES.includes(status as CatalogStatus) ? (status as CatalogStatus) : "AVAILABLE";
}

export function getCatalogStatusInfo(status?: string | null) {
  const normalized = normalizeCatalogStatus(status);
  return { status: normalized, ...STATUS_INFO[normalized] };
}

export function applyCatalogEntries(brands: Brand[], entries: CatalogStatusEntry[]): Brand[] {
  const brandEntries = new Map<string, CatalogStatusEntry>();
  const modelEntries = new Map<string, CatalogStatusEntry>();

  for (const entry of entries) {
    if (entry.modelSlug) modelEntries.set(`${entry.brandSlug}:${entry.modelSlug}`, entry);
    else brandEntries.set(entry.brandSlug, entry);
  }

  return brands.flatMap((brand) => {
    const brandEntry = brandEntries.get(brand.slug);
    const brandInfo = getCatalogStatusInfo(brandEntry?.status);
    if (!brandInfo.visible) return [];

    const models = brand.models.flatMap((model) => {
      const entry = modelEntries.get(`${brand.slug}:${model.slug}`) ?? brandEntry;
      const info = getCatalogStatusInfo(entry?.status);
      if (!info.visible) return [];
      return [{
        ...model,
        catalogStatus: info.status,
        catalogNote: entry?.note ?? undefined,
      }];
    });

    if (models.length === 0) return [];
    return [{
      ...brand,
      catalogStatus: brandInfo.status,
      catalogNote: brandEntry?.note ?? undefined,
      models,
    }];
  });
}
