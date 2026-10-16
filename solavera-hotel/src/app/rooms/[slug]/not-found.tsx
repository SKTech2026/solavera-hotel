import Link from "next/link";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";

export default function RoomNotFound() { return <><Header/><main className="room-not-found"><div className="container"><span className="eyebrow">A WRONG TURN</span><h1>That room is not on our map.</h1><p>Explore the spaces waiting for you at Solavéra.</p><Link href="/rooms" className="button button-dark">View Rooms & Suites</Link></div></main><Footer/></>; }
