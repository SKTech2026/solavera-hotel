"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, UsersRound } from "lucide-react";
import { bookingUrl, todayDate, validateStay } from "@/lib/booking";

export function BookingBar() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [error, setError] = useState("");
  const minDate = todayDate();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateStay({ checkIn, checkOut, adults, children, rooms });
    if (message) {
      setError(message);
      return;
    }
    setError("");
    router.push(bookingUrl({ checkIn, checkOut, adults, children, rooms }));
  }

  return (
    <form className="booking-bar" onSubmit={submit} aria-label="Check room availability">
      <div className="booking-fields">
        <label className="booking-field"><span><CalendarDays size={16} /> Check-in</span><input type="date" required min={minDate} value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setError(""); }} /></label>
        <label className="booking-field"><span><CalendarDays size={16} /> Check-out</span><input type="date" required min={checkIn || minDate} value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setError(""); }} /></label>
        <label className="booking-field"><span><UsersRound size={16} /> Adults</span><select value={adults} onChange={(e) => setAdults(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className="booking-field"><span>Children</span><select value={children} onChange={(e) => setChildren(Number(e.target.value))}>{[0,1,2,3,4,5,6].map((n) => <option key={n}>{n}</option>)}</select></label>
        <label className="booking-field"><span>Rooms</span><select value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>{[1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></label>
        <button className="booking-submit" type="submit">Check Availability <ArrowUpRight size={18} /></button>
      </div>
      {error && <p className="booking-error" role="alert">{error}</p>}
    </form>
  );
}
