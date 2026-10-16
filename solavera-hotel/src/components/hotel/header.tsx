"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Experience", href: "/#experiences" },
  { label: "Gallery", href: "/#gallery" },
  { label: "About", href: "/#welcome" },
  { label: "Contact", href: "mailto:stay@solaverahotel.com" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`site-header ${scrolled || open ? "site-header-solid" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="brand" aria-label="Solavéra Hotel homepage" onClick={() => setOpen(false)}>
          <Image src="/images/solavera-logo-hd.png" alt="Solavéra Hotel" width={48} height={48} className="brand-logo" priority />
          <span className="brand-type"><strong>SOLAVÉRA</strong><small>HOTEL & RESORT</small></span>
        </Link>
        <nav id="main-navigation" className={`nav-links ${open ? "nav-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => <Link key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}
          <Link href="/booking" className="mobile-book" onClick={() => setOpen(false)}>Book Your Stay <ArrowUpRight size={16} /></Link>
        </nav>
        <Link href="/booking" className="nav-cta">Book Your Stay <ArrowUpRight size={16} /></Link>
        <button ref={menuButtonRef} className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
