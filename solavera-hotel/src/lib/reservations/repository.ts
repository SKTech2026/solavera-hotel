import type { PhysicalRoom } from "@/types/inventory";
import type { Reservation } from "@/types/reservation";

export type ReservationDraft = Omit<Reservation, "id" | "reservationNumber" | "assignedRoomIds" | "receiptTokenHash" | "createdAt" | "updatedAt">;

export class NoInventoryError extends Error {}

export interface ReservationRepository {
  create(draft: ReservationDraft, inventory: PhysicalRoom[]): Promise<{ reservation: Reservation; receiptToken: string }>;
  findByNumber(reservationNumber: string): Promise<Reservation | undefined>;
  list(): Promise<Reservation[]>;
  updateStatus(reservationNumber: string, change: Partial<Pick<Reservation, "reservationStatus" | "paymentStatus" | "updatedAt">>): Promise<Reservation>;
}
