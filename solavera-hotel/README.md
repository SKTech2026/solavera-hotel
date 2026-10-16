# Solavéra Hotel

Next.js App Router project for a luxury hotel website and future property management system.

## Run locally

```bash
npm install
npm run dev
```

## Assets

Place the supplied files at:

- `public/images/logo.webp`
- `public/images/room-garden.webp`
- `public/images/room-ocean.webp`
- `public/images/suite-ocean.webp`

The supplied images are installed at these paths and used throughout the homepage.

## Current scope

The public demo flow covers the homepage, room discovery and details, six booking stages, confirmation, and My Booking lookup. It does not collect payment credentials or process a payment. Guest information, extras, payment method, and reservation creation are handled through a server route. Staff administration and a production database are future phases.

## Booking architecture

- `src/components/booking/booking-experience.tsx` keeps the six-step draft in memory. Stay and room selection are retained in the URL. Selected extras and payment method are kept temporarily in namespaced `sessionStorage`; guest details are **not** stored there. The draft is cleared after a successful reservation. A refresh during guest details requires re-entering those details.
- `POST /api/reservations` validates all browser input, resolves the room type and extras from server data, recalculates nights and every total, checks physical inventory, and persists the reservation. Browser-supplied totals are ignored.
- `POST /api/reservations/lookup` requires **both** a reservation number and matching email. It never lists reservations. The confirmation route requires a short-lived HTTP-only receipt cookie issued at creation. Public responses omit internal IDs, assigned physical room IDs, receipt hashes, address, and phone.
- `src/lib/reservations/repository.ts` defines the persistence boundary. `demo-repository.ts` is its local implementation. A future PostgreSQL implementation should perform inventory selection and insertion in one transaction with database-enforced locking or exclusion rules.

## Demo persistence and inventory

The demo repository writes to `.demo-data/reservations.json` inside this project; the directory is gitignored. Set `SOLAVERA_DEMO_STORE_NAME` to a filename such as `verification.json` to use a separate file in that directory. Do **not** deploy this file store as production persistence. It requires a writable local Node filesystem and serializes writes only within one Node process. Multiple processes, serverless instances, crashes during writes, and external file edits can still race or lose data.

The guest chooses a room *type*. Physical demo inventory has three Garden Deluxe rooms (`G101`–`G103`), three Ocean View rooms (`O201`–`O203`), and two Ocean Suites (`S301`–`S302`). The repository assigns available physical rooms internally. Only inventory with `available` status can be assigned. Active reservations block an inventory item when `existing.checkIn < requested.checkOut` and `requested.checkIn < existing.checkOut`. Checkout day is reusable; cancelled reservations do not block availability. Assignment is checked again at final submission.

## Rates and statuses

Room rates and extra prices come from `src/data`. Extras support per-stay, per-night, and per-person-per-night pricing. No taxes or service fees are added. Pay at Hotel creates a `confirmed` reservation with `pending` payment. Bank / Online Payment creates a `pending` reservation with `pending` payment. Other reservation statuses are typed for later operations: `checked_in`, `checked_out`, `cancelled`, and `no_show`. Other payment statuses are `partially_paid`, `paid`, `refunded`, and `failed`. Card payment is unavailable and no card data is requested.

## Verification

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

To repeat isolated API scenarios, start the app with `SOLAVERA_DEMO_STORE_NAME=verification.json`, then run `node scripts/verify-demo.mjs` with `DEMO_BASE_URL` pointing at the server. The verification script writes demo reservations to `.demo-data/verification.json` and should be run against a fresh verification file.

## Limitations

This is **not production-ready**. The demo store has no cross-process transaction, backup, audit log, rate limiting, email delivery, or operational admin interface. My Booking uses reservation number plus email but needs production abuse controls. The confirmation receipt cookie is short-lived; after it expires, guests use My Booking. Demo terms and privacy information are at `/policies`. Replace the repository, inventory source, policies, and payment method workflow before any real hotel use.
