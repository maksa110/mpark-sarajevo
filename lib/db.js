import "server-only";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

const dataFile = (() => {
  const raw = process.env.RESERVATIONS_FILE || "./data/reservations.json";
  return isAbsolute(raw) ? raw : join(process.cwd(), raw);
})();

mkdirSync(dirname(dataFile), { recursive: true });

let rows = [];

/** Read reservations from disk every time (no in-memory cache) so manual resets / file edits show up immediately. */
function load() {
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
  writeFileSync(dataFile, JSON.stringify(rows, null, 0), "utf8");
}

export function insertReservation(row) {
  load();
  rows.push({ ...row });
  persist();
}

export function getReservation(id) {
  load();
  return rows.find((x) => x.id === id) || null;
}

export function deleteReservation(id) {
  load();
  const n = rows.length;
  rows = rows.filter((x) => x.id !== id);
  if (rows.length === n) return false;
  persist();
  return true;
}

export function listReservations({ search = "" } = {}) {
  load();
  let out = [...rows];
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
