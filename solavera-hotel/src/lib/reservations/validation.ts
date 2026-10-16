import { extras } from "@/data/extras";
import { getRoom } from "@/data/rooms";
import { validateStay } from "@/lib/booking";
import type { CreateReservationInput, Guest, PaymentMethod } from "@/types/reservation";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()\-]{7,24}$/;
const reservationPattern = /^SOL-\d{4}-\d{6}$/;
export class ReservationValidationError extends Error {}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const validReservationNumber = (value: string) => reservationPattern.test(value);

export function validateGuest(guest: Guest, acceptedTerms: boolean): string | null {
  if (!guest.firstName.trim() || guest.firstName.length > 80) return "Enter a first name of up to 80 characters.";
  if (!guest.lastName.trim() || guest.lastName.length > 80) return "Enter a last name of up to 80 characters.";
  if (guest.email.length > 254 || !emailPattern.test(normalizeEmail(guest.email))) return "Enter a valid email address.";
  const digits = guest.phone.replace(/\D/g, "");
  if (!phonePattern.test(guest.phone) || digits.length < 7 || digits.length > 15) return "Enter a valid phone number.";
  if (!guest.country.trim() || guest.country.length > 80) return "Enter a country of up to 80 characters.";
  if (guest.address.length > 250) return "Address must be 250 characters or fewer.";
  if (!acceptedTerms) return "Please agree to the booking terms and privacy policy.";
  return null;
}

function stringField(value: unknown, max: number): string | null {
  return typeof value === "string" && value.length <= max ? value.trim() : null;
}

function integerField(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) ? value : null;
}

export function parseCreateInput(value: unknown): { input: CreateReservationInput; error: null } | { input: null; error: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { input: null, error: "The booking details could not be read." };
  const raw = value as Record<string, unknown>;
  const rawGuest = raw.guest;
  if (!rawGuest || typeof rawGuest !== "object" || Array.isArray(rawGuest)) return { input: null, error: "Please complete your guest details." };
  const guestFields = rawGuest as Record<string, unknown>;
  if (typeof guestFields.address !== "string" || guestFields.address.length > 250) return { input: null, error: "Address must be 250 characters or fewer." };
  if (typeof raw.arrivalTime !== "string" || raw.arrivalTime.length > 5) return { input: null, error: "Enter a valid arrival time." };
  const guest: Guest = {
    firstName: stringField(guestFields.firstName, 80) ?? "",
    lastName: stringField(guestFields.lastName, 80) ?? "",
    email: stringField(guestFields.email, 254) ?? "",
    phone: stringField(guestFields.phone, 24) ?? "",
    country: stringField(guestFields.country, 80) ?? "",
    address: stringField(guestFields.address, 250) ?? "",
  };
  const extraIds = raw.extraIds;
  if (!Array.isArray(extraIds) || extraIds.length > extras.length || !extraIds.every((id) => typeof id === "string" && extras.some((extra) => extra.id === id)) || new Set(extraIds).size !== extraIds.length) return { input: null, error: "One or more selected extras are invalid." };
  const paymentMethod = raw.paymentMethod;
  if (paymentMethod !== "pay_at_hotel" && paymentMethod !== "bank_online") return { input: null, error: "Choose a supported payment method." };
  const roomSlug = stringField(raw.roomSlug, 80);
  const room = roomSlug ? getRoom(roomSlug) : undefined;
  if (!room) return { input: null, error: "Please choose a valid room." };
  const input: CreateReservationInput = {
    roomSlug: room.slug,
    checkIn: stringField(raw.checkIn, 10) ?? "",
    checkOut: stringField(raw.checkOut, 10) ?? "",
    adults: integerField(raw.adults) ?? -1,
    children: integerField(raw.children) ?? -1,
    rooms: integerField(raw.rooms) ?? -1,
    guest,
    arrivalTime: stringField(raw.arrivalTime, 5) ?? "",
    specialRequests: stringField(raw.specialRequests, 1000) ?? "",
    acceptedTerms: raw.acceptedTerms === true,
    extraIds,
    paymentMethod: paymentMethod as PaymentMethod,
  };
  const stayError = validateStay(input, room);
  if (stayError) return { input: null, error: stayError };
  const guestError = validateGuest(input.guest, input.acceptedTerms);
  if (guestError) return { input: null, error: guestError };
  if (input.arrivalTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.arrivalTime)) return { input: null, error: "Enter a valid arrival time." };
  if (typeof raw.specialRequests === "string" && raw.specialRequests.length > 1000) return { input: null, error: "Special requests must be 1,000 characters or fewer." };
  if (input.extraIds.includes("extra-bed") && room.id !== "ocean-suite") return { input: null, error: "The extra bed is available for the Ocean Suite only." };
  return { input, error: null };
}
