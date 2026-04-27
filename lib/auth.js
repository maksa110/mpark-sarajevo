import "server-only";
import crypto from "node:crypto";

export const COOKIE = "mpark_admin";

const isProd = process.env.NODE_ENV === "production";

export function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SESSION_SECRET ||
    (!isProd ? "dev-admin-session-secret" : null);
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET (required in production).");
  }
  return secret;
}

export function getAdminPassword() {
  const pw = process.env.ADMIN_PASSWORD || (!isProd ? "admin" : null);
  if (!pw) {
    throw new Error("Missing ADMIN_PASSWORD (required in production).");
  }
  return pw;
}

export function createSessionToken(secret = getSessionSecret()) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function parseSessionToken(token, secret = getSessionSecret()) {
  if (!token || !secret) return null;
  const i = token.lastIndexOf(".");
  if (i === -1) return null;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  const bs = Buffer.from(sig, "utf8");
  const be = Buffer.from(expected, "utf8");
  if (bs.length !== be.length) return null;
  if (!crypto.timingSafeEqual(bs, be)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function timingSafePasswordEqual(a, b) {
  const ba = Buffer.from(String(a), "utf8");
  const bb = Buffer.from(String(b), "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;
