"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { ReservationDetails } from "./reservation-details";
import type { PublicReservation } from "@/types/reservation";

export function MyBookingLookup({ initialNumber }: { initialNumber: string }) {
  const [number, setNumber] = useState(initialNumber);
  const [email, setEmail] = useState("");
  const [reservation, setReservation] = useState<PublicReservation | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setReservation(null); setPending(true);
    try {
      const response = await fetch("/api/reservations/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reservationNumber: number, email }) });
      const result = await response.json() as { reservation?: PublicReservation; error?: string };
      if (!response.ok || !result.reservation) setError(result.error ?? "We could not find your booking.");
      else setReservation(result.reservation);
    } catch { setError("We could not look up your booking right now. Please try again."); }
    finally { setPending(false); }
  }
  return <><form className="lookup-form" onSubmit={submit}><label>Reservation number<input required maxLength={15} value={number} onChange={(event) => setNumber(event.target.value.toUpperCase())} placeholder="SOL-2026-000124" autoComplete="off"/></label><label>Email address<input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email"/></label><button type="submit" className="button button-dark" disabled={pending}>{pending ? "Finding your booking…" : "Find My Booking"} <ArrowRight size={17}/></button></form>{error && <p className="form-error" role="alert">{error}</p>}{reservation && <div className="lookup-result"><span className="eyebrow with-line">YOUR RESERVATION</span><h2>Welcome back, <em>{reservation.guest.firstName}.</em></h2><ReservationDetails reservation={reservation}/></div>}</>;
}
