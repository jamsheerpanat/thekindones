"use client";

import { useEffect, useState } from "react";

const DISCOUNTS = ["PERCENT", "FIXED"];

type PromoRow = {
  id: string;
  code: string;
  discount: string;
  amount: number | string;
  active: boolean;
  description?: string | null;
};

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<PromoRow[]>([]);
  const [form, setForm] = useState({
    code: "",
    discount: "PERCENT",
    amount: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/promos");
    if (res.ok) {
      setPromos(await res.json());
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.code || !form.amount) return;
    setLoading(true);
    await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discount: form.discount,
        amount: Number(form.amount),
        description: form.description
      })
    });
    setLoading(false);
    setForm({ code: "", discount: "PERCENT", amount: "", description: "" });
    await load();
  };

  const toggleActive = async (promo: PromoRow) => {
    await fetch(`/api/admin/promos/${promo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !promo.active })
    });
    await load();
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>Promotions</h2>
          <p className="text-sm text-ink-500">
            Create and schedule offers across channels.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Saving..." : "New promo"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Code"
          value={form.code}
          onChange={(event) => setForm({ ...form, code: event.target.value })}
        />
        <input
          className="input"
          placeholder="Amount"
          value={form.amount}
          onChange={(event) => setForm({ ...form, amount: event.target.value })}
        />
        <select
          className="input"
          value={form.discount}
          onChange={(event) => setForm({ ...form, discount: event.target.value })}
        >
          {DISCOUNTS.map((discount) => (
            <option key={discount} value={discount}>
              {discount}
            </option>
          ))}
        </select>
        <input
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </div>

      <div className="mt-6 grid gap-3">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="flex flex-col gap-3 rounded-2xl border border-ink-100 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-ink-900">
                {promo.code}
              </p>
              <p className="text-xs text-ink-400">{promo.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip">
                {promo.discount} {promo.amount}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => toggleActive(promo)}
              >
                {promo.active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
        {!promos.length ? (
          <p className="text-sm text-ink-400">No promos yet.</p>
        ) : null}
      </div>
    </div>
  );
}
