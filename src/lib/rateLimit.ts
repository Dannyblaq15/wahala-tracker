import { NextResponse } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds (e.g., 60000 for 1 minute)
  limit: number;    // Max requests allowed within the windowMs
}

class SlidingWindowLimiter {
  private cache = new Map<string, number[]>();

  constructor() {
    // Run periodic cleanup every 5 minutes to avoid memory leaks
    if (typeof window === 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  public limit(key: string, limit: number, windowMs: number): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get current requests for the key
    let timestamps = this.cache.get(key) || [];

    // Filter out timestamps older than the window
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    if (timestamps.length >= limit) {
      const oldestActive = timestamps[0];
      const resetTime = oldestActive + windowMs;
      this.cache.set(key, timestamps);
      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current request timestamp
    timestamps.push(now);
    this.cache.set(key, timestamps);

    return {
      success: true,
      limit,
      remaining: limit - timestamps.length,
      reset: now + windowMs,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, timestamps] of this.cache.entries()) {
      const activeTimestamps = timestamps.filter((t) => t > now - 60 * 60 * 1000); // clear anything older than an hour
      if (activeTimestamps.length === 0) {
        this.cache.delete(key);
      } else {
        this.cache.set(key, activeTimestamps);
      }
    }
  }
}

// Global instance to persist across requests in development server memory
const limiter = new SlidingWindowLimiter();

export function getIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp || '127.0.0.1';
}

export function rateLimit(
  request: Request,
  config: RateLimitConfig = { windowMs: 60 * 1000, limit: 10 }
): NextResponse | null {
  const ip = getIP(request);
  // Create a compound key including the path to rate-limit endpoints individually
  const url = new URL(request.url);
  const key = `${ip}:${url.pathname}`;

  const res = limiter.limit(key, config.limit, config.windowMs);

  if (!res.success) {
    const secondsToWait = Math.ceil((res.reset - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: `Too many requests. Abeg calm down and try again in ${secondsToWait} seconds. 🛑`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': secondsToWait.toString(),
          'X-RateLimit-Limit': res.limit.toString(),
          'X-RateLimit-Remaining': res.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(res.reset / 1000).toString(),
        },
      }
    );
  }

  return null;
}
