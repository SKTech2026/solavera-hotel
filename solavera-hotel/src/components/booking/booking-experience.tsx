"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, BedDouble, Check, UsersRound } from "lucide-react";
import { AssetImage } from "@/components/ui/asset-image";
import { BookingSummary } from "./booking-summary";
import { extras, type Extra } from "@/data/extras";
import { peso } from "@/data/rooms";
import { bookingUrl, canAccommodate, numberOfNights, roomSubtotal, todayDate, validateStay, type BookingSelection, type Stay } from "@/lib/booking";
import { priceExtras } from "@/lib/reservations/pricing";
import { validateGuest } from "@/lib/reservations/validation";
import type { Room } from "@/types/room";
import type { Guest, PaymentMethod } from "@/types/reservation";

const steps = ["Stay", "Room", "Guest", "Extras", "Payment", "Confirmation"];
const draftKey = "solavera:booking-draft:v1";
const emptyGuest: Guest = { firstName: "", lastName: "", email: "", phone: "", country: "", address: "" };
const pricingLabel = (extra: Extra) => extra.pricingType === "per_stay" ? "per stay" : extra.pricingType === "per_night" ? "per night" : "per person, per night";

export function BookingExperience({ rooms, initial, initialError }: { rooms: Room[]; initial: BookingSelection; initialError: string | null }) {
  const router = useRouter();
  const [stay, setStay] = useState<Stay>({ checkIn: initial.checkIn, checkOut: initial.checkOut, adults: initial.adults, children: initial.children, rooms: initial.rooms });
  const [selected, setSelected] = useState(initial.room ?? "");
  const [step, setStep] = useState(initial.checkIn && initial.checkOut && !initialError ? 2 : 1);
  const [guest, setGuest] = useState<Guest>(emptyGuest);
  const [arrivalTime, setArrivalTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [extraIds, setExtraIds] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pay_at_hotel");
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [pending, setPending] = useState(false);
  const today = todayDate();
  const nights = numberOfNights(stay.checkIn, stay.checkOut);
  const chosen = rooms.find((room) => room.slug === selected);
  const matching = rooms.filter((room) => canAccommodate(room, stay));
  const selectedExtras = extras.filter((extra) => extraIds.includes(extra.id));
  const priced = nights ? priceExtras(selectedExtras, nights, stay.adults + stay.children) : { lines: [], subtotal: 0 };

  useEffect(() => {
    let cancelled = false;
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey) ?? "null") as { extraIds?: string[]; paymentMethod?: PaymentMethod } | null;
      queueMicrotask(() => {
        if (cancelled) return;
        if (draft?.extraIds) setExtraIds(draft.extraIds.filter((id) => extras.some((extra) => extra.id === id)));
        if (draft?.paymentMethod === "bank_online") setPaymentMethod("bank_online");
        setDraftLoaded(true);
      });
    } catch { queueMicrotask(() => { if (!cancelled) setDraftLoaded(true); }); }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    try { sessionStorage.setItem(draftKey, JSON.stringify({ extraIds, paymentMethod })); } catch { /* Storage may be unavailable. URL retains stay and room. */ }
  }, [extraIds, paymentMethod, draftLoaded]);

  function updateStay(key: keyof Stay, value: string) {
    setStay((current) => ({ ...current, [key]: key === "checkIn" || key === "checkOut" ? value : Number(value) }));
    setError("");
  }

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateStay(stay);
    if (message) { setError(message); return; }
    const nextSelected = chosen && canAccommodate(chosen, stay) ? selected : "";
    setSelected(nextSelected); setStep(2); setError("");
    router.replace(bookingUrl({ ...stay, room: nextSelected || undefined }), { scroll: false });
  }

  function choose(room: Room) {
    setSelected(room.slug); setError("");
    router.replace(bookingUrl({ ...stay, room: room.slug }), { scroll: false });
  }

  function continueToGuest() {
    const message = chosen ? validateStay(stay, chosen) : "Please select a room first.";
    if (message) { setError(message); return; }
    setError(""); setStep(3); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function continueToExtras(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validateGuest(guest, acceptedTerms);
    if (message) { setError(message); return; }
    setError(""); setStep(4); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleExtra(id: string) { setExtraIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }

  async function submitReservation() {
    if (!chosen || !nights || validateStay(stay, chosen) || validateGuest(guest, acceptedTerms)) { setError("Please review your stay and guest details before confirming."); setStep(1); return; }
    setError(""); setPending(true);
    try {
      const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomSlug: chosen.slug, ...stay, guest, arrivalTime, specialRequests, acceptedTerms, extraIds, paymentMethod }) });
      const result = await response.json() as { reservationNumber?: string; error?: string };
      if (!response.ok || !result.reservationNumber) {
        setError(result.error ?? "We could not save your reservation. Please try again.");
        if (response.status === 409) setStep(2);
        return;
      }
      sessionStorage.removeItem(draftKey);
      router.push(`/booking/confirmation/${encodeURIComponent(result.reservationNumber)}`);
    } catch { setError("We could not save your reservation right now. Please try again."); }
    finally { setPending(false); }
  }

  return <div className="booking-layout"><div className="booking-workspace">
    <nav className="booking-steps" aria-label="Booking steps">{steps.map((label, index) => <div key={label} className={`booking-step ${index + 1 === step ? "active" : ""} ${index + 1 < step ? "complete" : ""}`} aria-current={index + 1 === step ? "step" : undefined}><span>{index + 1 < step ? <Check size={15}/> : String(index + 1).padStart(2, "0")}</span><small>{label}</small></div>)}</nav>

    {step === 1 && <section className="booking-stage"><span className="eyebrow with-line">STEP ONE · YOUR STAY</span><h2>When shall we<br/><em>welcome you?</em></h2><p>Begin with your dates and guests. You can explore rooms before sharing any personal details.</p>{chosen && <div className="prefill-note">Interested in the <strong>{chosen.name}</strong>? We’ll keep it in mind as you search.</div>}<form className="stay-form" onSubmit={search}><div className="stay-form-grid"><label>Check-in<input type="date" required min={today} value={stay.checkIn} onChange={(event) => updateStay("checkIn", event.target.value)}/></label><label>Check-out<input type="date" required min={stay.checkIn || today} value={stay.checkOut} onChange={(event) => updateStay("checkOut", event.target.value)}/></label><label>Adults<select value={stay.adults} onChange={(event) => updateStay("adults", event.target.value)}>{Array.from({ length: 12 }, (_, index) => index + 1).map((n) => <option key={n}>{n}</option>)}</select></label><label>Children<select value={stay.children} onChange={(event) => updateStay("children", event.target.value)}>{Array.from({ length: 13 }, (_, index) => index).map((n) => <option key={n}>{n}</option>)}</select></label><label>Rooms<select value={stay.rooms} onChange={(event) => updateStay("rooms", event.target.value)}>{[1,2,3,4].map((n) => <option key={n}>{n}</option>)}</select></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit">Search Rooms <ArrowRight size={18}/></button></form></section>}

    {step === 2 && <section className="booking-stage"><button type="button" className="booking-back" onClick={() => setStep(1)}><ArrowLeft size={16}/> Edit stay</button><span className="eyebrow with-line">STEP TWO · YOUR ROOM</span><h2>Find your <em>place.</em></h2><p>Choose a room type for your stay. Physical room availability is checked again when you confirm.</p>{error && <p className="form-error" role="alert">{error}</p>}{matching.length ? <div className="booking-room-list">{matching.map((room) => <article key={room.slug} className={`booking-option ${selected === room.slug ? "selected" : ""}`}><AssetImage src={room.image} alt={room.alt} sizes="(max-width: 700px) 100vw, 260px"/><div className="booking-option-copy"><span className="eyebrow">{room.category}</span><h3>{room.name}</h3><div className="booking-option-facts"><span><UsersRound size={15}/> Up to {room.maxGuests}</span><span><BedDouble size={15}/> {room.bedType}</span></div><p>{room.features.slice(0, 2).join(" · ")}</p><div className="booking-option-footer"><div><strong>{peso(room.price)}</strong><small> / night</small>{nights && <span>{nights} nights × {stay.rooms} {stay.rooms === 1 ? "room" : "rooms"}: <b>{peso(roomSubtotal(room, nights, stay.rooms))}</b></span>}</div><button type="button" onClick={() => choose(room)}>{selected === room.slug ? "Selected" : "Select Room"} <ArrowUpRight size={16}/></button></div></div></article>)}</div> : <div className="rooms-empty"><h3>No room type fits this guest selection.</h3><p>Try fewer guests or more rooms to see a suitable stay.</p><button type="button" onClick={() => setStep(1)}>Edit dates & guests <ArrowRight size={16}/></button></div>}{chosen && canAccommodate(chosen, stay) && <div className="booking-next"><Check size={20}/><div><strong>{chosen.name} selected</strong><p>Continue with the details for your stay.</p></div><button type="button" onClick={continueToGuest}>Continue <ArrowRight size={16}/></button></div>}</section>}

    {step === 3 && <section className="booking-stage"><button type="button" className="booking-back" onClick={() => setStep(2)}><ArrowLeft size={16}/> Back to rooms</button><span className="eyebrow with-line">STEP THREE · GUEST DETAILS</span><h2>Let us get<br/><em>to know you.</em></h2><p>Tell us who to welcome. Your details are used only for this demo reservation.</p><form className="guest-form" onSubmit={continueToExtras}><div className="stay-form-grid"><label>First name *<input required maxLength={80} autoComplete="given-name" value={guest.firstName} onChange={(event) => setGuest({ ...guest, firstName: event.target.value })}/></label><label>Last name *<input required maxLength={80} autoComplete="family-name" value={guest.lastName} onChange={(event) => setGuest({ ...guest, lastName: event.target.value })}/></label><label>Email *<input required type="email" maxLength={254} autoComplete="email" value={guest.email} onChange={(event) => setGuest({ ...guest, email: event.target.value })}/></label><label>Phone *<input required type="tel" maxLength={24} autoComplete="tel" value={guest.phone} onChange={(event) => setGuest({ ...guest, phone: event.target.value })}/></label><label>Country *<input required maxLength={80} autoComplete="country-name" value={guest.country} onChange={(event) => setGuest({ ...guest, country: event.target.value })}/></label><label>Address<input maxLength={250} autoComplete="street-address" value={guest.address} onChange={(event) => setGuest({ ...guest, address: event.target.value })}/></label><label>Estimated arrival time<input type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)}/></label></div><label className="wide-label">Special requests<textarea maxLength={1000} rows={4} value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} placeholder="Anything we should know before you arrive?"/></label><label className="terms-check"><input type="checkbox" required checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)}/><span>I agree to the <a href="/policies" target="_blank" rel="noopener noreferrer">booking terms and privacy policy</a>.</span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit">Continue to Extras <ArrowRight size={18}/></button></form></section>}

    {step === 4 && <section className="booking-stage"><button type="button" className="booking-back" onClick={() => setStep(3)}><ArrowLeft size={16}/> Back to guest details</button><span className="eyebrow with-line">STEP FOUR · MAKE IT YOURS</span><h2>A little <em>extra.</em></h2><p>Thoughtful touches for the stay you have in mind. Every extra is optional.</p><div className="extra-grid">{extras.filter((extra) => extra.id !== "extra-bed" || chosen?.id === "ocean-suite").map((extra) => { const line = nights ? priceExtras([extra], nights, stay.adults + stay.children).lines[0] : null; return <label key={extra.id} className={`extra-card ${extraIds.includes(extra.id) ? "selected" : ""}`}><input type="checkbox" checked={extraIds.includes(extra.id)} onChange={() => toggleExtra(extra.id)}/><span className="extra-card-copy"><strong>{extra.name}</strong><small>{extra.description}</small><em>{peso(extra.price)} {pricingLabel(extra)}{line && ` · ${peso(line.total)} for this stay`}</em></span></label>; })}</div><div className="extras-total"><span>Selected extras</span><strong>{peso(priced.subtotal)}</strong></div><button type="button" className="button button-dark" onClick={() => { setError(""); setStep(5); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Continue to Payment Method <ArrowRight size={18}/></button></section>}

    {step === 5 && <section className="booking-stage"><button type="button" className="booking-back" onClick={() => setStep(4)}><ArrowLeft size={16}/> Back to extras</button><span className="eyebrow with-line">STEP FIVE · PAYMENT METHOD</span><h2>Almost <em>there.</em></h2><p>Select how you plan to pay. No payment details or funds are collected online in this demo.</p><div className="payment-options"><label className={paymentMethod === "pay_at_hotel" ? "selected" : ""}><input type="radio" name="payment-method" checked={paymentMethod === "pay_at_hotel"} onChange={() => setPaymentMethod("pay_at_hotel")}/><span><strong>Pay at Hotel</strong><small>Your reservation is confirmed now. Settle payment when you arrive.</small></span></label><label className={paymentMethod === "bank_online" ? "selected" : ""}><input type="radio" name="payment-method" checked={paymentMethod === "bank_online"} onChange={() => setPaymentMethod("bank_online")}/><span><strong>Bank / Online Payment</strong><small>Your reservation remains pending. Manual payment instructions will follow separately.</small></span></label><div className="payment-unavailable"><span><strong>Credit / Debit Card</strong><small>Online card payment is not yet available.</small></span><span>COMING SOON</span></div></div>{error && <p className="form-error" role="alert">{error}</p>}<button type="button" className="button button-dark" disabled={pending} onClick={submitReservation}>{pending ? "Saving your reservation…" : "Confirm Reservation"} <ArrowRight size={18}/></button><p className="booking-reassurance">No card details are requested and no payment is taken.</p></section>}
  </div><BookingSummary stay={stay} room={chosen} selectedExtras={selectedExtras} paymentMethod={paymentMethod}/></div>;
}
