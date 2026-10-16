import "server-only";
import { timingSafeEqual } from "node:crypto";
import { extras } from "@/data/extras";
import { physicalRooms } from "@/data/inventory";
import { getRoom } from "@/data/rooms";
import { numberOfNights, roomSubtotal } from "@/lib/booking";
import { receiptHash, reservationRepository } from "./supabase-repository";
import { priceExtras } from "./pricing";
import { initialStatuses } from "./status";
import { normalizeEmail, parseCreateInput, ReservationValidationError, validReservationNumber } from "./validation";
import type { PublicReservation, Reservation, ReservationStatus } from "@/types/reservation";
import type { ReservationRepository } from "./repository";

export function toPublicReservation(reservation: Reservation): PublicReservation {
  const { id, assignedRoomIds, receiptTokenHash, ...publicReservation } = reservation;
  void id; void assignedRoomIds; void receiptTokenHash;
  return { ...publicReservation, guest: { firstName: reservation.guest.firstName, lastName: reservation.guest.lastName, email: reservation.guest.email } };
}

export async function createReservation(raw: unknown, repository: ReservationRepository = reservationRepository): Promise<{ reservation: PublicReservation; receiptToken: string }> {
  const parsed = parseCreateInput(raw);
  if (!parsed.input) throw new ReservationValidationError(parsed.error);
  const input = parsed.input;
  const room = getRoom(input.roomSlug)!;
  const nights = numberOfNights(input.checkIn, input.checkOut)!;
  const selectedExtras = input.extraIds.map((id) => extras.find((extra) => extra.id === id)!);
  const priced = priceExtras(selectedExtras, nights, input.adults + input.children);
  const subtotal = roomSubtotal(room, nights, input.rooms);
  const { reservation, receiptToken } = await repository.create({
    guest: { ...input.guest, email: normalizeEmail(input.guest.email) },
    roomId: room.id, roomSlug: room.slug, roomName: room.name,
    checkIn: input.checkIn, checkOut: input.checkOut, nights, adults: input.adults, children: input.children, rooms: input.rooms,
    roomRate: room.price, roomSubtotal: subtotal, extras: priced.lines, extrasSubtotal: priced.subtotal, grandTotal: subtotal + priced.subtotal,
    specialRequests: input.specialRequests, arrivalTime: input.arrivalTime, paymentMethod: input.paymentMethod,
    ...initialStatuses(input.paymentMethod),
  }, physicalRooms);
  return { reservation: toPublicReservation(reservation), receiptToken };
}

export async function lookupReservation(reservationNumber: string, email: string, repository: ReservationRepository = reservationRepository): Promise<PublicReservation | null> {
  if (!validReservationNumber(reservationNumber) || !email || email.length > 254) return null;
  const reservation = await repository.findByNumber(reservationNumber);
  return reservation && normalizeEmail(reservation.guest.email) === normalizeEmail(email) ? toPublicReservation(reservation) : null;
}

export async function getReceiptReservation(reservationNumber: string, token: string, repository: ReservationRepository = reservationRepository): Promise<PublicReservation | null> {
  if (!validReservationNumber(reservationNumber) || !/^[a-f0-9]{64}$/.test(token)) return null;
  const reservation = await repository.findByNumber(reservationNumber);
  if (!reservation) return null;
  const actual = Buffer.from(reservation.receiptTokenHash, "hex");
  const offered = Buffer.from(receiptHash(token), "hex");
  return actual.length === offered.length && timingSafeEqual(actual, offered) ? toPublicReservation(reservation) : null;
}

export async function listReservations(repository: ReservationRepository = reservationRepository): Promise<Reservation[]> {
  return repository.list();
}

export async function updateReservationStatus(
  reservationNumber: string,
  updates: Partial<{ reservationStatus: ReservationStatus; paymentStatus: Reservation["paymentStatus"] }>,
  repository: ReservationRepository = reservationRepository,
): Promise<Reservation> {
  return repository.updateStatus(reservationNumber, { ...updates, updatedAt: new Date().toISOString() });
}
