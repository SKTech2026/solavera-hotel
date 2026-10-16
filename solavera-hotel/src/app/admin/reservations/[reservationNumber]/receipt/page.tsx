import { notFound } from "next/navigation";
import { PrintReceiptButton } from "@/components/admin/print-receipt-button";
import { formatDate, formatMoney } from "@/lib/admin";
import { listReservations } from "@/lib/reservations/service";

export default async function ReservationReceiptPage({ params }: { params: Promise<{ reservationNumber: string }> }) {
  const { reservationNumber } = await params;
  const reservation = (await listReservations()).find((entry) => entry.reservationNumber === reservationNumber);

  if (!reservation) {
    return notFound();
  }

  return (
    <main className="receipt-page">
      <div className="receipt-shell">
        <div className="receipt-actions">
          <PrintReceiptButton />
        </div>

        <header className="receipt-header">
          <div className="receipt-brand">SOLAVÉRA HOTEL &amp; RESORT</div>
          <h1>Reservation Receipt</h1>
        </header>

        {reservation.paymentStatus === "pending" && (
          <div className="receipt-payment-banner">PAYMENT STATUS: PENDING</div>
        )}

        <section className="receipt-section">
          <div className="receipt-row">
            <span>Reservation Number</span>
            <strong>{reservation.reservationNumber}</strong>
          </div>
          <div className="receipt-row">
            <span>Guest Name</span>
            <strong>{reservation.guest.firstName} {reservation.guest.lastName}</strong>
          </div>
          <div className="receipt-row">
            <span>Email</span>
            <strong>{reservation.guest.email}</strong>
          </div>
          <div className="receipt-row">
            <span>Phone</span>
            <strong>{reservation.guest.phone || "Not provided"}</strong>
          </div>
          <div className="receipt-row">
            <span>Room / Room Type</span>
            <strong>{reservation.roomName}</strong>
          </div>
          <div className="receipt-row">
            <span>Check-in</span>
            <strong>{formatDate(reservation.checkIn)}</strong>
          </div>
          <div className="receipt-row">
            <span>Check-out</span>
            <strong>{formatDate(reservation.checkOut)}</strong>
          </div>
          <div className="receipt-row">
            <span>Number of Nights</span>
            <strong>{reservation.nights}</strong>
          </div>
          <div className="receipt-row">
            <span>Adults</span>
            <strong>{reservation.adults}</strong>
          </div>
          <div className="receipt-row">
            <span>Children</span>
            <strong>{reservation.children}</strong>
          </div>
          <div className="receipt-row">
            <span>Room Charges</span>
            <strong>{formatMoney(reservation.roomSubtotal)}</strong>
          </div>
          <div className="receipt-row">
            <span>Extras</span>
            <strong>{reservation.extras.length ? reservation.extras.map((extra) => `${extra.name} (${formatMoney(extra.total)})`).join(", ") : "None"}</strong>
          </div>
          <div className="receipt-row">
            <span>Extras Total</span>
            <strong>{formatMoney(reservation.extrasSubtotal)}</strong>
          </div>
          <div className="receipt-row">
            <span>Grand Total</span>
            <strong>{formatMoney(reservation.grandTotal)}</strong>
          </div>
          <div className="receipt-row">
            <span>Payment Method</span>
            <strong>{reservation.paymentMethod === "pay_at_hotel" ? "Pay at Hotel" : "Bank / Online"}</strong>
          </div>
          <div className="receipt-row">
            <span>Payment Status</span>
            <strong>{reservation.paymentStatus.toUpperCase()}</strong>
          </div>
          <div className="receipt-row">
            <span>Reservation Status</span>
            <strong>{reservation.reservationStatus.toUpperCase()}</strong>
          </div>
          <div className="receipt-row">
            <span>Booking / Created Date</span>
            <strong>{formatDate(reservation.createdAt)}</strong>
          </div>
        </section>

        <footer className="receipt-footer">Thank you for choosing Solavéra Hotel.</footer>
      </div>
    </main>
  );
}
