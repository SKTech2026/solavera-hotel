import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const base = process.env.DEMO_BASE_URL ?? "http://localhost:3001";
const store = join(process.cwd(), ".demo-data", "verification.json");
const arrival = "2027-08-01";
const departure = "2027-08-04";
const guest = { firstName: "Demo", lastName: "Guest", email: "demo.guest@example.com", phone: "+63 917 555 1234", country: "Philippines", address: "" };
const input = (overrides = {}) => ({ roomSlug: "garden-deluxe-room", checkIn: arrival, checkOut: departure, adults: 2, children: 0, rooms: 1, guest, arrivalTime: "15:00", specialRequests: "A quiet room, please.", acceptedTerms: true, extraIds: [], paymentMethod: "pay_at_hotel", ...overrides });

async function post(path, body) {
  const response = await fetch(`${base}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { response, body: await response.json() };
}

const first = await post("/api/reservations", input({ extraIds: ["airport-transfer", "breakfast"], roomRate: 1, grandTotal: 1 }));
assert.equal(first.response.status, 201);
assert.match(first.body.reservationNumber, /^SOL-\d{4}-\d{6}$/);
const receiptCookie = first.response.headers.get("set-cookie")?.split(";")[0];
assert.ok(receiptCookie);
const confirmedPage = await fetch(`${base}/booking/confirmation/${first.body.reservationNumber}`, { headers: { Cookie: receiptCookie } });
assert.equal(confirmedPage.status, 200);
assert.equal((await fetch(`${base}/booking/confirmation/${first.body.reservationNumber}`)).status, 404);

const correct = await post("/api/reservations/lookup", { reservationNumber: first.body.reservationNumber, email: "  DEMO.GUEST@example.com  " });
assert.equal(correct.response.status, 200);
assert.equal(correct.body.reservation.grandTotal, 36300);
assert.equal(correct.body.reservation.reservationStatus, "confirmed");
assert.equal(correct.body.reservation.paymentStatus, "pending");
assert.equal("id" in correct.body.reservation, false);
assert.equal("assignedRoomIds" in correct.body.reservation, false);
assert.equal("receiptTokenHash" in correct.body.reservation, false);
assert.equal("phone" in correct.body.reservation.guest, false);
assert.equal("address" in correct.body.reservation.guest, false);
assert.equal((await post("/api/reservations/lookup", { reservationNumber: first.body.reservationNumber, email: "wrong@example.com" })).response.status, 404);

const second = await post("/api/reservations", input({ paymentMethod: "bank_online", guest: { ...guest, email: "bank@example.com" } }));
assert.equal(second.response.status, 201);
const secondLookup = await post("/api/reservations/lookup", { reservationNumber: second.body.reservationNumber, email: "bank@example.com" });
assert.equal(secondLookup.body.reservation.reservationStatus, "pending");
assert.equal(secondLookup.body.reservation.paymentStatus, "pending");

const third = await post("/api/reservations", input({ guest: { ...guest, email: "third@example.com" } }));
assert.equal(third.response.status, 201);
assert.equal((await post("/api/reservations", input({ guest: { ...guest, email: "fourth@example.com" } }))).response.status, 409);

const checkoutReuse = await post("/api/reservations", input({ checkIn: departure, checkOut: "2027-08-06", guest: { ...guest, email: "checkout@example.com" } }));
assert.equal(checkoutReuse.response.status, 201);

const existing = JSON.parse(await readFile(store, "utf8"));
assert.deepEqual(existing.slice(0, 3).map((reservation) => reservation.assignedRoomIds[0]), ["g101", "g102", "g103"]);
existing.find((reservation) => reservation.reservationNumber === second.body.reservationNumber).reservationStatus = "cancelled";
await writeFile(store, JSON.stringify(existing, null, 2), "utf8");
const afterCancel = await post("/api/reservations", input({ guest: { ...guest, email: "after-cancel@example.com" } }));
assert.equal(afterCancel.response.status, 201);

const concurrent = await Promise.all(Array.from({ length: 4 }, (_, index) => post("/api/reservations", input({ roomSlug: "ocean-view-room", checkIn: "2027-09-01", checkOut: "2027-09-04", guest: { ...guest, email: `concurrent-${index}@example.com` } }))));
assert.deepEqual(concurrent.map(({ response }) => response.status).sort(), [201, 201, 201, 409]);
const afterConcurrent = JSON.parse(await readFile(store, "utf8"));
const assignedConcurrent = afterConcurrent.filter((reservation) => reservation.roomId === "ocean-view").map((reservation) => reservation.assignedRoomIds[0]);
assert.equal(new Set(assignedConcurrent).size, 3);

assert.equal((await post("/api/reservations", input({ guest: { ...guest, email: "bad" } }))).response.status, 400);
assert.equal((await post("/api/reservations", input({ paymentMethod: "card" }))).response.status, 400);
assert.equal((await post("/api/reservations", input({ extraIds: ["unknown"] }))).response.status, 400);
assert.equal((await post("/api/reservations", input({ children: 1 }))).response.status, 400);
console.log("Demo API scenarios passed: both payment methods, concurrent inventory sharing and exhaustion, checkout reuse, cancellation, secure lookup, server pricing, and invalid inputs.");
