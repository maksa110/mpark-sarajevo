import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { Readable } from "node:stream";
import { text as streamToString } from "node:stream/consumers";

const BLOB_PATH = "mpark/affiliate-clicks.json";

function getDataFile() {
  const raw =
    process.env.AFFILIATE_CLICKS_FILE || "./data/affiliate-clicks.json";
  return isAbsolute(raw) ? raw : join(process.cwd(), raw);
}

function usesVercelBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

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

let clickRows = {};
let clickLock = Promise.resolve();

function withLock(task) {
  const run = clickLock.then(task, task);
  clickLock = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

function loadFile() {
  const dataFile = getDataFile();
  if (!existsSync(dataFile)) {
    clickRows = {};
    return;
  }
  try {
    const raw = readFileSync(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    clickRows = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    clickRows = {};
  }
}

function persistFile() {
  const dataFile = getDataFile();
  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, JSON.stringify(clickRows, null, 0), "utf8");
}

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
      return {};
    }
    const raw = await readBlobStream(res.stream);
    if (!raw.trim()) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    if (error?.name === "BlobNotFoundError" || error?.message?.includes("404")) {
      return {};
    }
    throw error;
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

export async function incrementAffiliateClick(partnerId) {
  requireVercelStorage();

  return withLock(async () => {
    const current = usesVercelBlob() ? await loadBlob() : (loadFile(), { ...clickRows });
    const next = {
      ...current,
      [partnerId]: Number(current[partnerId] || 0) + 1,
    };

    if (usesVercelBlob()) {
      await persistBlob(next);
    } else {
      clickRows = next;
      persistFile();
    }

    return next[partnerId];
  });
}

export async function getAffiliateClickCount(partnerId) {
  requireVercelStorage();
  if (usesVercelBlob()) {
    const rows = await loadBlob();
    return Number(rows[partnerId] || 0);
  }
  loadFile();
  return Number(clickRows[partnerId] || 0);
}
