"use client";

import { useState } from "react";
import { adminTranslator } from "@/lib/admin/i18n";
import type { Locale } from "@/lib/i18n/config";
import Avatar from "@/components/ui/Avatar";

type Review = { id: string; authorName: string; authorImage: string | null; rating: number; text: string; sourceUrl: string; isVerified: boolean; isPublished: boolean; createdAt: string; updatedAt: string; googleReviewId: string | null };

export default function AdminReviewsClient({ initial, locale }: { initial: Review[]; locale: string }) {
  const t = adminTranslator(locale as Locale);
  const [items, setItems] = useState(initial);
  const [message, setMessage] = useState("");
  const sync = async () => {
    setMessage("...");
    const response = await fetch("/api/admin/reviews", { method: "POST" });
    const result = await response.json().catch(() => ({}));
    setMessage(response.ok ? `Imported: ${result.imported}` : result.error ?? "sync_failed");
    if (response.ok) window.location.reload();
  };
  const toggle = async (item: Review) => {
    const response = await fetch(`/api/admin/reviews/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !item.isPublished }) });
    if (response.ok) setItems((current) => current.map((review) => review.id === item.id ? { ...review, isPublished: !review.isPublished } : review));
  };
  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">{t("nav.reviews")}</h1><p className="mt-2 text-sm text-fg-soft">Google Places API · verified reviews are published only after approval.</p></div><div><button type="button" onClick={sync} className="btn-primary">Sync Google</button>{message && <div className="mt-2 text-xs text-fg-mute">{message}</div>}</div></div><div className="mt-6 grid gap-4 lg:grid-cols-2">{items.map((item) => <article key={item.id} className="card p-5"><div className="flex items-center gap-3"><Avatar src={item.authorImage} name={item.authorName} /><div><strong className="block">{item.authorName}</strong><span className="text-xs text-gold">{"★".repeat(item.rating)}</span></div><button type="button" onClick={() => toggle(item)} className={`ms-auto rounded-full px-3 py-1 text-xs font-semibold ${item.isPublished ? "bg-success/15 text-success" : "bg-bg-muted text-fg-soft"}`}>{item.isPublished ? "Published" : "Hidden"}</button></div><p className="mt-4 text-sm leading-relaxed text-fg-soft">{item.text}</p><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-accent">Google Maps ↗</a></article>)}</div>{items.length === 0 && <div className="card mt-6 p-12 text-center text-fg-mute">No verified reviews. Configure GOOGLE_PLACES_API_KEY and branch Place IDs.</div>}</div>;
}
