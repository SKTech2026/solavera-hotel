import type { Metadata } from "next";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { MyBookingLookup } from "@/components/booking/my-booking-lookup";

export const metadata: Metadata = { title: "My Booking | Solavéra Hotel", robots: { index: false, follow: false } };

export default async function MyBookingPage({ searchParams }: { searchParams: Promise<{ number?: string | string[] }> }) {
  const { number } = await searchParams;
  return <><Header/><main><section className="booking-page-heading"><div className="container"><span className="eyebrow with-line">RETURN TO YOUR STAY</span><h1>My <em>Booking</em></h1><p>Find your reservation using the number in your confirmation and your email address.</p></div></section><section className="booking-page-body"><div className="container my-booking-inner"><MyBookingLookup initialNumber={typeof number === "string" && /^SOL-\d{4}-\d{6}$/.test(number) ? number : ""}/></div></section></main><Footer/></>;
}
