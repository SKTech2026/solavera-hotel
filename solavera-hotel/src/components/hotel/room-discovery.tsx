"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Room } from "@/types/room";
import { RoomCard } from "@/components/hotel/room-card";

export function RoomDiscovery({ rooms }: { rooms: Room[] }) {
  const [guests, setGuests] = useState("any");
  const [type, setType] = useState("all");
  const [price, setPrice] = useState("all");
  const filtered = useMemo(() => rooms.filter((room) => {
    const guestMatch = guests === "any" || room.maxGuests >= Number(guests);
    const typeMatch = type === "all" || room.category === type;
    const priceMatch = price === "all" || (price === "under-12000" ? room.price < 12000 : price === "12000-16000" ? room.price >= 12000 && room.price <= 16000 : room.price > 16000);
    return guestMatch && typeMatch && priceMatch;
  }), [rooms, guests, type, price]);

  return <>
    <div className="discovery-controls" aria-label="Filter rooms">
      <div className="discovery-title"><span className="eyebrow">FIND YOUR SPACE</span><h2>Stay your way.</h2></div>
      <div className="discovery-filters">
        <label>Guests<select value={guests} onChange={(event) => setGuests(event.target.value)}><option value="any">Any number</option><option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option></select></label>
        <label>Room type<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All rooms</option>{[...new Set(rooms.map((room) => room.category))].map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
        <label>Price per night<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">Any price</option><option value="under-12000">Under ₱12,000</option><option value="12000-16000">₱12,000–₱16,000</option><option value="over-16000">Above ₱16,000</option></select></label>
      </div>
    </div>
    <div className="discovery-result"><span>{filtered.length} {filtered.length === 1 ? "retreat" : "retreats"} to discover</span><span>Rates shown per night in PHP. Availability is confirmed during reservation.</span></div>
    {filtered.length ? <div className="listing-grid">{filtered.map((room, index) => <RoomCard key={room.id} room={room} index={index} />)}</div> : <div className="rooms-empty"><h3>No rooms match those filters.</h3><p>Try a different room type, guest count, or nightly rate.</p><button type="button" onClick={() => { setGuests("any"); setType("all"); setPrice("all"); }}><RotateCcw size={16}/> Clear filters</button><Link href="/booking">Explore stay dates <ArrowUpRight size={16}/></Link></div>}
  </>;
}
