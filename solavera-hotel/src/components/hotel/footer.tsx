import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-main"><Link href="/" className="footer-logo" aria-label="Solavéra Hotel homepage"><Image src="/images/solavera-logo-hd.png" alt="Solavéra Hotel" width={100} height={100} /></Link><p>Where the sun meets serenity. An intimate island escape shaped by sea, light, and the art of slowing down.</p><div className="footer-social"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={19}/></a><a href="https://facebook.com" aria-label="Facebook"><Facebook size={19}/></a></div></div>
        <div><h3>Explore</h3><Link href="/rooms">Rooms & Suites</Link><Link href="/#experiences">Experiences</Link><Link href="/gallery">Gallery</Link><Link href="/about">Our Story</Link></div>
        <div><h3>Your Stay</h3><Link href="/booking">Book Your Stay</Link><Link href="/my-booking">My Booking</Link><Link href="/contact">Contact</Link><Link href="/policies">Policies</Link></div>
        <div><h3>Get in touch</h3><p>Philippines<br/>A private island state of mind</p><a href="mailto:stay@solaverahotel.com">stay@solaverahotel.com <ArrowUpRight size={14}/></a><a href="tel:+63280000000">+63 2 8000 0000</a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Solavéra Hotel. All rights reserved.</span><span>Made for moments that stay with you.</span></div>
    </footer>
  );
}
