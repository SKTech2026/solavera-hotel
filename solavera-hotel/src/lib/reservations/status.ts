import type { PaymentMethod, PaymentStatus, ReservationStatus } from "@/types/reservation";

export function initialStatuses(method: PaymentMethod): { reservationStatus: ReservationStatus; paymentStatus: PaymentStatus } {
  return { reservationStatus: method === "pay_at_hotel" ? "confirmed" : "pending", paymentStatus: "pending" };
}
