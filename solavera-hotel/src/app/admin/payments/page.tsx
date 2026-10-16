import { listReservations } from "@/lib/reservations/service";
import { formatDate, formatMoney } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminPaymentsPage() {
  const reservations = await listReservations();
  const pending = reservations.filter((reservation) => reservation.paymentStatus === "pending").length;
  const paid = reservations.filter((reservation) => reservation.paymentStatus === "paid").length;
  const total = reservations.reduce((sum, reservation) => sum + reservation.grandTotal, 0);

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Payments</span>
          <h2>Payment Ledger</h2>
        </div>
      </header>

      <section className="admin-summary-grid">
        <article className="admin-card admin-stat"><span className="eyebrow">Pending Payments</span><strong>{pending}</strong><small>Awaiting settlement</small></article>
        <article className="admin-card admin-stat"><span className="eyebrow">Paid Payments</span><strong>{paid}</strong><small>Closed out</small></article>
        <article className="admin-card admin-stat"><span className="eyebrow">Total Booking Value</span><strong>{formatMoney(total)}</strong><small>Across all reservations</small></article>
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reservation</th>
                <th>Guest</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.reservationNumber}>
                  <td>{reservation.reservationNumber}</td>
                  <td>{reservation.guest.firstName} {reservation.guest.lastName}</td>
                  <td>{reservation.paymentMethod === "pay_at_hotel" ? "Pay at Hotel" : "Bank / Online"}</td>
                  <td>{formatMoney(reservation.grandTotal)}</td>
                  <td><StatusBadge type="payment" status={reservation.paymentStatus} /></td>
                  <td>{formatDate(reservation.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
