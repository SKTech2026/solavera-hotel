import Link from "next/link";
import { ArrowUpRight, CalendarDays, UsersRound } from "lucide-react";
import { peso } from "@/data/rooms";
import type { PublicReservation } from "@/types/reservation";

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function ReservationDetails({ reservation }: { reservation: PublicReservation }) {
  return <div className="reservation-details">
    <div className="reservation-number"><span className="eyebrow">RESERVATION NUMBER</span><strong>{reservation.reservationNumber}</strong></div>
    <div className="reservation-detail-grid"><section><h2>Your stay</h2><dl><div><dt>Guest</dt><dd>{reservation.guest.firstName} {reservation.guest.lastName}</dd></div><div><dt>Email</dt><dd>{reservation.guest.email}</dd></div><div><dt>Room</dt><dd><Link href={`/rooms/${reservation.roomSlug}`}>{reservation.roomName} <ArrowUpRight size={13}/></Link>{reservation.rooms > 1 ? ` × ${reservation.rooms}` : ""}</dd></div><div><dt><CalendarDays size={15}/> Check-in</dt><dd>{reservation.checkIn}</dd></div><div><dt><CalendarDays size={15}/> Check-out</dt><dd>{reservation.checkOut}</dd></div><div><dt>Nights</dt><dd>{reservation.nights}</dd></div><div><dt><UsersRound size={15}/> Guests</dt><dd>{reservation.adults} adults{reservation.children ? `, ${reservation.children} children` : ""}</dd></div></dl></section>
      <section><h2>Booking details</h2><dl><div><dt>Reservation status</dt><dd className="status-text">{label(reservation.reservationStatus)}</dd></div><div><dt>Payment method</dt><dd>{reservation.paymentMethod === "pay_at_hotel" ? "Pay at Hotel" : "Bank / Online Payment"}</dd></div><div><dt>Payment status</dt><dd>{label(reservation.paymentStatus)}</dd></div><div><dt>Room rate</dt><dd>{peso(reservation.roomRate)} / night</dd></div><div><dt>Room subtotal</dt><dd>{peso(reservation.roomSubtotal)}</dd></div>{reservation.extras.map((extra) => <div key={extra.id}><dt>{extra.name} <small>× {extra.quantity}</small></dt><dd>{peso(extra.total)}</dd></div>)}<div><dt>Extras subtotal</dt><dd>{peso(reservation.extrasSubtotal)}</dd></div></dl><div className="reservation-grand"><span>Grand total</span><strong>{peso(reservation.grandTotal)}</strong></div></section></div>
    {reservation.specialRequests && <div className="reservation-requests"><span className="eyebrow">SPECIAL REQUESTS</span><p>{reservation.specialRequests}</p></div>}
  </div>;
}
