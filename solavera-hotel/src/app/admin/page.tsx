import Link from "next/link";
import { CalendarArrowUp, CalendarRange, CreditCard, DoorOpen, Users } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatMoney, formatShortDate, getAdminGreeting, getDashboardData, getRoomName } from "@/lib/admin";

export default async function AdminOverviewPage() {
  const { summary, occupancy, recentReservations, now } = await getDashboardData();
  const greeting = getAdminGreeting(now);

  const summaryCards = [
    { label: "Today's Arrivals", value: summary.arrivals.length, icon: CalendarArrowUp, detail: summary.arrivals[0] ? `${summary.arrivals[0].guest.firstName} ${summary.arrivals[0].guest.lastName}` : "No arrivals" },
    { label: "Today's Departures", value: summary.departures.length, icon: DoorOpen, detail: summary.departures[0] ? `${summary.departures[0].guest.firstName} ${summary.departures[0].guest.lastName}` : "No departures" },
    { label: "Current Guests", value: summary.currentGuests, icon: Users, detail: `${occupancy.occupiedRooms} rooms active` },
    { label: "Available Rooms", value: occupancy.availableRooms, icon: CalendarRange, detail: `${occupancy.totalRooms} total rooms` },
    { label: "Pending Payments", value: summary.pendingPayments, icon: CreditCard, detail: `${summary.totalReservations} total reservations` },
    { label: "Total Reservations", value: summary.totalReservations, icon: CalendarRange, detail: `Updated ${now.toLocaleDateString()}` },
  ];

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">{greeting}</span>
          <h2>Solavéra Hotel Overview</h2>
        </div>
        <p>{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now)}</p>
      </header>

      <section className="admin-summary-grid" aria-label="Hotel overview summary cards">
        {summaryCards.map(({ label, value, icon: Icon, detail }) => (
          <article key={label} className="admin-card admin-stat">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="eyebrow">{label}</span>
              <Icon size={18} color="#a47d43" />
            </div>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <div className="admin-grid-two">
        <section className="admin-panel admin-occupancy-wrap">
          <div className="admin-panel-header">
            <h3>Occupancy</h3>
            <span className="admin-chip-outline">{occupancy.occupancyPercent}%</span>
          </div>
          <div className="admin-occupancy-total">
            <span className="eyebrow">Occupied Rooms</span>
            <strong>{occupancy.occupiedRooms}</strong>
          </div>
          <div className="admin-occupancy-meter" aria-label="Occupancy meter">
            <span className="admin-occupancy-bar" style={{ width: `${occupancy.occupancyPercent}%` }} />
          </div>
          <div className="admin-occupancy-legend">
            <div className="admin-legend-item"><span style={{ background: "#113c3b" }} /> Occupied {occupancy.occupiedRooms}</div>
            <div className="admin-legend-item"><span style={{ background: "#a7b8af" }} /> Available {occupancy.availableRooms}</div>
            <div className="admin-legend-item"><span style={{ background: "#d0b57f" }} /> Maintenance {occupancy.maintenanceRooms}</div>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <h3>Today&apos;s Activity</h3>
          </div>
          <div className="admin-container">
            <div>
              <div className="admin-hero-line">
                <h2>Arrivals</h2>
              </div>
              {summary.arrivals.length ? (
                <div className="admin-list">
                  {summary.arrivals.slice(0, 3).map((reservation) => (
                    <div key={reservation.reservationNumber} className="admin-list-item">
                      <div>
                        <strong>{reservation.guest.firstName} {reservation.guest.lastName}</strong>
                        <small>{getRoomName(reservation.roomId)} · {formatShortDate(reservation.checkIn)}</small>
                      </div>
                      <StatusBadge type="reservation" status={reservation.reservationStatus} />
                    </div>
                  ))}
                </div>
              ) : <div className="admin-empty"><h4>No arrivals</h4><p>There are no check-ins scheduled for today.</p></div>}
            </div>
            <div>
              <div className="admin-hero-line">
                <h2>Departures</h2>
              </div>
              {summary.departures.length ? (
                <div className="admin-list">
                  {summary.departures.slice(0, 3).map((reservation) => (
                    <div key={reservation.reservationNumber} className="admin-list-item">
                      <div>
                        <strong>{reservation.guest.firstName} {reservation.guest.lastName}</strong>
                        <small>{getRoomName(reservation.roomId)} · {formatShortDate(reservation.checkOut)}</small>
                      </div>
                      <StatusBadge type="payment" status={reservation.paymentStatus} />
                    </div>
                  ))}
                </div>
              ) : <div className="admin-empty"><h4>No departures</h4><p>There are no check-outs scheduled for today.</p></div>}
            </div>
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h3>Recent Reservations</h3>
          <Link href="/admin/reservations">View All Reservations</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reservation</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReservations.map((reservation) => (
                <tr key={reservation.reservationNumber}>
                  <td><Link href={`/admin/reservations/${reservation.reservationNumber}`}>{reservation.reservationNumber}</Link></td>
                  <td>{reservation.guest.firstName} {reservation.guest.lastName}</td>
                  <td>{reservation.roomName}</td>
                  <td>{formatShortDate(reservation.checkIn)}</td>
                  <td>{formatShortDate(reservation.checkOut)}</td>
                  <td>{formatMoney(reservation.grandTotal)}</td>
                  <td><StatusBadge type="reservation" status={reservation.reservationStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
