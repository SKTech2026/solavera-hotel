import { listReservations } from "@/lib/reservations/service";
import { getAdminGuestRecords } from "@/lib/admin";

export default async function AdminGuestsPage() {
  const reservations = await listReservations();
  const guests = getAdminGuestRecords(reservations);

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Guests</span>
          <h2>Guest Profiles</h2>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Total Bookings</th>
                <th>Latest / Upcoming Stay</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => (
                <tr key={`${guest.email}-${guest.name}`}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>{guest.country}</td>
                  <td>{guest.totalBookings}</td>
                  <td>{guest.upcomingStay === "—" ? guest.latestStay : guest.upcomingStay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
