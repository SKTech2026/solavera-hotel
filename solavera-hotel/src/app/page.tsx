import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Heart, MapPin, Plane, Sparkles, UtensilsCrossed, Waves } from "lucide-react";
import { Header } from "@/components/hotel/header";
import { Footer } from "@/components/hotel/footer";
import { BookingBar } from "@/components/booking/booking-bar";
import { RoomCard } from "@/components/hotel/room-card";
import { AssetImage } from "@/components/ui/asset-image";
import { rooms } from "@/data/rooms";

const experiences = [
  { icon: Waves, title: "Beachfront Escape", text: "Find your own rhythm where warm sand meets the endless blue." },
  { icon: UtensilsCrossed, title: "Fine Dining", text: "Island flavors, fresh ingredients, and evenings worth lingering over." },
  { icon: Sparkles, title: "Spa & Wellness", text: "Thoughtful rituals designed to restore body and mind." },
  { icon: MapPin, title: "Island Adventures", text: "Discover hidden coves, vibrant reefs, and the spirit of the island." },
  { icon: Plane, title: "Airport Transfer", text: "A seamless welcome from the moment your journey begins." },
  { icon: Heart, title: "Private Celebrations", text: "Beautifully personal occasions in an extraordinary setting." },
];

const amenities = ["Infinity Pool", "Private Beach Access", "Restaurant & Bar", "Spa", "High-Speed Wi-Fi", "Room Service", "Airport Transfer", "Concierge"];

export default function Home() {
  return <>
    <Header />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <AssetImage src="/images/solavera-ocean-view-hd.png" alt="Ocean view room at Solavéra Hotel" priority sizes="100vw" quality={90} className="hero-photo" />
        <div className="hero-overlay" />
        <div className="container hero-content"><span className="hero-kicker"><span /> A SANCTUARY BY THE SEA</span><h1 id="hero-title">Experience<br/><em>Island Luxury</em></h1><p>Wake up to turquoise waters, tropical gardens, and unforgettable sunsets at Solavéra Hotel.</p><div className="hero-actions"><Link className="button button-gold" href="/booking">Book Your Stay <ArrowUpRight size={18}/></Link><Link className="button button-outline" href="/rooms">Explore Rooms <ArrowRight size={18}/></Link></div></div>
        <a href="#welcome" className="hero-scroll" aria-label="Scroll to discover"><span>SCROLL TO DISCOVER</span><ArrowDown size={17}/></a>
      </section>
      <div className="container booking-wrap"><BookingBar /></div>

      <section id="welcome" className="welcome section-pad"><div className="container welcome-grid"><div className="welcome-visual"><AssetImage src="/images/solavera-ocean-suite-hd.png" alt="Solavéra Ocean Suite overlooking the sea" sizes="(max-width: 900px) 100vw, 50vw"/><div className="welcome-stamp">SLOW<br/>DOWN<br/><span>STAY AWHILE</span></div></div><div className="welcome-copy"><span className="eyebrow with-line">WELCOME TO SOLAVÉRA</span><h2>Where the Sun<br/><em>Meets Serenity</em></h2><p className="lead">An invitation to leave the ordinary behind.</p><p>Tucked between lush tropical gardens and the shimmering sea, Solavéra is a place to reconnect with what matters. Unhurried mornings, soulful experiences, and quiet moments of wonder await at every turn.</p><div className="welcome-details"><div><span>01</span><strong>Thoughtful luxury</strong><small>Every detail, beautifully considered.</small></div><div><span>02</span><strong>Island spirit</strong><small>Rooted in place, made for discovery.</small></div></div><Link href="/#welcome" className="text-link">Discover Our Story <ArrowUpRight size={18}/></Link></div></div></section>

      <section id="rooms" className="rooms-section section-pad"><div className="container"><div className="section-heading"><div><span className="eyebrow with-line">YOUR PRIVATE ESCAPE</span><h2>Rooms <em>& Suites</em></h2></div><div><p>Beautifully appointed spaces that invite you to settle in, breathe deeply, and feel completely at home.</p><Link href="/rooms" className="text-link">Explore All Rooms <ArrowUpRight size={18}/></Link></div></div><div className="room-grid">{rooms.map((room, index) => <RoomCard key={room.slug} room={room} index={index}/>)}</div></div></section>

      <section id="experiences" className="experiences section-pad"><div className="container"><div className="experience-head"><span className="eyebrow with-line">BEYOND YOUR ROOM</span><h2>Moments Made<br/><em>to Remember</em></h2><p>However you choose to spend your days, every experience at Solavéra is made to feel entirely yours.</p></div><div className="experience-grid">{experiences.map(({ icon: Icon, title, text }, index) => <article key={title} className="experience-item"><span className="experience-count">0{index+1}</span><Icon size={28} strokeWidth={1.35}/><h3>{title}</h3><p>{text}</p><ArrowUpRight className="experience-arrow" size={18}/></article>)}</div></div></section>

      <section className="amenity-section"><div className="amenity-photo"><AssetImage src="/images/solavera-garden-deluxe-hd.png" alt="Garden room at Solavéra Hotel" sizes="(max-width: 900px) 100vw, 50vw"/></div><div className="amenity-content"><span className="eyebrow with-line">EVERY COMFORT, CONSIDERED</span><h2>The little things<br/><em>make it magic.</em></h2><p>From slow mornings by the pool to evenings under the stars, thoughtful comforts make every stay effortless.</p><div className="amenity-list">{amenities.map((a) => <span key={a}><Check size={16}/>{a}</span>)}</div><Link href="/booking" className="button button-dark">Plan Your Stay <ArrowUpRight size={18}/></Link></div></section>

      <section id="gallery" className="gallery-section section-pad"><div className="container"><div className="section-heading"><div><span className="eyebrow with-line">A GLIMPSE OF PARADISE</span><h2>Life at <em>Solavéra</em></h2></div><Link href="/#gallery" className="text-link">View the Gallery <ArrowUpRight size={18}/></Link></div><div className="gallery-grid"><AssetImage src="/images/solavera-ocean-view-hd.png" alt="Ocean view room" sizes="(max-width: 800px) 100vw, 60vw"/><AssetImage src="/images/solavera-garden-deluxe-hd.png" alt="Garden deluxe room" sizes="(max-width: 800px) 50vw, 20vw"/><AssetImage src="/images/solavera-ocean-suite-hd.png" alt="Ocean suite" sizes="(max-width: 800px) 50vw, 20vw"/></div></div></section>

      <section className="testimonial-section section-pad"><div className="container testimonial-inner"><span className="eyebrow">WORDS FROM OUR GUESTS</span><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“There are places you visit, and places that stay with you. Solavéra is absolutely the latter.”</blockquote><div className="reviewer"><span className="review-line"/> ALEXANDRA M. <span>·</span> VERIFIED GUEST</div></div></section>

      <section className="final-cta"><AssetImage src="/images/solavera-ocean-suite-hd.png" alt="Ocean suite at sunset" sizes="100vw"/><div className="final-cta-overlay"/><div className="container final-cta-content"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><h2>Your Paradise<br/><em>Awaits</em></h2><p>Some moments are too beautiful to leave to chance.</p><Link href="/booking" className="button button-gold">Book Your Stay <ArrowUpRight size={18}/></Link></div></section>
    </main>
    <Footer />
  </>;
}
