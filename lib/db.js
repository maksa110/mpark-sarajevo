import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { Readable } from "node:stream";
import { text as streamToString } from "node:stream/consumers";
import { checkReservationCapacity } from "@/lib/parking-capacity";
import { sanitizeReservationRecord } from "@/lib/reservation-record";

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
let storeLock = Promise.resolve();

function withStoreLock(task) {
  const run = storeLock.then(task, task);
  storeLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

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
  const snapshot = await loadBlobSnapshot();
  return snapshot.rows;
}

async function loadBlobSnapshot() {
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
      return { rows: [], etag: null };
    }
    const raw = await readBlobStream(res.stream);
    if (!raw.trim()) return { rows: [], etag: res.blob?.etag || null };
    const parsed = JSON.parse(raw);
    return {
      rows: Array.isArray(parsed) ? parsed : [],
      etag: res.blob?.etag || null,
    };
  } catch (e) {
    if (e?.name === "BlobNotFoundError" || e?.message?.includes("404")) {
      return { rows: [], etag: null };
    }
    throw e;
  }
}

async function persistBlob(nextRows, { ifMatch } = {}) {
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
    ...(ifMatch ? { ifMatch } : {}),
  });
}

function isBlobPreconditionError(error) {
  return error?.name === "BlobPreconditionFailedError";
}

function filterAndSort(list, search) {
  let out = list.map((row) => sanitizeReservationRecord(row));
  const q = search.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.affiliatePartnerName &&
          r.affiliatePartnerName.toLowerCase().includes(q)) ||
        (r.affiliatePartnerId &&
          r.affiliatePartnerId.toLowerCase().includes(q)) ||
        (r.promoCode && r.promoCode.toLowerCase().includes(q))
    );
  }
  out.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return out;
}

export async function insertReservation(row) {
  requireVercelStorage();
  const nextRow = sanitizeReservationRecord(row);
  if (usesVercelBlob()) {
    const b = await loadBlob();
    b.push({ ...nextRow });
    await persistBlob(b);
  } else {
    load();
    rows.push({ ...nextRow });
    persist();
  }
}

export async function createReservationIfCapacityAvailable(row) {
  requireVercelStorage();
  const nextRow = sanitizeReservationRecord(row);

  return withStoreLock(async () => {
    const currentRows = usesVercelBlob()
      ? await loadBlob()
      : (load(), [...rows]);

    const capacity = checkReservationCapacity(currentRows, nextRow);
    if (!capacity.ok) {
      return { ok: false, code: capacity.code };
    }

    const nextRows = [...currentRows, { ...nextRow }];
    if (usesVercelBlob()) {
      await persistBlob(nextRows);
    } else {
      rows = nextRows;
      persist();
    }

    return { ok: true };
  });
}

export async function getReservation(id) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    const b = await loadBlob();
    const row = b.find((x) => x.id === id) || null;
    return row ? sanitizeReservationRecord(row) : null;
  }
  load();
  const row = rows.find((x) => x.id === id) || null;
  return row ? sanitizeReservationRecord(row) : null;
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

export async function updateReservation(id, updater) {
  requireVercelStorage();

  return withStoreLock(async () => {
    if (usesVercelBlob()) {
      // Vercel functions can overlap. ETag retries prevent two workers from
      // claiming the same review email from the same stale Blob snapshot.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const snapshot = await loadBlobSnapshot();
        const index = snapshot.rows.findIndex((row) => row.id === id);
        if (index === -1) return null;

        const currentRow = sanitizeReservationRecord(snapshot.rows[index]);
        const updatedRow = sanitizeReservationRecord(
          await updater({ ...currentRow })
        );
        const nextRows = [...snapshot.rows];
        nextRows[index] = updatedRow;

        try {
          await persistBlob(nextRows, { ifMatch: snapshot.etag });
          return updatedRow;
        } catch (error) {
          if (!isBlobPreconditionError(error) || attempt === 4) throw error;
        }
      }
    }

    load();
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) return null;

    const currentRow = sanitizeReservationRecord(rows[index]);
    const updatedRow = sanitizeReservationRecord(await updater({ ...currentRow }));
    const nextRows = [...rows];
    nextRows[index] = updatedRow;
    rows = nextRows;
    persist();

    return updatedRow;
  });
}
