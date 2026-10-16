import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import { availablePhysicalRooms } from "./availability.ts";
import { NoInventoryError, type ReservationDraft, type ReservationRepository } from "./repository.ts";
import { getSupabaseAdminClient } from "../supabase.ts";
import type { PhysicalRoom } from "../../types/inventory.ts";
import type { Reservation } from "../../types/reservation.ts";

export const receiptHash = (token: string) => createHash("sha256").update(token).digest("hex");

export type SupabaseReservationRow = {
  id: string;
  reservation_number: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone: string;
  guest_country: string;
  guest_address: string;
  room_id: string;
  room_slug: string;
  room_name: string;
  assigned_room_ids: string[];
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  rooms: number;
  nights: number;
  room_rate: number;
  room_subtotal: number;
  extras: Reservation["extras"];
  extras_subtotal: number;
  grand_total: number;
  arrival_time: string;
  payment_method: Reservation["paymentMethod"];
  payment_status: Reservation["paymentStatus"];
  reservation_status: Reservation["reservationStatus"];
  special_requests: string;
  receipt_token_hash: string;
  created_at: string;
  updated_at: string;
};

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
    checkOut: dayAfter,
    nights: 2,
    adults: 2,
    children: 0,
    rooms: 1,
    roomRate: 12800,
    roomSubtotal: 25600,
    extras: [],
    extrasSubtotal: 0,
    grandTotal: 25600,
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
      checkOut: tomorrow,
      nights: 1,
      adults: 2,
      children: 0,
      rooms: 1,
      roomRate: 12800,
      roomSubtotal: 12800,
      grandTotal: 12800,
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

export function buildReservationRow(reservation: Reservation): SupabaseReservationRow {
  return {
    id: reservation.id,
    reservation_number: reservation.reservationNumber,
    guest_first_name: reservation.guest.firstName,
    guest_last_name: reservation.guest.lastName,
    guest_email: reservation.guest.email,
    guest_phone: reservation.guest.phone,
    guest_country: reservation.guest.country,
    guest_address: reservation.guest.address,
    room_id: reservation.roomId,
    room_slug: reservation.roomSlug,
    room_name: reservation.roomName,
    assigned_room_ids: reservation.assignedRoomIds,
    check_in: reservation.checkIn,
    check_out: reservation.checkOut,
    adults: reservation.adults,
    children: reservation.children,
    rooms: reservation.rooms,
    nights: reservation.nights,
    room_rate: reservation.roomRate,
    room_subtotal: reservation.roomSubtotal,
    extras: reservation.extras,
    extras_subtotal: reservation.extrasSubtotal,
    grand_total: reservation.grandTotal,
    arrival_time: reservation.arrivalTime,
    payment_method: reservation.paymentMethod,
    payment_status: reservation.paymentStatus,
    reservation_status: reservation.reservationStatus,
    special_requests: reservation.specialRequests,
    receipt_token_hash: reservation.receiptTokenHash,
    created_at: reservation.createdAt,
    updated_at: reservation.updatedAt,
  };
}

export function mapSupabaseReservation(row: Record<string, unknown>): Reservation {
  const extras = Array.isArray(row.extras) ? (row.extras as Reservation["extras"]) : [];
  const assignedRoomIds = Array.isArray(row.assigned_room_ids)
    ? row.assigned_room_ids.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id: typeof row.id === "string" ? row.id : randomUUID(),
    reservationNumber: typeof row.reservation_number === "string" ? row.reservation_number : "",
    guest: {
      firstName: typeof row.guest_first_name === "string" ? row.guest_first_name : "",
      lastName: typeof row.guest_last_name === "string" ? row.guest_last_name : "",
      email: typeof row.guest_email === "string" ? row.guest_email : "",
      phone: typeof row.guest_phone === "string" ? row.guest_phone : "",
      country: typeof row.guest_country === "string" ? row.guest_country : "",
      address: typeof row.guest_address === "string" ? row.guest_address : "",
    },
    roomId: typeof row.room_id === "string" ? row.room_id : "",
    roomSlug: typeof row.room_slug === "string" ? row.room_slug : "",
    roomName: typeof row.room_name === "string" ? row.room_name : "",
    assignedRoomIds,
    checkIn: typeof row.check_in === "string" ? row.check_in : "",
    checkOut: typeof row.check_out === "string" ? row.check_out : "",
    nights: Number(row.nights ?? 0),
    adults: Number(row.adults ?? 0),
    children: Number(row.children ?? 0),
    rooms: Number(row.rooms ?? 0),
    roomRate: Number(row.room_rate ?? 0),
    roomSubtotal: Number(row.room_subtotal ?? 0),
    extras,
    extrasSubtotal: Number(row.extras_subtotal ?? 0),
    grandTotal: Number(row.grand_total ?? 0),
    specialRequests: typeof row.special_requests === "string" ? row.special_requests : "",
    arrivalTime: typeof row.arrival_time === "string" ? row.arrival_time : "15:00",
    paymentMethod: (row.payment_method ?? "pay_at_hotel") as Reservation["paymentMethod"],
    paymentStatus: (row.payment_status ?? "pending") as Reservation["paymentStatus"],
    reservationStatus: (row.reservation_status ?? "pending") as Reservation["reservationStatus"],
    receiptTokenHash: typeof row.receipt_token_hash === "string" ? row.receipt_token_hash : "00".repeat(32),
    createdAt: typeof row.created_at === "string" ? row.created_at : new Date().toISOString(),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : new Date().toISOString(),
  };
}

export class DemoReservationRepository implements ReservationRepository {
  private reservations: Reservation[];

  constructor(initial: Reservation[] = seedReservations()) {
    this.reservations = [...initial];
  }

  async list(): Promise<Reservation[]> {
    return [...this.reservations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async findByNumber(reservationNumber: string): Promise<Reservation | undefined> {
    return this.reservations.find((reservation) => reservation.reservationNumber === reservationNumber);
  }

  async updateStatus(reservationNumber: string, change: Partial<Pick<Reservation, "reservationStatus" | "paymentStatus" | "updatedAt">>): Promise<Reservation> {
    const index = this.reservations.findIndex((reservation) => reservation.reservationNumber === reservationNumber);
    if (index === -1) {
      throw new Error("Reservation not found.");
    }
    const updated = { ...this.reservations[index], ...change, updatedAt: new Date().toISOString() };
    this.reservations[index] = updated;
    return updated;
  }

  async create(draft: ReservationDraft, inventory: PhysicalRoom[]): Promise<{ reservation: Reservation; receiptToken: string }> {
    const available = availablePhysicalRooms(inventory, this.reservations, draft.roomId, draft.checkIn, draft.checkOut);
    if (available.length < draft.rooms) {
      throw new NoInventoryError("This room is no longer available for your selected dates. Please choose another room.");
    }

    const year = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", year: "numeric" }).format(new Date());
    let reservationNumber = "";
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = `SOL-${year}-${String(randomInt(0, 1_000_000)).padStart(6, "0")}`;
      if (!this.reservations.some((reservation) => reservation.reservationNumber === candidate)) {
        reservationNumber = candidate;
        break;
      }
    }

    if (!reservationNumber) {
      throw new Error("Could not create a unique reservation number");
    }

    const receiptToken = randomBytes(32).toString("hex");
    const now = new Date().toISOString();
    const reservation: Reservation = {
      ...draft,
      id: randomUUID(),
      reservationNumber,
      assignedRoomIds: available.slice(0, draft.rooms).map((room) => room.id),
      receiptTokenHash: receiptHash(receiptToken),
      createdAt: now,
      updatedAt: now,
    };

    this.reservations.push(reservation);
    return { reservation, receiptToken };
  }
}

export const demoReservationRepository = new DemoReservationRepository();

export function resolveReservationRepository(config: Record<string, string | undefined> = process.env): ReservationRepository {
  const url = config.NEXT_PUBLIC_SUPABASE_URL;
  const key = config.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    return new SupabaseReservationRepository();
  }
  return demoReservationRepository;
}

export class SupabaseReservationRepository implements ReservationRepository {
  private readonly client: ReturnType<typeof getSupabaseAdminClient>;

  constructor(client = getSupabaseAdminClient()) {
    this.client = client;
  }

  private getClient() {
    if (!this.client) {
      throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    }
    return this.client;
  }

  private async rawList(): Promise<Reservation[]> {
    const { data, error } = await this.getClient().from("reservations").select("*").order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []).map((row) => mapSupabaseReservation(row));
  }

  async list(): Promise<Reservation[]> {
    return this.rawList();
  }

  async findByNumber(reservationNumber: string): Promise<Reservation | undefined> {
    const { data, error } = await this.getClient().from("reservations").select("*").eq("reservation_number", reservationNumber).maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data ? mapSupabaseReservation(data) : undefined;
  }

  async updateStatus(reservationNumber: string, change: Partial<Pick<Reservation, "reservationStatus" | "paymentStatus" | "updatedAt">>): Promise<Reservation> {
    const current = await this.findByNumber(reservationNumber);
    if (!current) {
      throw new Error("Reservation not found.");
    }

    const payload = {
      reservation_status: change.reservationStatus ?? current.reservationStatus,
      payment_status: change.paymentStatus ?? current.paymentStatus,
      updated_at: change.updatedAt ?? new Date().toISOString(),
    };

    const { data, error } = await this.getClient().from("reservations").update(payload).eq("reservation_number", reservationNumber).select("*").single();
    if (error) {
      throw new Error(error.message);
    }
    return mapSupabaseReservation(data);
  }

  async create(draft: ReservationDraft, inventory: PhysicalRoom[]): Promise<{ reservation: Reservation; receiptToken: string }> {
    const existing = await this.rawList();
    const available = availablePhysicalRooms(inventory, existing, draft.roomId, draft.checkIn, draft.checkOut);
    if (available.length < draft.rooms) {
      throw new NoInventoryError("This room is no longer available for your selected dates. Please choose another room.");
    }

    const year = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", year: "numeric" }).format(new Date());
    let reservationNumber = "";
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const candidate = `SOL-${year}-${String(randomInt(0, 1_000_000)).padStart(6, "0")}`;
      if (!existing.some((reservation) => reservation.reservationNumber === candidate)) {
        reservationNumber = candidate;
        break;
      }
    }

    if (!reservationNumber) {
      throw new Error("Could not create a unique reservation number");
    }

    const receiptToken = randomBytes(32).toString("hex");
    const now = new Date().toISOString();
    const reservation: Reservation = {
      ...draft,
      id: randomUUID(),
      reservationNumber,
      assignedRoomIds: available.slice(0, draft.rooms).map((room) => room.id),
      receiptTokenHash: receiptHash(receiptToken),
      createdAt: now,
      updatedAt: now,
    };

    const { data, error } = await this.getClient().from("reservations").insert([buildReservationRow(reservation)]).select("*").single();
    if (error) {
      throw new Error(error.message);
    }

    return { reservation: mapSupabaseReservation(data), receiptToken };
  }
}

export const reservationRepository: ReservationRepository = resolveReservationRepository();
