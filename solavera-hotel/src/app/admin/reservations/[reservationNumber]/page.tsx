import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/status-badge";
import { ReservationActions } from "@/components/admin/reservation-actions";
import { formatDate, formatMoney, getRoomTypeById } from "@/lib/admin";
import { listReservations } from "@/lib/reservations/service";

export default async function ReservationDetailPage({ params }: { params: Promise<{ reservationNumber: string }> }) {
  const { reservationNumber } = await params;
  const reservation = (await listReservations()).find((entry) => entry.reservationNumber === reservationNumber);
  if (!reservation) return notFound();
  const room = getRoomTypeById(reservation.roomId);

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Reservation</span>
          <h2>{reservation.reservationNumber}</h2>
        </div>
      </header>

      <div className="admin-detail-card">
        <section className="admin-detail-section">
          <div className="admin-hero-line">
            <h2>Guest & Stay Details</h2>
            <StatusBadge type="reservation" status={reservation.reservationStatus} />
          </div>
          <div className="admin-detail-grid">
            <div className="admin-detail-field"><span>Created</span><strong>{formatDate(reservation.createdAt)}</strong></div>
            <div className="admin-detail-field"><span>Guest</span><strong>{reservation.guest.firstName} {reservation.guest.lastName}</strong></div>
            <div className="admin-detail-field"><span>Email</span><strong>{reservation.guest.email}</strong></div>
            <div className="admin-detail-field"><span>Phone</span><strong>{reservation.guest.phone || "Not provided"}</strong></div>
            <div className="admin-detail-field"><span>Room</span><strong>{reservation.roomName}</strong></div>
            <div className="admin-detail-field"><span>Check-in</span><strong>{formatDate(reservation.checkIn)}</strong></div>
            <div className="admin-detail-field"><span>Check-out</span><strong>{formatDate(reservation.checkOut)}</strong></div>
            <div className="admin-detail-field"><span>Nights</span><strong>{reservation.nights}</strong></div>
            <div className="admin-detail-field"><span>Adults</span><strong>{reservation.adults}</strong></div>
            <div className="admin-detail-field"><span>Children</span><strong>{reservation.children}</strong></div>
            <div className="admin-detail-field"><span>Extras</span><strong>{reservation.extras.length ? reservation.extras.map((extra) => extra.name).join(", ") : "None"}</strong></div>
            <div className="admin-detail-field"><span>Special Requests</span><strong>{reservation.specialRequests || "No special requests"}</strong></div>
            <div className="admin-detail-field"><span>Payment Method</span><strong>{reservation.paymentMethod === "pay_at_hotel" ? "Pay at Hotel" : "Bank / Online"}</strong></div>
            <div className="admin-detail-field"><span>Payment Status</span><strong><StatusBadge type="payment" status={reservation.paymentStatus} /></strong></div>
            <div className="admin-detail-field"><span>Reservation Status</span><strong><StatusBadge type="reservation" status={reservation.reservationStatus} /></strong></div>
            <div className="admin-detail-field"><span>Grand Total</span><strong>{formatMoney(reservation.grandTotal)}</strong></div>
          </div>
        </section>

        <aside className="admin-detail-section">
          <div className="admin-hero-line">
            <h2>Actions</h2>
          </div>
          <ReservationActions reservation={reservation} />
          <div className="admin-detail-grid" style={{ marginTop: "22px" }}>
            <div className="admin-detail-field"><span>Arrival Time</span><strong>{reservation.arrivalTime}</strong></div>
            <div className="admin-detail-field"><span>Room Type</span><strong>{room?.name ?? reservation.roomName}</strong></div>
            <div className="admin-detail-field"><span>Room Rate</span><strong>{formatMoney(reservation.roomRate)}</strong></div>
            <div className="admin-detail-field"><span>Assigned Rooms</span><strong>{reservation.assignedRoomIds.join(", ") || "—"}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
