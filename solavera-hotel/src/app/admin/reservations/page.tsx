import Link from "next/link";
import { listReservations } from "@/lib/reservations/service";
import { formatMoney, formatShortDate } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminReservationsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = searchParams ? await searchParams : {};
  const q = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const reservationStatus = typeof params.reservationStatus === "string" ? params.reservationStatus : "all";
  const paymentStatus = typeof params.paymentStatus === "string" ? params.paymentStatus : "all";

  const reservations = await listReservations();
  const filtered = reservations.filter((reservation) => {
    const matchesSearch = !q || [reservation.reservationNumber, `${reservation.guest.firstName} ${reservation.guest.lastName}`, reservation.guest.email].join(" ").toLowerCase().includes(q);
    const matchesReservationStatus = reservationStatus === "all" || reservation.reservationStatus === reservationStatus;
    const matchesPaymentStatus = paymentStatus === "all" || reservation.paymentStatus === paymentStatus;
    return matchesSearch && matchesReservationStatus && matchesPaymentStatus;
  });

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Reservations</span>
          <h2>Reservation Management</h2>
        </div>
      </header>

      <section className="admin-panel">
        <form className="admin-filters" method="GET">
          <div className="admin-filter">
            <label htmlFor="q">Search</label>
            <input id="q" name="q" defaultValue={q} placeholder="Reservation, guest, email" />
          </div>
          <div className="admin-filter">
            <label htmlFor="reservationStatus">Reservation Status</label>
            <select id="reservationStatus" name="reservationStatus" defaultValue={reservationStatus}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
          <div className="admin-filter">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select id="paymentStatus" name="paymentStatus" defaultValue={paymentStatus}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="admin-filter" style={{ justifyContent: "flex-end" }}>
            <label>&nbsp;</label>
            <button type="submit" className="button button-dark">Apply</button>
          </div>
        </form>

        <div className="admin-table-wrap">
          {filtered.length ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reservation</th>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reservation) => (
                  <tr key={reservation.reservationNumber}>
                    <td><Link href={`/admin/reservations/${reservation.reservationNumber}`}>{reservation.reservationNumber}</Link></td>
                    <td>{reservation.guest.firstName} {reservation.guest.lastName}<br /><small>{reservation.guest.email}</small></td>
                    <td>{reservation.roomName}</td>
                    <td>{formatShortDate(reservation.checkIn)}</td>
                    <td>{formatShortDate(reservation.checkOut)}</td>
                    <td>{reservation.adults + reservation.children}</td>
                    <td>{formatMoney(reservation.grandTotal)}</td>
                    <td><StatusBadge type="payment" status={reservation.paymentStatus} /></td>
                    <td><StatusBadge type="reservation" status={reservation.reservationStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <h4>No matching reservations</h4>
              <p>Try adjusting the search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
