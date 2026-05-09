// Simple in-memory rate limiter using a sliding window counter.
// Resets are per-key, so it handles multiple users independently.
// NOTE: This is per-process — on multi-instance deployments use Redis instead.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSec: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + opts.windowSec * 1000 };
    store.set(key, entry);
  }

  entry.count += 1;
  const allowed = entry.count <= opts.limit;
  const remaining = Math.max(0, opts.limit - entry.count);

  return { allowed, remaining, resetAt: entry.resetAt };
}

// Clean up expired entries periodically to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}, 60_000);