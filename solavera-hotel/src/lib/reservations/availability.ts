import type { PhysicalRoom } from "@/types/inventory";
import type { Reservation } from "@/types/reservation";

export function datesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
  return startA < endB && startB < endA;
}

export function availablePhysicalRooms(inventory: PhysicalRoom[], reservations: Reservation[], roomTypeId: string, checkIn: string, checkOut: string): PhysicalRoom[] {
  const blocked = new Set(reservations
    .filter((reservation) => reservation.reservationStatus !== "cancelled" && datesOverlap(reservation.checkIn, reservation.checkOut, checkIn, checkOut))
    .flatMap((reservation) => reservation.assignedRoomIds));
  return inventory.filter((room) => room.roomTypeId === roomTypeId && room.status === "available" && !blocked.has(room.id));
}
