import { physicalRooms } from "@/data/inventory";
import { readHousekeeping } from "@/lib/housekeeping";
import { updateHousekeepingAction } from "@/app/admin/housekeeping/actions";
import { getRoomTypeById } from "@/lib/admin";

const statuses = [
  { value: "clean", label: "Clean" },
  { value: "dirty", label: "Dirty" },
  { value: "cleaning", label: "Cleaning" },
] as const;

export default async function HousekeepingPage() {
  const housekeeping = await readHousekeeping();

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Housekeeping</span>
          <h2>Room Status</h2>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Occupancy</th>
                <th>Housekeeping Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {physicalRooms.map((room) => {
                const roomType = getRoomTypeById(room.roomTypeId);
                const current = housekeeping[room.id]?.status ?? (room.status === "available" ? "clean" : "dirty");
                return (
                  <tr key={room.id}>
                    <td>{room.roomNumber}</td>
                    <td>{roomType?.name ?? room.roomTypeId}</td>
                    <td>{room.status === "available" ? "Vacant" : room.status === "maintenance" ? "Maintenance" : "Out of Service"}</td>
                    <td><span className="admin-chip-outline">{current}</span></td>
                    <td>
                      <form action={updateHousekeepingAction} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input type="hidden" name="roomId" value={room.id} />
                        <select name="status" defaultValue={current}>
                          {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                        </select>
                        <button type="submit" className="button button-dark">Update</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
