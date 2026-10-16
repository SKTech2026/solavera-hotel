"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AssetImage } from "@/components/ui/asset-image";
import { peso } from "@/data/rooms";
import { numberOfNights, roomSubtotal, type Stay } from "@/lib/booking";
import { priceExtras } from "@/lib/reservations/pricing";
import type { Extra } from "@/data/extras";
import type { Room } from "@/types/room";
import type { PaymentMethod } from "@/types/reservation";

export function BookingSummary({ stay, room, selectedExtras, paymentMethod }: { stay: Stay; room?: Room; selectedExtras: Extra[]; paymentMethod: PaymentMethod }) {
  const [open, setOpen] = useState(false);
  const nights = numberOfNights(stay.checkIn, stay.checkOut);
  const roomCost = room && nights ? roomSubtotal(room, nights, stay.rooms) : 0;
  const priced = nights ? priceExtras(selectedExtras, nights, stay.adults + stay.children) : { lines: [], subtotal: 0 };
  return <aside className="booking-summary"><button type="button" className="summary-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>Your stay summary <ChevronDown size={17}/></button><div className={`summary-body ${open ? "is-open" : ""}`}><span className="eyebrow">YOUR STAY AT SOLAVÉRA</span><h3>A little closer<br/>to paradise.</h3>{room && <AssetImage src={room.image} alt={room.alt} sizes="(max-width: 1000px) 100vw, 350px"/>}<dl><div><dt>Room</dt><dd>{room?.name ?? "To be selected"}</dd></div><div><dt>Check-in</dt><dd>{stay.checkIn || "To be selected"}</dd></div><div><dt>Check-out</dt><dd>{stay.checkOut || "To be selected"}</dd></div><div><dt>Nights</dt><dd>{nights ?? "—"}</dd></div><div><dt>Adults</dt><dd>{stay.adults}</dd></div><div><dt>Children</dt><dd>{stay.children}</dd></div><div><dt>Rooms</dt><dd>{stay.rooms}</dd></div><div><dt>Payment method</dt><dd>{paymentMethod === "pay_at_hotel" ? "Pay at Hotel" : "Bank / Online Payment"}</dd></div></dl>{room && nights && <><div className="summary-line"><span>Room subtotal</span><strong>{peso(roomCost)}</strong></div>{priced.lines.map((line) => <div className="summary-line" key={line.id}><span>{line.name} × {line.quantity}</span><strong>{peso(line.total)}</strong></div>)}<div className="summary-line"><span>Extras</span><strong>{peso(priced.subtotal)}</strong></div><div className="summary-total"><span>Grand total</span><strong>{peso(roomCost + priced.subtotal)}</strong><small>No taxes or service charges have been added.</small></div></>}<p className="summary-note">Your reservation is confirmed only after the final submission succeeds.</p></div></aside>;
}
