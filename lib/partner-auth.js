import "server-only";

import { createSessionToken, getSessionSecret, parseSessionToken } from "@/lib/auth";
import {
  AFFILIATE_PARTNERS,
  getAffiliatePartnerById,
  getPartnerPasswordEnvName,
} from "@/lib/affiliate";

export const PARTNER_COOKIE = "mpark_partner";

const isProd = process.env.NODE_ENV === "production";

export function getPartnerSessionSecret() {
  const secret =
    process.env.PARTNER_SESSION_SECRET ||
    (!isProd ? `${getSessionSecret()}-partner` : null);
  if (!secret) {
    throw new Error("Missing PARTNER_SESSION_SECRET (required in production).");
  }
  return secret;
}

export function getPartnerPassword(partnerId) {
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) {
    throw new Error(`Unknown partner: ${partnerId}`);
  }

  const envName = getPartnerPasswordEnvName(partner.id);
  const password =
    process.env[envName] || (!isProd && partner.id === "lovci" ? "lovci-demo" : null);

  if (!password) {
    throw new Error(`Missing ${envName} (required in production).`);
  }

  return password;
}

export function getPartnerAuthConfigError(partnerId) {
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) return "Unknown partner";
  if (!isProd) return null;
  if (!process.env.PARTNER_SESSION_SECRET) {
    return "Missing PARTNER_SESSION_SECRET";
  }
  if (!process.env[getPartnerPasswordEnvName(partnerId)]) {
    return `Missing ${getPartnerPasswordEnvName(partnerId)}`;
  }
  return null;
}

export function createPartnerSessionToken(partnerId) {
  const partner = getAffiliatePartnerById(partnerId);
  if (!partner) {
    throw new Error(`Unknown partner: ${partnerId}`);
  }
  return createSessionToken(getPartnerSessionSecret(), {
    role: "partner",
    partnerId: partner.id,
  });
}

export function parsePartnerSessionToken(token) {
  const payload = parseSessionToken(token, getPartnerSessionSecret());
  if (!payload || payload.role !== "partner" || typeof payload.partnerId !== "string") {
    return null;
  }
  const partner = getAffiliatePartnerById(payload.partnerId);
  if (!partner) return null;
  return payload;
}

export function getPartnerCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    path: "/",
  };
}

export function listConfiguredPartners() {
  return Object.values(AFFILIATE_PARTNERS);
}
