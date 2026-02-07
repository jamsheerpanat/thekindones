export default function GiftCardsPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2>Gift cards</h2>
          <p className="text-sm text-ink-500">
            Send a digital card instantly or schedule delivery for later.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Recipient name" />
            <input className="input" placeholder="Recipient email" />
            <select className="input">
              <option>$25</option>
              <option>$50</option>
              <option>$100</option>
              <option>$150</option>
            </select>
            <input className="input" type="date" />
            <textarea
              className="input md:col-span-2"
              placeholder="Add a message"
            />
          </div>
          <button className="btn btn-primary mt-4">Send gift card</button>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Corporate gifting</h3>
          <p className="text-sm text-ink-500">
            Bulk gifting for teams with custom packaging and delivery windows.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="chip">Custom design</span>
            <span className="chip">Scheduled batches</span>
            <span className="chip">Dedicated support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
