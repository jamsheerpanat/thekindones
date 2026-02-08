"use client";

import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<{ orderCount: number; userCount: number; activePromos: number } | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/tko/api/admin/analytics");
      if (res.ok) {
        setData(await res.json());
      }
    };
    load();
  }, []);

  const metrics = [
    { label: "Orders", value: data?.orderCount ?? "-" },
    { label: "Users", value: data?.userCount ?? "-" },
    { label: "Active promos", value: data?.activePromos ?? "-" }
  ];

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>Analytics</h2>
          <p className="text-sm text-ink-500">
            Performance across delivery, pickup, and reservations.
          </p>
        </div>
        <button className="btn btn-outline">Export report</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="card border border-ink-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {metric.label}
            </p>
            <p className="text-lg font-semibold text-ink-900">
              {metric.value}
            </p>
            <p className="text-xs text-ink-400">Updated just now</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-dashed border-ink-200 bg-ink-50/70 p-10 text-center text-sm text-ink-400">
        Chart placeholder - daily orders, revenue, and fulfillment time
      </div>
    </div>
  );
}
