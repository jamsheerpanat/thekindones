"use client";

export default function AdminSettingsPage() {
  return (
    <div className="card p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-ink-900">Settings</h2>
        <p className="text-sm text-ink-500">
          Configure locations, opening hours, and fulfillment settings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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

      <div className="mt-8 pt-8 border-t border-ink-100">
        <h3 className="text-lg font-bold text-ink-900 mb-4">System Diagnostics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card border border-red-100 bg-red-50/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Database Management</p>
            <p className="text-sm text-ink-600 mb-4">Wipe all registered users and reset the database.</p>
            <a
              href="/tko/api/admin/clear-users?secret=clear_all_users_2025"
              className="btn bg-red-600 text-white hover:bg-red-700 py-2 inline-block text-center w-full shadow-sm"
              onClick={(e) => {
                if (!confirm("ARE YOU SURE? This will delete all users!")) e.preventDefault();
              }}
            >
              Clear All Users
            </a>
          </div>

          <div className="card border border-brand-200 bg-brand-50/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-2">Email Testing</p>
            <p className="text-sm text-ink-600 mb-4">Send a diagnostic email to trace connectivity with Resend.</p>
            <form action="/tko/api/admin/test-email" method="GET" className="space-y-2">
              <input type="hidden" name="secret" value="test_email_2025" />
              <input
                type="email"
                name="email"
                required
                placeholder="Target email..."
                className="input text-xs h-9"
              />
              <button className="btn btn-primary w-full py-2">Test Delivery</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
