import "server-only";
import { randomBytes, randomInt, randomUUID, createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { availablePhysicalRooms } from "./availability";
import { NoInventoryError, type ReservationDraft, type ReservationRepository } from "./repository";
import type { PhysicalRoom } from "@/types/inventory";
import type { Reservation } from "@/types/reservation";

export const receiptHash = (token: string) => createHash("sha256").update(token).digest("hex");

function addDays(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function seedReservations(): Reservation[] {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const inThree = addDays(today, 3);
  const inFive = addDays(today, 5);
  const inSeven = addDays(today, 7);

  const base = (reservationNumber: string, overrides: Partial<Reservation>): Reservation => ({
    id: reservationNumber,
    reservationNumber,
    guest: {
      firstName: "Demo",
      lastName: "Guest",
      email: "demo.guest@example.com",
      phone: "+63 917 555 1234",
      country: "Philippines",
      address: "",
    },
    roomId: "ocean-view",
    roomSlug: "ocean-view-room",
    roomName: "Ocean View Room",
    assignedRoomIds: ["o201"],
    checkIn: today,
    checkOut: inThree,
    nights: 3,
    adults: 2,
    children: 0,
    rooms: 1,
    roomRate: 12800,
    roomSubtotal: 38400,
    extras: [],
    extrasSubtotal: 0,
    grandTotal: 38400,
    specialRequests: "Quiet room near the pool, please.",
    arrivalTime: "15:00",
    paymentMethod: "pay_at_hotel",
    paymentStatus: "pending",
    reservationStatus: "confirmed",
    receiptTokenHash: "00".repeat(32),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    ...overrides,
  });

  return [
    base("SOL-2025-000001", {
      guest: { firstName: "Ariana", lastName: "Dela Cruz", email: "ariana@example.com", phone: "+63 917 100 9001", country: "Philippines", address: "Makati City" },
      roomId: "ocean-view",
      roomSlug: "ocean-view-room",
      roomName: "Ocean View Room",
      assignedRoomIds: ["o201"],
      checkIn: today,
      checkOut: dayAfter,
      nights: 2,
      adults: 2,
      children: 0,
      rooms: 1,
      roomRate: 12800,
      roomSubtotal: 25600,
      extrasSubtotal: 0,
      grandTotal: 25600,
      paymentMethod: "pay_at_hotel",
      paymentStatus: "pending",
      reservationStatus: "confirmed",
    }),
    base("SOL-2025-000002", {
      guest: { firstName: "Marcus", lastName: "Reyes", email: "marcus@example.com", phone: "+1 415 555 0178", country: "United States", address: "San Francisco, CA" },
      roomId: "garden-deluxe",
      roomSlug: "garden-deluxe-room",
      roomName: "Garden Deluxe Room",
      assignedRoomIds: ["g101"],
      checkIn: tomorrow,
      checkOut: inFive,
      nights: 4,
      adults: 2,
      children: 0,
      roomRate: 9800,
      roomSubtotal: 39200,
      grandTotal: 39200,
      paymentMethod: "bank_online",
      paymentStatus: "paid",
      reservationStatus: "confirmed",
    }),
    base("SOL-2025-000003", {
      guest: { firstName: "Lina", lastName: "Santos", email: "lina@example.com", phone: "+63 927 777 1190", country: "Philippines", address: "Cebu City" },
      roomId: "ocean-suite",
      roomSlug: "solavera-ocean-suite",
      roomName: "Solavéra Ocean Suite",
      assignedRoomIds: ["s301"],
      checkIn: inFive,
      checkOut: inSeven,
      nights: 2,
      adults: 2,
      children: 2,
      roomRate: 19800,
      roomSubtotal: 39600,
      grandTotal: 39600,
      paymentMethod: "bank_online",
      paymentStatus: "pending",
      reservationStatus: "pending",
    }),
  ];
}

export class DemoReservationRepository implements ReservationRepository {
  private queue: Promise<void> = Promise.resolve();
  constructor(private readonly filePath = join(process.cwd(), ".demo-data", "reservations.json")) {}

  private async writeReservations(reservations: Reservation[]) {
    await mkdir(dirname(this.filePath), { recursive: true });
    const tempPath = `${this.filePath}.${randomUUID()}.tmp`;
    await writeFile(tempPath, JSON.stringify(reservations, null, 2), { encoding: "utf8", flag: "wx" });
    await rename(tempPath, this.filePath);
  }

  private async read(): Promise<Reservation[]> {
    try {
      const data: unknown = JSON.parse(await readFile(this.filePath, "utf8"));
      if (!Array.isArray(data)) throw new Error("Invalid demo reservation file");
      return data as Reservation[];
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return [];
      throw error;
    }
  }

  async list(): Promise<Reservation[]> {
    const reservations = await this.read();
    if (reservations.length === 0) {
      const seeded = seedReservations();
      await this.writeReservations(seeded);
      return seeded;
    }
    return [...reservations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findByNumber(reservationNumber: string): Promise<Reservation | undefined> {
    return (await this.list()).find((reservation) => reservation.reservationNumber === reservationNumber);
  }

  async updateStatus(reservationNumber: string, change: Partial<Pick<Reservation, "reservationStatus" | "paymentStatus" | "updatedAt">>): Promise<Reservation> {
    const existing = await this.list();
    const index = existing.findIndex((reservation) => reservation.reservationNumber === reservationNumber);
    if (index === -1) throw new Error("Reservation not found.");
    const updated: Reservation = { ...existing[index], ...change, updatedAt: new Date().toISOString() };
    const next = [...existing];
    next[index] = updated;
    await this.writeReservations(next);
    return updated;
  }

  async create(draft: ReservationDraft, inventory: PhysicalRoom[]): Promise<{ reservation: Reservation; receiptToken: string }> {
    const operation = this.queue.then(async () => {
      const existing = await this.list();
      const available = availablePhysicalRooms(inventory, existing, draft.roomId, draft.checkIn, draft.checkOut);
      if (available.length < draft.rooms) throw new NoInventoryError("This room is no longer available for your selected dates. Please choose another room.");
      const year = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", year: "numeric" }).format(new Date());
      let reservationNumber = "";
      for (let attempt = 0; attempt < 30; attempt++) {
        const candidate = `SOL-${year}-${String(randomInt(0, 1_000_000)).padStart(6, "0")}`;
        if (!existing.some((reservation) => reservation.reservationNumber === candidate)) { reservationNumber = candidate; break; }
      }
      if (!reservationNumber) throw new Error("Could not create a unique reservation number");
      const receiptToken = randomBytes(32).toString("hex");
      const now = new Date().toISOString();
      const reservation: Reservation = { ...draft, id: randomUUID(), reservationNumber, assignedRoomIds: available.slice(0, draft.rooms).map((room) => room.id), receiptTokenHash: receiptHash(receiptToken), createdAt: now, updatedAt: now };
      await this.writeReservations([...existing, reservation]);
      return { reservation, receiptToken };
    });
    this.queue = operation.then(() => undefined, () => undefined);
    return operation;
  }
}

const configuredName = process.env.SOLAVERA_DEMO_STORE_NAME;
const storeName = configuredName && /^[a-z0-9-]+\.json$/.test(configuredName) ? configuredName : "reservations.json";
export const demoReservationRepository = new DemoReservationRepository(join(process.cwd(), ".demo-data", storeName));
