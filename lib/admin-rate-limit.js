import "server-only";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const BLOCK_MS = 15 * 60 * 1000;

const attempts = new Map();

function pruneEntry(entry, now) {
  if (!entry) return null;

  const recentAttempts = entry.attempts.filter((ts) => now - ts < WINDOW_MS);
  const blockedUntil =
    typeof entry.blockedUntil === "number" && entry.blockedUntil > now
      ? entry.blockedUntil
      : 0;

  if (recentAttempts.length === 0 && !blockedUntil) {
    return null;
  }

  return {
    attempts: recentAttempts,
    blockedUntil,
  };
}

function getEntry(key, now = Date.now()) {
  const next = pruneEntry(attempts.get(key), now);
  if (next) {
    attempts.set(key, next);
  } else {
    attempts.delete(key);
  }
  return next;
}

export function getClientKey(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function getAdminLoginRateLimitState(key) {
  const now = Date.now();
  const entry = getEntry(key, now);
  const retryAfterMs =
    entry?.blockedUntil && entry.blockedUntil > now ? entry.blockedUntil - now : 0;

  return {
    blocked: retryAfterMs > 0,
    retryAfterMs,
  };
}

export function recordAdminLoginFailure(key) {
  const now = Date.now();
  const current = getEntry(key, now) || { attempts: [], blockedUntil: 0 };
  const attemptsList = [...current.attempts, now];

  attempts.set(key, {
    attempts: attemptsList,
    blockedUntil: attemptsList.length >= MAX_ATTEMPTS ? now + BLOCK_MS : 0,
  });
}

export function clearAdminLoginFailures(key) {
  attempts.delete(key);
}
