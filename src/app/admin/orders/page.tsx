"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED"
];

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  user?: { name?: string | null; email?: string | null } | null;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const load = async () => {
    const res = await fetch("/tko/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await load();
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>Orders</h2>
          <p className="text-sm text-ink-500">
            Track every order and manage fulfillment status.
          </p>
        </div>
        <button className="btn btn-outline" onClick={load}>
          Refresh
        </button>
      </div>
      <div className="mt-6 grid gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col gap-3 rounded-2xl border border-ink-100 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-ink-900">
                #{order.id} - {order.user?.name || order.user?.email || "Guest"}
              </p>
              <p className="text-xs text-ink-400">{order.status}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip">{formatPrice(Number(order.total))}</span>
              <select
                className="input"
                value={order.status}
                onChange={(event) => updateStatus(order.id, event.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {!orders.length ? (
          <p className="text-sm text-ink-400">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
