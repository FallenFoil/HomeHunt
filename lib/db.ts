import { promises as fs } from "fs";
import path from "path";
import type { House } from "@/types/house";

const DB_PATH = path.join(process.cwd(), "database", "database.json");

type DbShape = { houses: House[] };

const EMPTY: DbShape = { houses: [] };

async function readDb(): Promise<DbShape> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    if (!raw.trim()) return { houses: [] };
    const parsed = JSON.parse(raw) as Partial<DbShape>;
    return { houses: Array.isArray(parsed.houses) ? parsed.houses : [] };
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { houses: [] };
    throw err;
  }
}

async function writeDb(data: DbShape): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

let chain: Promise<unknown> = Promise.resolve();

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.catch(() => {});
  return next;
}

export function listHouses(): Promise<House[]> {
  return serialize(async () => (await readDb()).houses);
}

export function getHouse(id: string): Promise<House | undefined> {
  return serialize(async () => (await readDb()).houses.find((h) => h.id === id));
}

export function createHouse(input: Omit<House, "id" | "createdAt" | "updatedAt">): Promise<House> {
  return serialize(async () => {
    const db = await readDb();
    const now = new Date().toISOString();
    const house: House = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    db.houses.unshift(house);
    await writeDb(db);
    return house;
  });
}

export function updateHouse(id: string, patch: Partial<House>): Promise<House | undefined> {
  return serialize(async () => {
    const db = await readDb();
    const idx = db.houses.findIndex((h) => h.id === id);
    if (idx === -1) return undefined;
    const updated: House = {
      ...db.houses[idx],
      ...patch,
      id: db.houses[idx].id,
      createdAt: db.houses[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    db.houses[idx] = updated;
    await writeDb(db);
    return updated;
  });
}

export function deleteHouse(id: string): Promise<boolean> {
  return serialize(async () => {
    const db = await readDb();
    const before = db.houses.length;
    db.houses = db.houses.filter((h) => h.id !== id);
    if (db.houses.length === before) return false;
    await writeDb(db);
    return true;
  });
}

export const _testing = { EMPTY };
