import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BedDouble, Expand, Eye, UsersRound, Check } from "lucide-react";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { AssetImage } from "@/components/ui/asset-image";
import { RoomBookingCard } from "@/components/booking/room-booking-card";
import { RoomCard } from "@/components/hotel/room-card";
import { getRoom, peso, rooms } from "@/data/rooms";

export function generateStaticParams() { return rooms.map((room) => ({ slug: room.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const room = getRoom(slug); return { title: room ? `${room.name} | Solavéra Hotel` : "Room Not Found | Solavéra Hotel", description: room?.shortDescription }; }

export default async function RoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();
  const related = rooms.filter((other) => other.slug !== room.slug);
  return <><Header/><main><section className="interior-hero detail-hero"><AssetImage src={room.image} alt={room.alt} priority/><div className="interior-hero-shade"/><div className="container interior-hero-content"><Link href="/rooms" className="back-link"><ArrowLeft size={16}/> All rooms & suites</Link><span className="eyebrow">{room.category}</span><h1>{room.name}</h1><p>{room.shortDescription}</p><div className="hero-rate">From <strong>{peso(room.price)}</strong> / night</div></div></section>
    <section className="detail-intro section-pad"><div className="container"><div className="detail-overview"><div className="detail-main"><span className="eyebrow with-line">A ROOM TO REMEMBER</span><h2>Space to <em>slow down.</em></h2><p className="detail-lead">{room.description}</p><div className="detail-facts"><div><UsersRound/><span>Guests</span><strong>Up to {room.maxGuests}</strong></div><div><BedDouble/><span>Bed</span><strong>{room.bedType}</strong></div><div><Expand/><span>Room size</span><strong>{room.roomSize} m²</strong></div><div><Eye/><span>View</span><strong>{room.view}</strong></div></div><h3>Little luxuries, thoughtfully included.</h3><div className="detail-amenities">{room.amenities.map((amenity) => <span key={amenity}><Check size={16}/>{amenity}</span>)}</div></div><aside className="detail-aside"><RoomBookingCard room={room}/></aside></div></div></section>
    <section className="detail-gallery section-pad"><div className="container"><span className="eyebrow with-line">AN INSIDE LOOK</span><h2>Make yourself <em>at home.</em></h2><div className="detail-gallery-grid">{room.gallery.map((item, index) => <AssetImage key={`${item.src}-${index}`} src={item.src} alt={item.alt} sizes={index === 0 ? "(max-width: 700px) 100vw, 55vw" : "(max-width: 700px) 50vw, 25vw"}/>)}</div></div></section>
    <section className="related-rooms section-pad"><div className="container"><div className="section-heading"><div><span className="eyebrow with-line">CONTINUE EXPLORING</span><h2>More ways <em>to stay.</em></h2></div><Link href="/rooms" className="text-link">All Rooms & Suites <ArrowUpRight size={18}/></Link></div><div className="related-grid">{related.map((item, index) => <RoomCard key={item.slug} room={item} index={index}/>)}</div></div></section></main><Footer/></>;
}
