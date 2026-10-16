import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type HousekeepingStatus = "clean" | "dirty" | "cleaning";

export type HousekeepingRecord = {
  roomId: string;
  status: HousekeepingStatus;
  updatedAt: string;
};

const filePath = join(process.cwd(), ".demo-data", "housekeeping.json");

export async function readHousekeeping(): Promise<Record<string, HousekeepingRecord>> {
  try {
    const data = JSON.parse(await readFile(filePath, "utf8"));
    return data && typeof data === "object" ? data as Record<string, HousekeepingRecord> : {};
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
    throw error;
  }
}

export async function writeHousekeeping(statuses: Record<string, HousekeepingRecord>) {
  await writeFile(filePath, JSON.stringify(statuses, null, 2), "utf8");
}

export async function setHousekeepingStatus(roomId: string, status: HousekeepingStatus) {
  const current = await readHousekeeping();
  current[roomId] = { roomId, status, updatedAt: new Date().toISOString() };
  await writeHousekeeping(current);
  return current[roomId];
}
