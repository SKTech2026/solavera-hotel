import Link from "next/link";
import { ArrowUpRight, BedDouble, Maximize2, UsersRound } from "lucide-react";
import type { Room } from "@/types/hotel";
import { peso } from "@/data/rooms";
import { AssetImage } from "@/components/ui/asset-image";

export function RoomCard({ room, index }: { room: Room; index: number }) {
  return (
    <article className="room-card">
      <Link href={`/rooms/${room.slug}`} className="room-image-link" aria-label={`View ${room.name}`}>
        <AssetImage src={room.image} alt={room.alt} sizes="(max-width: 800px) 100vw, 33vw" className={`room-image room-image-${index}`} />
        <span className="room-number">0{index + 1} / 03</span>
      </Link>
      <div className="room-content">
        <span className="eyebrow">{room.eyebrow}</span>
        <h3>{room.name}</h3>
        <p>{room.shortDescription}</p>
        <div className="room-facts"><span><UsersRound size={16} /> {room.maxGuests} guests</span><span><BedDouble size={16} /> {room.bedType}</span><span><Maximize2 size={16} /> {room.roomSize} m²</span></div>
        <div className="room-amenities">{room.features.slice(0, 2).map((a) => <span key={a}>{a}</span>)}</div>
        <div className="room-bottom"><div><strong>{peso(room.price)}</strong><small> / night</small></div><Link href={`/rooms/${room.slug}`}>View Room <ArrowUpRight size={17} /></Link></div>
        <Link href={`/booking?room=${room.slug}`} className="room-book-link">Book Now <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  );
}
