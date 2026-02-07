export default function ReservationsPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2>Reserve a table</h2>
          <p className="text-sm text-ink-500">
            Book a seat and we will hold it for 15 minutes after the start time.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Date</label>
              <input className="input mt-2" type="date" />
            </div>
            <div>
              <label className="label">Time</label>
              <select className="input mt-2">
                <option>8:00 am</option>
                <option>9:30 am</option>
                <option>12:00 pm</option>
                <option>6:30 pm</option>
              </select>
            </div>
            <div>
              <label className="label">Party size</label>
              <select className="input mt-2">
                <option>2 guests</option>
                <option>4 guests</option>
                <option>6 guests</option>
                <option>8 guests</option>
              </select>
            </div>
            <div>
              <label className="label">Name</label>
              <input className="input mt-2" placeholder="Your name" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input mt-2" placeholder="+966" />
            </div>
            <div>
              <label className="label">Seating</label>
              <select className="input mt-2">
                <option>Indoor lounge</option>
                <option>Garden patio</option>
                <option>Bar counter</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary mt-6">Confirm reservation</button>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Private dining</h3>
          <p className="text-sm text-ink-500">
            Host a curated experience for celebrations or team events.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="chip">Chef menu</span>
            <span className="chip">AV ready</span>
            <span className="chip">10-20 guests</span>
          </div>
        </div>
      </div>
    </div>
  );
}
