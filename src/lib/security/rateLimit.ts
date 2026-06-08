import { NextResponse } from "next/server";

/**
 * Lightweight in-memory rate limiter (per server instance). Good enough to blunt
 * brute-force/spam on a single-node deployment. For multi-instance/serverless at
 * scale, swap the Map for Redis/Upstash — the checkRateLimit() API stays the same.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// periodic cleanup so the map doesn't grow unbounded
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * @param key   unique bucket key (e.g. `register:${ip}`)
 * @param limit max requests allowed within the window
 * @param windowMs window length in ms
 * @returns { ok, remaining, retryAfter } — retryAfter in seconds when blocked
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  sweep(now);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

/** Convenience: returns a 429 NextResponse if over limit, otherwise null. */
export function rateLimitResponse(
  req: Request,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const { ok, retryAfter } = checkRateLimit(`${name}:${ip}`, limit, windowMs);
  if (ok) return null;
  return NextResponse.json(
    { error: "rate_limited", retryAfter },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}
