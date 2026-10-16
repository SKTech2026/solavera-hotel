import type { Metadata } from "next";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { BookingExperience } from "@/components/booking/booking-experience";
import { parseBookingQuery, type QueryValue } from "@/lib/booking";
import { rooms } from "@/data/rooms";

export const metadata: Metadata = { title: "Book Your Stay | Solavéra Hotel", description: "Explore dates and rooms for your Solavéra Hotel stay." };

export default async function BookingPage({ searchParams }: { searchParams: Promise<Record<string, QueryValue>> }) {
  const parsed = parseBookingQuery(await searchParams, rooms);
  return <><Header/><main><section className="booking-page-heading"><div className="container"><span className="eyebrow with-line">THE START OF SOMETHING WONDERFUL</span><h1>Book Your <em>Stay</em></h1><p>Choose the moments, then find the room that feels like yours.</p></div></section><section className="booking-page-body"><div className="container"><BookingExperience rooms={rooms} initial={parsed.selection} initialError={parsed.error}/></div></section></main><Footer/></>;
}
