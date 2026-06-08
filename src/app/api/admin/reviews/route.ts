import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireApiRole } from "@/lib/auth/apiGuard";

type GoogleReview = {
  name?: string;
  rating?: number;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
};

export async function GET() {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ reviews: await prisma.review.findMany({ orderBy: { createdAt: "desc" } }) });
}

export async function POST() {
  const user = await requireApiRole(["DIRECTOR"]);
  if (!user) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const branches = await prisma.branch.findMany({ where: { googlePlaceId: { not: null }, isActive: true }, select: { googlePlaceId: true } });
  if (!apiKey || branches.length === 0) return NextResponse.json({ error: "google_reviews_not_configured" }, { status: 503 });

  let imported = 0;
  for (const branch of branches) {
    const response = await fetch(`https://places.googleapis.com/v1/places/${branch.googlePlaceId}?fields=reviews&languageCode=tr`, {
      headers: { "X-Goog-Api-Key": apiKey },
      next: { revalidate: 3600 },
    });
    if (!response.ok) continue;
    const data = await response.json() as { reviews?: GoogleReview[] };
    for (const review of data.reviews ?? []) {
      if (!review.name || !review.text?.text || !review.authorAttribution?.displayName) continue;
      await prisma.review.upsert({
        where: { googleReviewId: review.name },
        update: {
          authorName: review.authorAttribution.displayName,
          authorImage: review.authorAttribution.photoUri ?? null,
          rating: review.rating ?? 5,
          text: review.text.text,
          sourceUrl: review.authorAttribution.uri ?? "https://maps.google.com",
          isVerified: true,
        },
        create: {
          googleReviewId: review.name,
          authorName: review.authorAttribution.displayName,
          authorImage: review.authorAttribution.photoUri ?? null,
          rating: review.rating ?? 5,
          text: review.text.text,
          sourceUrl: review.authorAttribution.uri ?? "https://maps.google.com",
          isVerified: true,
          isPublished: false,
        },
      });
      imported++;
    }
  }
  return NextResponse.json({ imported });
}
