import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservations/service";
import { NoInventoryError } from "@/lib/reservations/repository";
import { ReservationValidationError } from "@/lib/reservations/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "This booking request could not be accepted." }, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 8192) return NextResponse.json({ error: "The booking details are too long." }, { status: 413 });
    const { reservation, receiptToken } = await createReservation(JSON.parse(body));
    const response = NextResponse.json({ reservationNumber: reservation.reservationNumber }, { status: 201 });
    response.cookies.set("solavera_receipt", `${reservation.reservationNumber}.${receiptToken}`, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && new URL(request.url).protocol === "https:", path: "/booking/confirmation", maxAge: 60 * 60 * 24 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    if (error instanceof NoInventoryError) return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof ReservationValidationError) return NextResponse.json({ error: error.message }, { status: 400 });
    if (error instanceof SyntaxError) return NextResponse.json({ error: "The booking details could not be read." }, { status: 400 });
    return NextResponse.json({ error: "We could not save your reservation right now. Please try again." }, { status: 500 });
  }
}
