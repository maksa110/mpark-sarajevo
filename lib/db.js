import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { Readable } from "node:stream";
import { text as streamToString } from "node:stream/consumers";

const BLOB_PATH = "mpark/reservations.json";

function getDataFile() {
  const raw = process.env.RESERVATIONS_FILE || "./data/reservations.json";
  return isAbsolute(raw) ? raw : join(process.cwd(), raw);
}

/** Na Vercelu: Storage → Blob, token se injecta kao BLOB_READ_WRITE_TOKEN. Lokalno: JSON fajl. */
function usesVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Vercel postavlja VERCEL i/ili VERCEL_ENV; ne oslanjati se samo na VERCEL==="1". */
function isVercelRuntime() {
  if (process.env.VERCEL) return true;
  const env = process.env.VERCEL_ENV;
  return env === "production" || env === "preview";
}

function requireVercelStorage() {
  if (isVercelRuntime() && !process.env.BLOB_READ_WRITE_TOKEN) {
    const err = new Error("VERCEL_BLOB_REQUIRED");
    err.code = "VERCEL_BLOB_REQUIRED";
    throw err;
  }
}

async function readBlobStream(stream) {
  if (!stream) return "";
  try {
    return await streamToString(Readable.fromWeb(stream));
  } catch {
    return new Response(stream).text();
  }
}

// --- file (lokalno) — bez mkdir na importu (Vercel read-only) ---

let rows = [];

function load() {
  const dataFile = getDataFile();
  if (!existsSync(dataFile)) {
    rows = [];
    return;
  }
  try {
    const raw = readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    rows = Array.isArray(parsed) ? parsed : [];
  } catch {
    rows = [];
  }
}

function persist() {
  const dataFile = getDataFile();
  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, JSON.stringify(rows, null, 0), "utf8");
}

// --- Vercel Blob ---

async function loadBlob() {
  const { get } = await import("@vercel/blob");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing: create a Blob store in Vercel → Storage");
  }
  try {
    const res = await get(BLOB_PATH, {
      access: "private",
      token,
      useCache: false,
    });
    if (!res || res.statusCode !== 200 || !res.stream) {
      return [];
    }
    const raw = await readBlobStream(res.stream);
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    if (e?.name === "BlobNotFoundError" || e?.message?.includes("404")) {
      return [];
    }
    throw e;
  }
}

async function persistBlob(nextRows) {
  const { put } = await import("@vercel/blob");
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN missing: create a Blob store in Vercel → Storage");
  }
  await put(BLOB_PATH, JSON.stringify(nextRows, null, 0), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });
}

function filterAndSort(list, search) {
  let out = [...list];
  const q = search.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.email && r.email.toLowerCase().includes(q))
    );
  }
  out.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return out;
}

export async function insertReservation(row) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    const b = await loadBlob();
    b.push({ ...row });
    await persistBlob(b);
  } else {
    load();
    rows.push({ ...row });
    persist();
  }
}

export async function getReservation(id) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    const b = await loadBlob();
    return b.find((x) => x.id === id) || null;
  }
  load();
  return rows.find((x) => x.id === id) || null;
}

export async function deleteReservation(id) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    const b = await loadBlob();
    const n = b.length;
    const next = b.filter((x) => x.id !== id);
    if (next.length === n) return false;
    await persistBlob(next);
    return true;
  }
  load();
  const n = rows.length;
  rows = rows.filter((x) => x.id !== id);
  if (rows.length === n) return false;
  persist();
  return true;
}

export async function listReservations({ search = "" } = {}) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    return filterAndSort(await loadBlob(), search);
  }
  load();
  return filterAndSort([...rows], search);
}
