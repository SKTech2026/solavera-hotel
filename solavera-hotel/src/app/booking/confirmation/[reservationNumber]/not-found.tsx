import Link from "next/link";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";

export default function ConfirmationNotFound() { return <><Header/><main className="room-not-found"><div className="container"><span className="eyebrow">YOUR RESERVATION</span><h1>This confirmation is not available here.</h1><p>Use your reservation number and email address to retrieve your booking securely.</p><Link href="/my-booking" className="button button-dark">Find My Booking</Link></div></main><Footer/></>; }
