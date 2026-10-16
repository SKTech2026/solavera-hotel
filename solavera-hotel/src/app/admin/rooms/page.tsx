import { physicalRooms } from "@/data/inventory";
import { listReservations } from "@/lib/reservations/service";
import { formatMoney, getRoomTypeById, resolveRoomStatus } from "@/lib/admin";
import { StatusBadge } from "@/components/admin/status-badge";

export default async function AdminRoomsPage() {
  const reservations = await listReservations();
  const roomCards = physicalRooms.map((room) => {
    const roomDetail = getRoomTypeById(room.roomTypeId);
    return {
      room,
      roomDetail,
      status: resolveRoomStatus(room.id, reservations),
    };
  });

  const totalRooms = roomCards.length;
  const available = roomCards.filter((entry) => entry.status === "Available").length;
  const occupied = roomCards.filter((entry) => entry.status === "Occupied").length;
  const maintenance = roomCards.filter((entry) => entry.status === "Maintenance").length;

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Rooms</span>
          <h2>Room Inventory</h2>
        </div>
      </header>

      <section className="admin-summary-grid">
        <article className="admin-card admin-stat"><span className="eyebrow">Total Rooms</span><strong>{totalRooms}</strong><small>Across all room types</small></article>
        <article className="admin-card admin-stat"><span className="eyebrow">Available</span><strong>{available}</strong><small>Ready for arrivals</small></article>
        <article className="admin-card admin-stat"><span className="eyebrow">Occupied / Reserved</span><strong>{occupied}</strong><small>In active use</small></article>
        <article className="admin-card admin-stat"><span className="eyebrow">Maintenance</span><strong>{maintenance}</strong><small>Needs attention</small></article>
      </section>

      <section className="admin-panel">
        <div className="admin-room-row" style={{ fontWeight: 700, color: "#66736c" }}>
          <span>Room Number</span>
          <span>Room Type</span>
          <span>Capacity</span>
          <span>Rate</span>
          <span>Status</span>
        </div>
        {roomCards.map(({ room, roomDetail, status }) => (
          <div key={room.id} className="admin-room-row">
            <strong>{room.roomNumber}</strong>
            <span>{roomDetail?.name ?? room.roomTypeId}</span>
            <span>{roomDetail?.maxGuests ?? 2} guests</span>
            <span>{formatMoney(roomDetail?.price ?? 0)} / night</span>
            <StatusBadge type="reservation" status={status === "Available" ? "confirmed" : status === "Occupied" ? "checked_in" : status === "Reserved" ? "pending" : "cancelled"} />
          </div>
        ))}
      </section>
    </div>
  );
}
