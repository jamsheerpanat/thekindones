"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
};

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const load = async () => {
      const res = await fetch("/api/orders");
      if (res.ok) {
        setOrders(await res.json());
      }
    };
    load();
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="section">
        <div className="container-padded flex justify-center">
          <div className="card-next w-full max-w-md p-6 text-center">
            <h2 className="text-2xl font-semibold text-ink-900">Sign in</h2>
            <p className="text-sm text-ink-500">
              Access your account to manage orders and rewards.
            </p>
            <button className="btn btn-primary mt-4 w-full" onClick={() => signIn()}>
              Sign in
            </button>
            <Link href="/auth/sign-up" className="btn btn-outline mt-3 w-full">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2>Account overview</h2>
          <p className="text-sm text-ink-500">
            Manage your profile, saved addresses, and payment methods.
          </p>
          <div className="mt-6 grid gap-4">
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Profile
              </p>
              <p className="text-lg font-semibold text-ink-900">
                {session?.user?.name || "Guest"}
              </p>
              <p className="text-sm text-ink-500">{session?.user?.email}</p>
            </div>
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Saved address
              </p>
              <p className="text-sm text-ink-700">
                12 Northern Blvd, Riyadh, KSA
              </p>
            </div>
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Payment method
              </p>
              <p className="text-sm text-ink-700">Visa ending 2034</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Recent orders</h3>
          <div className="mt-4 grid gap-3">
            {orders.map((order) => (
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
                <span className="chip">{formatPrice(Number(order.total))}</span>
              </div>
            ))}
            {!orders.length ? (
              <p className="text-sm text-ink-400">No orders yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
