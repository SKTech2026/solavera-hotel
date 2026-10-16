import test from "node:test";
import assert from "node:assert/strict";
import { numberOfNights, canAccommodate } from "../src/lib/booking.ts";
import { summarizeReservations } from "../src/lib/admin.ts";
import { datesOverlap, availablePhysicalRooms } from "../src/lib/reservations/availability.ts";
import { priceExtra, priceExtras } from "../src/lib/reservations/pricing.ts";
import { initialStatuses } from "../src/lib/reservations/status.ts";

test("date-only night counts survive DST and month boundaries", () => {
  assert.equal(numberOfNights("2027-03-13", "2027-03-16"), 3);
  assert.equal(numberOfNights("2027-02-28", "2027-03-01"), 1);
  assert.equal(numberOfNights("2027-02-30", "2027-03-02"), null);
});

test("checkout can be the next guest's check-in", () => {
  assert.equal(datesOverlap("2027-04-01", "2027-04-04", "2027-04-04", "2027-04-07"), false);
  assert.equal(datesOverlap("2027-04-01", "2027-04-04", "2027-04-03", "2027-04-07"), true);
});

test("active reservations and maintenance block individual inventory", () => {
  const inventory = [
    { id: "g101", roomTypeId: "garden", status: "available" },
    { id: "g102", roomTypeId: "garden", status: "available" },
    { id: "g103", roomTypeId: "garden", status: "maintenance" },
  ];
  const reservations = [
    { assignedRoomIds: ["g101"], checkIn: "2027-04-01", checkOut: "2027-04-05", reservationStatus: "confirmed" },
    { assignedRoomIds: ["g102"], checkIn: "2027-04-01", checkOut: "2027-04-05", reservationStatus: "cancelled" },
  ];
  assert.deepEqual(availablePhysicalRooms(inventory, reservations, "garden", "2027-04-02", "2027-04-04").map((room) => room.id), ["g102"]);
  assert.deepEqual(availablePhysicalRooms(inventory, reservations, "garden", "2027-04-05", "2027-04-06").map((room) => room.id), ["g101", "g102"]);
});

test("extra pricing uses the declared pricing type", () => {
  const airport = { id: "airport", name: "Airport", price: 1500, pricingType: "per_stay" };
  const breakfast = { id: "breakfast", name: "Breakfast", price: 900, pricingType: "per_person" };
  const bed = { id: "bed", name: "Bed", price: 1800, pricingType: "per_night" };
  assert.equal(priceExtra(airport, 3, 2).total, 1500);
  assert.equal(priceExtra(breakfast, 3, 2).total, 5400);
  assert.equal(priceExtra(bed, 3, 2).total, 5400);
  assert.equal(priceExtras([airport, breakfast], 3, 2).subtotal, 6900);
});

test("guest capacity and initial payment statuses are centralized", () => {
  const room = { available: true, maxGuests: 2, adults: 2, children: 0 };
  assert.equal(canAccommodate(room, { adults: 2, children: 0, rooms: 1 }), true);
  assert.equal(canAccommodate(room, { adults: 2, children: 1, rooms: 1 }), false);
  assert.equal(canAccommodate(room, { adults: 4, children: 0, rooms: 2 }), true);
  assert.deepEqual(initialStatuses("pay_at_hotel"), { reservationStatus: "confirmed", paymentStatus: "pending" });
  assert.deepEqual(initialStatuses("bank_online"), { reservationStatus: "pending", paymentStatus: "pending" });
});

test("admin summaries aggregate arrivals, departures, open payments, and totals", () => {
  const today = new Date().toISOString().slice(0, 10);
  const reservations = [
    { reservationNumber: "SOL-1", guest: { firstName: "A", lastName: "Guest", email: "a@example.com" }, checkIn: today, checkOut: "2099-01-03", paymentStatus: "pending", reservationStatus: "confirmed", roomName: "Ocean View", roomId: "ocean-view", grandTotal: 32000, createdAt: today },
    { reservationNumber: "SOL-2", guest: { firstName: "B", lastName: "Guest", email: "b@example.com" }, checkIn: "2099-01-01", checkOut: today, paymentStatus: "paid", reservationStatus: "checked_out", roomName: "Garden Deluxe", roomId: "garden-deluxe", grandTotal: 26000, createdAt: today },
    { reservationNumber: "SOL-3", guest: { firstName: "C", lastName: "Guest", email: "c@example.com" }, checkIn: "2099-01-04", checkOut: "2099-01-07", paymentStatus: "pending", reservationStatus: "pending", roomName: "Ocean Suite", roomId: "ocean-suite", grandTotal: 49000, createdAt: today },
    { reservationNumber: "SOL-4", guest: { firstName: "D", lastName: "Guest", email: "d@example.com" }, checkIn: "2099-01-06", checkOut: "2099-01-08", paymentStatus: "paid", reservationStatus: "cancelled", roomName: "Garden Deluxe", roomId: "garden-deluxe", grandTotal: 20000, createdAt: today },
  ];

  const summary = summarizeReservations(reservations, new Date(`${today}T12:00:00Z`));
  assert.equal(summary.arrivals.length, 1);
  assert.equal(summary.departures.length, 1);
  assert.equal(summary.pendingPayments, 2);
  assert.equal(summary.totalReservations, 4);
  assert.equal(summary.currentGuests, 1);
});
