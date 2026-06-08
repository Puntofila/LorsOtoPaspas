"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Brand, Model } from "@/lib/data/brands";
import MatPreview from "./MatPreview";
import { useCart } from "@/lib/cart/CartProvider";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useToast } from "@/components/ui/ToastProvider";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getCatalogStatusInfo } from "@/lib/catalog/status";
import { PRODUCT_OPTIONS } from "@/lib/catalog/product-options";

const { colors: COLORS, sets: SETS, logos: LOGOS, patterns: PATTERNS, materials: MATERIALS, accessories: ACCESSORIES } = PRODUCT_OPTIONS;

export default function ProductPageClient({ brand, model }: { brand: Brand; model: Model }) {
  const { t, href } = useT();
  const { add } = useCart();
  const toast = useToast();

  const [color, setColor] = useState<(typeof COLORS)[number]>(COLORS[0]);
  const [piping, setPiping] = useState<(typeof COLORS)[number]>(COLORS[8]);
  const [pattern, setPattern] = useState<(typeof PATTERNS)[number]>(PATTERNS[0]);
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]>(MATERIALS[0]);
  const [accessories, setAccessories] = useState<string[]>(["heelPad"]);
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [setType, setSetType] = useState<(typeof SETS)[number]>(SETS[1]);
  const [logo, setLogo] = useState<(typeof LOGOS)[number]>(LOGOS[1]);
  const [body] = useState<string | undefined>(model.bodyType);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const availability = getCatalogStatusInfo(model.catalogStatus);

  const unitPrice = useMemo(() => setType.basePrice + logo.addon, [setType, logo]);
  const total = unitPrice * qty;

  const handleAdd = () => {
    if (!availability.orderable) return;
    const id = [brand.slug, model.slug, body ?? "default", pattern.id, material.id, color.id, piping.id, setType.id, logo.id, accessories.join("-")].join(":");
    add({
      id,
      brandSlug: brand.slug,
      brandName: brand.name,
      modelSlug: model.slug,
      modelName: model.name,
      fullName: model.fullName,
      years: model.years,
      bodyType: body,
      pattern: pattern.id,
      material: material.id,
      color: color.id,
      piping: piping.id,
      logo: logo.id,
      customLogoUrl: logo.id === "custom" ? customLogoUrl : undefined,
      accessories,
      setType: setType.id,
      unitPrice,
      qty,
    });
    setAdded(true);
    toast.show(t("toast.added"));
    window.setTimeout(() => setAdded(false), 1800);
  };

  const flags: string[] = [];
  if (model.has3D) flags.push(t("flag.threeD"));
  if (model.hasTrunk) flags.push(t("flag.trunk"));
  if (model.tekParca) flags.push(t("flag.onePiece"));

  return (
    <div className="container-app py-10 md:py-14">
      <Breadcrumbs
        items={[
          { label: t("brands.title"), href: href("/shop") },
          { label: brand.name, href: href(`/shop/${brand.slug}`) },
          { label: model.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <MatPreview
            color={color.hex}
            piping={piping.hex}
            logo={logo.id}
            brandName={logo.id === "brand" ? brand.name : undefined}
            className="aspect-[5/4]"
          />
          <div className="grid grid-cols-3 gap-3">
            <MatPreview color={color.hex} piping={piping.hex} className="aspect-[5/4]" />
            <MatPreview color={color.hex} piping={piping.hex} className="aspect-[5/4]" />
            <MatPreview color={color.hex} piping={piping.hex} className="aspect-[5/4]" />
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold md:text-4xl">
                {brand.name} {model.name}
              </h1>
              <div className="mt-1 text-sm text-fg-mute">
                {t("models.years")}: {model.years}
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${availability.orderable ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${availability.orderable ? "bg-success" : "bg-danger"}`} />
              {availability.orderable ? t("product.inStock") : t(`product.status.${availability.status}`)}
            </span>
          </div>

          {(model.bodyType || flags.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {model.bodyType && <span className="pill">{model.bodyType}</span>}
              {flags.map((f) => (
                <span key={f} className="badge">{f}</span>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-baseline gap-3 rounded-xl border border-line bg-accent-soft/60 px-4 py-3">
            <div className="gradient-text font-display text-3xl font-bold">{total.toLocaleString("tr-TR")} ₺</div>
            {qty > 1 && (
              <div className="text-xs text-fg-mute">
                {qty} × {unitPrice.toLocaleString("tr-TR")} ₺
              </div>
            )}
          </div>

          <Section title="1. Hücre Formu">
            <OptionButtons options={PATTERNS} value={pattern.id} onChange={setPattern} />
          </Section>

          <Section title="2. Mat Rengi">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <SwatchButton key={c.id} active={color.id === c.id} hex={c.hex} label={c.label} onClick={() => setColor(c)} />
              ))}
            </div>
          </Section>

          <Section title="3. Kenar Rengi">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <SwatchButton key={c.id} active={piping.id === c.id} hex={c.hex} label={c.label} onClick={() => setPiping(c)} />
              ))}
            </div>
          </Section>

          <Section title="4. Mat Kalitesi">
            <OptionButtons options={MATERIALS} value={material.id} onChange={setMaterial} />
          </Section>

          <Section title="5. Aksesuarlar">
            <div className="flex flex-wrap gap-5">
              {ACCESSORIES.map((item) => (
                <label key={item.id} className="flex items-center gap-2 text-sm text-fg-soft">
                  <input
                    type="checkbox"
                    checked={accessories.includes(item.id)}
                    onChange={(event) => setAccessories((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))}
                    className="accent-accent"
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </Section>

          <Section title={t("product.set")}>
            <div className="grid gap-2 sm:grid-cols-3">
              {SETS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSetType(s)}
                  className={`rounded-lg border p-3 text-start text-sm transition ${
                    setType.id === s.id
                      ? "border-accent bg-accent-soft ring-1 ring-accent/30"
                      : "border-line hover:border-line-strong"
                  }`}
                >
                  <div className="font-semibold">{t(s.labelKey)}</div>
                  <div className="text-xs text-fg-mute">{s.basePrice.toLocaleString("tr-TR")} ₺</div>
                </button>
              ))}
            </div>
          </Section>

          <Section title={t("product.logo")}>
            <div className="grid gap-2 sm:grid-cols-3">
              {LOGOS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLogo(l)}
                  className={`rounded-lg border p-3 text-start text-sm transition ${
                    logo.id === l.id
                      ? "border-accent bg-accent-soft ring-1 ring-accent/30"
                      : "border-line hover:border-line-strong"
                  }`}
                >
                  <div className="font-semibold">{t(l.labelKey)}</div>
                  {l.addon > 0 && <div className="text-xs text-fg-mute">+{l.addon} ₺</div>}
                </button>
              ))}
            </div>
            {logo.id === "custom" && (
              <label className="mt-3 block rounded-xl border border-dashed border-line p-4 text-sm text-fg-soft">
                <span className="mb-2 block font-medium text-fg">Özel logoyu yükle</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploadingLogo}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setUploadingLogo(true);
                    const form = new FormData();
                    form.set("file", file);
                    const response = await fetch("/api/uploads/logo", { method: "POST", body: form });
                    const result = await response.json().catch(() => ({}));
                    if (response.ok) setCustomLogoUrl(result.url);
                    else toast.show(result.error ?? "upload_failed");
                    setUploadingLogo(false);
                  }}
                />
                <span className="mt-2 block text-xs text-fg-mute">
                  {uploadingLogo ? "Yükleniyor..." : customLogoUrl ? "Logo yüklendi" : "PNG, JPG veya WebP · en fazla 3 MB"}
                </span>
              </label>
            )}
          </Section>

          <Section title={t("product.qty")}>
            <div className="inline-flex items-center rounded-full border border-line">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2 text-lg leading-none">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button type="button" onClick={() => setQty((q) => q + 1)} className="px-4 py-2 text-lg leading-none">+</button>
            </div>
          </Section>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleAdd} disabled={!availability.orderable || (logo.id === "custom" && !customLogoUrl)} className="btn-primary px-7 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-45">
              {added ? "✓ " : ""}{t("product.addToCart")}
            </button>
            <Link href={href("/cart")} className="btn-secondary px-7 py-3.5 text-base">
              {t("nav.cart")}
            </Link>
          </div>
          {!availability.orderable && (
            <p className="mt-3 max-w-xl rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-fg-soft">
              {model.catalogNote || t(`product.statusHelp.${availability.status}`)}
            </p>
          )}

          <div className="mt-10 surface p-5">
            <div className="text-sm font-semibold">{t("product.specs")}</div>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <Spec k={t("product.spec.material")} v={t("product.spec.materialVal")} />
              <Spec k={t("product.spec.fit")} v={t("product.spec.fitVal")} />
              <Spec k={t("product.spec.season")} v={t("product.spec.seasonVal")} />
              <Spec k={t("product.spec.warranty")} v={t("product.spec.warrantyVal")} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-fg-mute">{title}</div>
      {children}
    </div>
  );
}

function SwatchButton({ active, hex, label, onClick }: { active: boolean; hex: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`grid h-8 w-8 place-items-center rounded-full border transition ${
        active ? "border-accent bg-accent-soft ring-1 ring-accent/30" : "border-line hover:border-line-strong"
      }`}
    >
      <span className={`h-5 w-5 rounded-full ring-1 ${active ? "ring-accent" : "ring-line"}`} style={{ background: hex }} />
    </button>
  );
}

function OptionButtons<T extends { id: string; label: string }>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: string;
  onChange: (option: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${value === option.id ? "border-accent bg-accent text-accent-fg" : "border-line bg-bg-elevated text-fg-soft hover:border-line-strong"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-fg-mute">{k}</dt>
      <dd className="mt-0.5 font-medium">{v}</dd>
    </div>
  );
}
