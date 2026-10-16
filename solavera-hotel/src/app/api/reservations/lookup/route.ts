import { NextResponse } from "next/server";
import { lookupReservation } from "@/lib/reservations/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "This lookup could not be accepted." }, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 1024) return NextResponse.json({ error: "Please check your reservation details." }, { status: 400 });
    const raw: unknown = JSON.parse(body);
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return NextResponse.json({ error: "Please check your reservation details." }, { status: 400 });
    const data = raw as Record<string, unknown>;
    const reservation = typeof data.reservationNumber === "string" && typeof data.email === "string" ? await lookupReservation(data.reservationNumber.trim().toUpperCase(), data.email) : null;
    const response = reservation ? NextResponse.json({ reservation }) : NextResponse.json({ error: "We could not find a booking with that reservation number and email." }, { status: 404 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ error: "We could not look up your booking right now. Please try again." }, { status: 500 });
  }
}
