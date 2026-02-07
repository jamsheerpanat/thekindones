"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type Analytics = {
  orderCount: number;
  userCount: number;
  activePromos: number;
};

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
};

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const [analyticsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/orders")
      ]);
      if (analyticsRes.ok) {
        setAnalytics(await analyticsRes.json());
      }
      if (ordersRes.ok) {
        setOrders(await ordersRes.json());
      }
    };
    load();
  }, []);

  const stats = [
    { label: "Total orders", value: analytics?.orderCount ?? "-" },
    { label: "Users", value: analytics?.userCount ?? "-" },
    { label: "Active promos", value: analytics?.activePromos ?? "-" },
    { label: "Live orders", value: orders.length }
  ];

  return (
    <>
      <div className="card p-6">
        <h2>Admin dashboard</h2>
        <p className="text-sm text-ink-500">
          Monitor live orders, promos, and kitchen performance.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-ink-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-semibold">Live orders</h3>
        <div className="mt-4 grid gap-3">
          {orders.slice(0, 6).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between rounded-2xl border border-ink-100 px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  #{order.id}
                </p>
                <p className="text-xs text-ink-400">{order.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="chip">
                  {formatPrice(Number(order.total))}
                </span>
                <button className="btn btn-outline">Open</button>
              </div>
            </div>
          ))}
          {!orders.length ? (
            <p className="text-sm text-ink-400">No orders yet.</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
