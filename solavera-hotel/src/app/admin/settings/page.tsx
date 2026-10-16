export default function AdminSettingsPage() {
  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div>
          <span className="eyebrow with-line">Settings</span>
          <h2>Hotel Configuration</h2>
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="hotel-name">Hotel Name</label>
            <input id="hotel-name" defaultValue="Solavéra Hotel" readOnly />
          </div>
          <div className="admin-field">
            <label htmlFor="currency">Currency</label>
            <input id="currency" defaultValue="PHP" readOnly />
          </div>
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input id="email" defaultValue="reservations@solavera.example" readOnly />
          </div>
          <div className="admin-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" defaultValue="+63 917 555 0100" readOnly />
          </div>
          <div className="admin-field">
            <label htmlFor="checkin">Check-in Time</label>
            <input id="checkin" defaultValue="15:00" readOnly />
          </div>
          <div className="admin-field">
            <label htmlFor="checkout">Check-out Time</label>
            <input id="checkout" defaultValue="12:00" readOnly />
          </div>
        </div>
        <div className="admin-panel-actions">
          <span className="admin-chip-outline">Demo configuration only</span>
        </div>
      </section>
    </div>
  );
}
