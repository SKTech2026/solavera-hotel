"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Room } from "@/types/room";
import { bookingUrl, todayDate, validateStay, type Stay } from "@/lib/booking";
import { peso } from "@/data/rooms";

export function RoomBookingCard({ room }: { room: Room }) {
  const router = useRouter();
  const [stay, setStay] = useState<Stay>({ checkIn: "", checkOut: "", adults: 2, children: 0, rooms: 1 });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const today = todayDate();
  function update(key: keyof Stay, value: string) { setStay((current) => ({ ...current, [key]: key === "checkIn" || key === "checkOut" ? value : Number(value) })); setError(""); }
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const message = validateStay(stay, room); if (message) { setError(message); return; } setPending(true); router.push(bookingUrl({ ...stay, room: room.slug })); }
  return <form className="detail-booking-card" onSubmit={submit} aria-label={`Check availability for ${room.name}`}>
    <span className="eyebrow">MAKE IT YOURS</span><div className="detail-rate"><small>From</small><strong>{peso(room.price)}</strong><span>/ night</span></div>
    <div className="detail-booking-fields"><label>Check-in<input type="date" required min={today} value={stay.checkIn} onChange={(e) => update("checkIn", e.target.value)}/></label><label>Check-out<input type="date" required min={stay.checkIn || today} value={stay.checkOut} onChange={(e) => update("checkOut", e.target.value)}/></label><label>Adults<select value={stay.adults} onChange={(e) => update("adults", e.target.value)}>{Array.from({ length: Math.min(room.adults, 6) }, (_, index) => index + 1).map((n) => <option key={n}>{n}</option>)}</select></label><label>Children<select value={stay.children} onChange={(e) => update("children", e.target.value)}>{Array.from({ length: room.children + 1 }, (_, index) => index).map((n) => <option key={n}>{n}</option>)}</select></label></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark" type="submit" disabled={pending}>{pending ? "Finding Rooms…" : "Check Availability"} <ArrowUpRight size={18}/></button><p className="booking-reassurance">No payment required to check availability.</p>
  </form>;
}
