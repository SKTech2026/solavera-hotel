import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { ReservationDetails } from "@/components/booking/reservation-details";
import { PrintButton } from "@/components/booking/print-button";
import { getReceiptReservation } from "@/lib/reservations/service";

export const metadata: Metadata = { title: "Booking Confirmation | Solavéra Hotel", robots: { index: false, follow: false } };

export default async function ConfirmationPage({ params }: { params: Promise<{ reservationNumber: string }> }) {
  const { reservationNumber } = await params;
  const receipt = (await cookies()).get("solavera_receipt")?.value ?? "";
  const [cookieNumber, token] = receipt.split(".");
  const reservation = cookieNumber === reservationNumber && token ? await getReceiptReservation(reservationNumber, token) : null;
  if (!reservation) notFound();
  return <><Header/><main className="confirmation-page"><div className="print-brand">SOLAVÉRA HOTEL</div><section className="confirmation-head"><div className="container"><span className="confirmation-mark"><Check size={29}/></span><span className="eyebrow">A STAY TO LOOK FORWARD TO</span><h1>{reservation.reservationStatus === "confirmed" ? <>Booking <em>Confirmed</em></> : <>Request <em>Received</em></>}</h1><p>{reservation.paymentMethod === "bank_online" ? "Your demo reservation is saved as pending. This demo does not send payment instructions." : "Your demo reservation is confirmed with Pay at Hotel selected."}</p></div></section><section className="confirmation-body"><div className="container"><ReservationDetails reservation={reservation}/><div className="confirmation-actions"><Link href={`/my-booking?number=${encodeURIComponent(reservation.reservationNumber)}`} className="button button-dark">View My Booking <ArrowUpRight size={17}/></Link><PrintButton/><Link href="/" className="text-link">Return Home <ArrowUpRight size={17}/></Link></div></div></section></main><Footer/></>;
}
