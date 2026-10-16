import { getPaymentStatusLabel, getReservationStatusLabel } from "@/lib/admin";
import type { PaymentStatus, ReservationStatus } from "@/types/reservation";

export function StatusBadge({ type, status }: { type: "reservation" | "payment"; status: ReservationStatus | PaymentStatus }) {
  const label = type === "reservation" ? getReservationStatusLabel(status as ReservationStatus) : getPaymentStatusLabel(status as PaymentStatus);
  const variant = type === "reservation"
    ? status === "confirmed" || status === "checked_in" ? "success" : status === "cancelled" || status === "no_show" ? "danger" : status === "checked_out" ? "neutral" : "warning"
    : status === "paid" ? "success" : status === "pending" ? "warning" : status === "failed" || status === "refunded" ? "danger" : "neutral";

  return <span className={`admin-badge admin-badge-${variant}`}>{label}</span>;
}
