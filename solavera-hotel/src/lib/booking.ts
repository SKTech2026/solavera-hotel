import type { Room } from "@/types/room";

export type Stay = { checkIn: string; checkOut: string; adults: number; children: number; rooms: number };
export type BookingSelection = Stay & { room?: string };
export type QueryValue = string | string[] | undefined;

const dayMs = 86_400_000;

export function dateOrdinal(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return Math.floor(date.getTime() / dayMs);
}

export function todayDate(): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function numberOfNights(checkIn: string, checkOut: string): number | null {
  const start = dateOrdinal(checkIn);
  const end = dateOrdinal(checkOut);
  return start === null || end === null || end <= start ? null : end - start;
}

export function roomSubtotal(room: Room, nights: number, count = 1): number {
  return room.price * nights * count;
}

export function canAccommodate(room: Room, stay: Pick<Stay, "adults" | "children" | "rooms">): boolean {
  return room.available && stay.adults + stay.children <= room.maxGuests * stay.rooms && stay.adults <= room.adults * stay.rooms && stay.children <= room.children * stay.rooms;
}

export function validateStay(stay: Stay, room?: Room): string | null {
  const start = dateOrdinal(stay.checkIn);
  const end = dateOrdinal(stay.checkOut);
  const today = dateOrdinal(todayDate());
  if (start === null || end === null) return "Choose valid check-in and check-out dates.";
  if (today !== null && start < today) return "Check-in cannot be in the past.";
  if (end <= start) return "Check-out must be later than check-in.";
  if (end - start > 30) return "Please choose a stay of 30 nights or fewer.";
  if (!Number.isInteger(stay.adults) || stay.adults < 1 || stay.adults > 12 || !Number.isInteger(stay.children) || stay.children < 0 || stay.children > 12 || !Number.isInteger(stay.rooms) || stay.rooms < 1 || stay.rooms > 4) return "Enter a valid number of guests and rooms.";
  if (stay.adults + stay.children > stay.rooms * 4) return "The guest count exceeds the capacity of the selected number of rooms.";
  if (room && !canAccommodate(room, stay)) return `${room.name} cannot accommodate this guest selection.`;
  return null;
}

function single(value: QueryValue): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function boundedNumber(value: string | undefined, fallback: number, min: number, max: number): number | null {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

export function parseBookingQuery(query: Record<string, QueryValue>, roomList: Room[]): { selection: BookingSelection; error: string | null } {
  const room = single(query.room);
  const checkIn = single(query.checkIn) ?? "";
  const checkOut = single(query.checkOut) ?? "";
  const adults = boundedNumber(single(query.adults), 2, 1, 12);
  const children = boundedNumber(single(query.children), 0, 0, 12);
  const rooms = boundedNumber(single(query.rooms), 1, 1, 4);
  const selection: BookingSelection = { checkIn, checkOut, adults: adults ?? 2, children: children ?? 0, rooms: rooms ?? 1, room: room && roomList.some((item) => item.slug === room) ? room : undefined };
  if (["room", "checkIn", "checkOut", "adults", "children", "rooms"].some((key) => Array.isArray(query[key]))) return { selection: { ...selection, room: undefined, checkIn: "", checkOut: "" }, error: "The booking link contains repeated details. Please enter your stay again." };
  if (room && !selection.room) return { selection, error: "The selected room could not be found. Please choose a room below." };
  if (adults === null || children === null || rooms === null) return { selection, error: "Some guest details in the link were invalid. Please review your stay." };
  if (checkIn && dateOrdinal(checkIn) === null || checkOut && dateOrdinal(checkOut) === null) return { selection: { ...selection, checkIn: "", checkOut: "" }, error: "The dates in the link were invalid. Please choose new dates." };
  if (checkIn || checkOut) {
    const error = validateStay(selection);
    if (error) return { selection, error };
  }
  const chosen = roomList.find((item) => item.slug === selection.room);
  if (chosen && !canAccommodate(chosen, selection)) return { selection: { ...selection, room: undefined }, error: `${chosen.name} cannot accommodate this guest selection. Please choose another room or adjust guests.` };
  return { selection, error: null };
}

export function bookingUrl(selection: BookingSelection): string {
  const query = new URLSearchParams();
  if (selection.room) query.set("room", selection.room);
  if (selection.checkIn) query.set("checkIn", selection.checkIn);
  if (selection.checkOut) query.set("checkOut", selection.checkOut);
  query.set("adults", String(selection.adults));
  query.set("children", String(selection.children));
  query.set("rooms", String(selection.rooms));
  return `/booking?${query.toString()}`;
}
