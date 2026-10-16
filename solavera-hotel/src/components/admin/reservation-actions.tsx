"use client";

import { useState } from "react";
import { CircleCheckBig, CircleX, LogIn, LogOut } from "lucide-react";
import { updateReservationAction } from "@/app/admin/actions";
import type { Reservation } from "@/types/reservation";

export function ReservationActions({ reservation }: { reservation: Reservation }) {
  const [pending, setPending] = useState<string | null>(null);
  const handleCancel = (event: React.FormEvent<HTMLFormElement>) => {
    if (!window.confirm("Cancel this reservation for the guest? This action cannot be undone in the demo.")) {
      event.preventDefault();
    }
  };

  return (
    <div className="admin-action-stack">
      {reservation.reservationStatus === "pending" && (
        <form action={updateReservationAction} onSubmit={() => setPending("confirm")}>
          <input type="hidden" name="reservationNumber" value={reservation.reservationNumber} />
          <input type="hidden" name="action" value="confirm" />
          <button type="submit" className="button button-dark" disabled={pending !== null}>
            <CircleCheckBig size={16} /> Confirm Reservation
          </button>
        </form>
      )}

      {reservation.reservationStatus === "confirmed" && (
        <form action={updateReservationAction} onSubmit={() => setPending("check-in")}>
          <input type="hidden" name="reservationNumber" value={reservation.reservationNumber} />
          <input type="hidden" name="action" value="check-in" />
          <button type="submit" className="button button-dark" disabled={pending !== null}>
            <LogIn size={16} /> Check In
          </button>
        </form>
      )}

      {reservation.reservationStatus === "checked_in" && (
        <form action={updateReservationAction} onSubmit={() => setPending("check-out")}>
          <input type="hidden" name="reservationNumber" value={reservation.reservationNumber} />
          <input type="hidden" name="action" value="check-out" />
          <button type="submit" className="button button-dark" disabled={pending !== null}>
            <LogOut size={16} /> Check Out
          </button>
        </form>
      )}

      {reservation.reservationStatus !== "cancelled" && (
        <form action={updateReservationAction} onSubmit={handleCancel}>
          <input type="hidden" name="reservationNumber" value={reservation.reservationNumber} />
          <input type="hidden" name="action" value="cancel" />
          <button type="submit" className="button button-outline-dark" disabled={pending !== null}>
            <CircleX size={16} /> Cancel Reservation
          </button>
        </form>
      )}
    </div>
  );
}
