import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

const kvUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");

export const storageMode: "kv" | "file" = kvUrl && kvToken ? "kv" : "file";

const KEY_PREFIX = "gid:";
const SAFE_NAME = /^[a-z0-9][a-z0-9._-]{0,120}$/i;

async function kv<T = unknown>(command: (string | number)[]): Promise<T> {
  const response = await fetch(kvUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Storage request failed with status ${response.status}`);
  }
  const payload = (await response.json()) as { result: T; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

const queues = new Map<string, Promise<unknown>>();

function serialize<T>(key: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(key) ?? Promise.resolve();
  const next = previous.then(task, task);
  queues.set(
    key,
    next.catch(() => undefined),
  );
  return next;
}

function docPath(key: string) {
  if (!SAFE_NAME.test(key)) throw new Error("Invalid storage key");
  return path.join(dataDir, `${key}.json`);
}

async function readRaw(key: string): Promise<string | null> {
  if (storageMode === "kv") {
    return kv<string | null>(["GET", `${KEY_PREFIX}${key}`]);
  }
  try {
    return await fs.readFile(docPath(key), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function writeRaw(key: string, value: string) {
  if (storageMode === "kv") {
    await kv(["SET", `${KEY_PREFIX}${key}`, value]);
    return;
  }
  await fs.mkdir(dataDir, { recursive: true });
  const target = docPath(key);
  const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporary, value, "utf8");
  await fs.rename(temporary, target);
}

export async function readDoc<T>(key: string, fallback: T): Promise<T> {
  const raw = await readRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function updateDoc<T>(key: string, fallback: T, mutate: (current: T) => T | Promise<T>): Promise<T> {
  return serialize(key, async () => {
    const current = await readDoc<T>(key, fallback);
    const next = await mutate(current);
    await writeRaw(key, JSON.stringify(next));
    return next;
  });
}

export async function incrementCounter(name: string, field: string) {
  if (storageMode === "kv") {
    await kv(["HINCRBY", `${KEY_PREFIX}${name}`, field, 1]);
    return;
  }
  await updateDoc<Record<string, number>>(name, {}, (current) => ({ ...current, [field]: (current[field] ?? 0) + 1 }));
}

export async function readCounters(name: string): Promise<Record<string, number>> {
  if (storageMode === "kv") {
    const flat = await kv<string[] | null>(["HGETALL", `${KEY_PREFIX}${name}`]);
    const result: Record<string, number> = {};
    for (let index = 0; flat && index < flat.length; index += 2) {
      result[flat[index]] = Number(flat[index + 1]) || 0;
    }
    return result;
  }
  return readDoc<Record<string, number>>(name, {});
}

export async function saveMedia(name: string, mime: string, bytes: Uint8Array) {
  if (!SAFE_NAME.test(name)) throw new Error("Invalid media name");
  if (storageMode === "kv") {
    await kv(["SET", `${KEY_PREFIX}media:${name}`, `${mime}|${Buffer.from(bytes).toString("base64")}`]);
    return;
  }
  const dir = path.join(dataDir, "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  await fs.writeFile(path.join(dir, `${name}.mime`), mime, "utf8");
}

export async function readMedia(name: string): Promise<{ mime: string; bytes: Buffer } | null> {
  if (!SAFE_NAME.test(name)) return null;
  if (storageMode === "kv") {
    const stored = await kv<string | null>(["GET", `${KEY_PREFIX}media:${name}`]);
    if (!stored) return null;
    const separator = stored.indexOf("|");
    return { mime: stored.slice(0, separator), bytes: Buffer.from(stored.slice(separator + 1), "base64") };
  }
  try {
    const dir = path.join(dataDir, "uploads");
    const [bytes, mime] = await Promise.all([fs.readFile(path.join(dir, name)), fs.readFile(path.join(dir, `${name}.mime`), "utf8")]);
    return { mime, bytes };
  } catch {
    return null;
  }
}
