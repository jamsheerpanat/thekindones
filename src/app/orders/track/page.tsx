import Link from "next/link";

export default function TrackPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2>Track an order</h2>
          <p className="text-sm text-ink-500">
            Enter your order number to view live status updates.
          </p>
          <div className="mt-6 grid gap-4">
            <input className="input" placeholder="Order number" />
            <input className="input" placeholder="Phone number" />
            <Link href="/orders/10024" className="btn btn-primary">
              Track now
            </Link>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Live updates</h3>
          <p className="text-sm text-ink-500">
            We will text you when your order is ready for pickup or on the way.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="chip">SMS alerts</span>
            <span className="chip">WhatsApp updates</span>
            <span className="chip">Push notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
}
