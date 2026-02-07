export default function AdminSettingsPage() {
  return (
    <div className="card p-6">
      <h2>Settings</h2>
      <p className="text-sm text-ink-500">
        Configure locations, opening hours, and fulfillment settings.
      </p>
      <div className="mt-6 grid gap-4">
        <div className="card border border-ink-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Opening hours
          </p>
          <p className="text-sm text-ink-600">Sun-Thu 8am-11pm</p>
          <p className="text-sm text-ink-600">Fri-Sat 8am-12am</p>
        </div>
        <div className="card border border-ink-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Delivery radius
          </p>
          <p className="text-sm text-ink-600">Up to 12 km</p>
        </div>
        <div className="card border border-ink-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Notification preferences
          </p>
          <p className="text-sm text-ink-600">SMS + Email + WhatsApp</p>
        </div>
      </div>
    </div>
  );
}
