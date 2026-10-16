import { createRequire } from "node:module";
import type { PhysicalRoom } from "../types/inventory";
import type { Room } from "../types/room";
import type { PaymentStatus, Reservation, ReservationStatus } from "../types/reservation";

const require = createRequire(import.meta.url);
const { physicalRooms }: { physicalRooms: PhysicalRoom[] } = require("../data/inventory.ts");
const { rooms }: { rooms: Room[] } = require("../data/rooms.ts");

export function dateKey(date: Date | string): string {
  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) {
      return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
    }
    return "";
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(parsed);
}

export function formatShortDate(value: string): string {
  return formatDate(value, { month: "short", day: "numeric" });
}

export function getAdminGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export function getReservationStatusLabel(status: ReservationStatus): string {
  const map: Record<ReservationStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked In",
    checked_out: "Checked Out",
    cancelled: "Cancelled",
    no_show: "No Show",
  };
  return map[status] ?? status;
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const map: Record<PaymentStatus, string> = {
    pending: "Pending",
    partially_paid: "Partially Paid",
    paid: "Paid",
    refunded: "Refunded",
    failed: "Failed",
  };
  return map[status] ?? status;
}

export function isReservationActive(reservation: Partial<Reservation>): boolean {
  if (!reservation.checkIn || !reservation.checkOut) return false;
  if (reservation.reservationStatus === "cancelled" || reservation.reservationStatus === "checked_out") return false;
  const today = dateKey(new Date());
  return reservation.checkIn <= today && reservation.checkOut > today;
}

export function getRoomTypeById(roomId: string) {
  return rooms.find((room) => room.id === roomId) ?? null;
}

export function getRoomName(roomId: string): string {
  return getRoomTypeById(roomId)?.name ?? roomId;
}

export function getPhysicalRoomSummary(reservations: Reservation[] = []) {
  const totalRooms = physicalRooms.length;
  const activeReservations = reservations.filter((reservation) => reservation.reservationStatus !== "cancelled" && reservation.reservationStatus !== "checked_out" && isReservationActive(reservation));
  const occupiedRooms = new Set(activeReservations.flatMap((reservation) => reservation.assignedRoomIds ?? [])).size;
  const availableRooms = physicalRooms.filter((room) => room.status === "available" && !activeReservations.some((reservation) => reservation.assignedRoomIds?.includes(room.id))).length;
  const maintenanceRooms = physicalRooms.filter((room) => room.status === "maintenance" || room.status === "out_of_service").length;
  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    maintenanceRooms,
    reservedRooms: Math.max(0, totalRooms - availableRooms - maintenanceRooms - occupiedRooms),
    occupancyPercent: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
  };
}

export function summarizeReservations(reservations: Reservation[] = [], referenceDate = new Date()) {
  const key = dateKey(referenceDate);
  const arrivals = reservations.filter((reservation) => dateKey(reservation.checkIn) === key && reservation.reservationStatus !== "cancelled");
  const departures = reservations.filter((reservation) => dateKey(reservation.checkOut) === key && reservation.reservationStatus !== "cancelled");
  const currentGuests = reservations.filter((reservation) => ["checked_in", "confirmed"].includes(reservation.reservationStatus) && dateKey(reservation.checkIn) <= key && dateKey(reservation.checkOut) > key).length;
  const pendingPayments = reservations.filter((reservation) => reservation.paymentStatus === "pending" && reservation.reservationStatus !== "cancelled").length;

  return {
    arrivals,
    departures,
    currentGuests,
    pendingPayments,
    totalReservations: reservations.length,
  };
}

export async function getDashboardData() {
  const { demoReservationRepository } = await import("./reservations/demo-repository");
  const reservations = await demoReservationRepository.list();
  const summary = summarizeReservations(reservations, new Date());
  const occupancy = getPhysicalRoomSummary(reservations);
  return {
    reservations,
    summary,
    occupancy,
    now: new Date(),
    recentReservations: [...reservations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
  };
}

export function resolveRoomStatus(roomId: string, reservations: Reservation[] = []) {
  const room = physicalRooms.find((entry) => entry.id === roomId);
  if (!room) return "Unavailable";
  if (room.status === "maintenance") return "Maintenance";
  if (room.status === "out_of_service") return "Out of Service";
  const active = reservations.filter((reservation) => reservation.assignedRoomIds?.includes(room.id) && reservation.reservationStatus !== "cancelled" && reservation.reservationStatus !== "checked_out");
  if (active.some((reservation) => reservation.reservationStatus === "checked_in")) return "Occupied";
  if (active.length > 0) return "Reserved";
  return "Available";
}

export function getAdminGuestRecords(reservations: Reservation[] = []) {
  const map = new Map<string, Reservation[]>();
  for (const reservation of reservations) {
    const key = `${reservation.guest.email.toLowerCase().trim()}|${reservation.guest.firstName}|${reservation.guest.lastName}`;
    map.set(key, [...(map.get(key) ?? []), reservation]);
  }
  return [...map.values()].map((entries) => {
    const latest = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return {
      name: `${latest.guest.firstName} ${latest.guest.lastName}`,
      email: latest.guest.email,
      phone: latest.guest.phone || "—",
      country: latest.guest.country || "—",
      totalBookings: entries.length,
      latestStay: latest.checkIn,
      upcomingStay: [...entries].filter((reservation) => reservation.checkIn >= dateKey(new Date()) && reservation.reservationStatus !== "cancelled").sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())[0]?.checkIn ?? "—",
      reservations: entries,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}
