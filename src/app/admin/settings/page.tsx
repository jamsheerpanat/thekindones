"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/Spinner";

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

      <GovernorateManagement />

      <div className="mt-8 pt-8 border-t border-ink-100">
        <h3 className="text-lg font-bold text-ink-900 mb-4">System Diagnostics</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card border border-red-100 bg-red-50/30 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-600 mb-2">Database Management</p>
            <p className="text-sm text-ink-600 mb-4">Wipe all registered users and reset the database.</p>
            <a
              href="/api/admin/clear-users?secret=clear_all_users_2025"
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
            <form action="/api/admin/test-email" method="GET" className="space-y-2">
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

function GovernorateManagement() {
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");

  const fetchGovernorates = async () => {
    try {
      const res = await fetch("/api/admin/governorates");
      const data = await res.json();
      setGovernorates(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovernorates();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !fee) return;
    setSaving(true);
    try {
      await fetch("/api/admin/governorates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, deliveryFee: Number(fee) })
      });
      setName("");
      setFee("");
      await fetchGovernorates();
    } catch (err) {
      alert("Failed to add governorate");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this governorate?")) return;
    try {
      await fetch(`/api/admin/governorates/${id}`, { method: "DELETE" });
      await fetchGovernorates();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-ink-100">
      <h3 className="text-lg font-bold text-ink-900 mb-4">Governorates & Delivery Fees</h3>

      <form onSubmit={handleAdd} className="flex flex-wrap gap-3 mb-6">
        <input
          className="input h-10 w-full sm:w-64"
          placeholder="Governorate Name (e.g. Al Asimah)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="input h-10 w-full sm:w-32"
          placeholder="Fee (KWD)"
          type="number"
          step="0.001"
          value={fee}
          onChange={e => setFee(e.target.value)}
          required
        />
        <button className="btn btn-primary h-10 px-6 shrink-0" disabled={saving}>
          {saving ? "Adding..." : "Add Governorate"}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-4"><Spinner /></div>
      ) : (
        <div className="grid gap-3">
          {governorates.map((gov: any) => (
            <div key={gov.id} className="flex items-center justify-between p-4 bg-ink-50 rounded-xl border border-ink-100">
              <div>
                <p className="font-bold text-ink-900">{gov.name}</p>
                <p className="text-sm text-ink-500">Delivery Fee: {formatPrice(Number(gov.deliveryFee))}</p>
              </div>
              <button
                onClick={() => handleDelete(gov.id)}
                className="p-2 text-ink-400 hover:text-red-600 transition-colors"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              </button>
            </div>
          ))}
          {governorates.length === 0 && (
            <p className="text-center py-8 text-ink-400 border border-dashed border-ink-200 rounded-xl">No governorates added yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
