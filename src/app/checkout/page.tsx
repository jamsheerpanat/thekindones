"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, summary } = useCart();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const { data: session, status } = useSession();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (!session) {
      signIn();
      return;
    }
    setPlacing(true);
    setError("");
    const payload = {
      items: items.map((item) => ({
        menuItemId: item.product.id,
        quantity: item.quantity,
        modifiers: item.modifiers
      }))
    };
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setPlacing(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Unable to place order.");
      return;
    }
    const data = await res.json();
    window.location.href = `/orders/${data.id}`;
  };

  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <h2>Checkout</h2>
          <p className="text-sm text-ink-500">
            Confirm delivery details, select a time window, and pay securely.
          </p>

          <div className="mt-6 flex flex-col gap-6">
            <div>
              <p className="label">Order type</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {(["delivery", "pickup"] as const).map((option) => (
                  <button
                    key={option}
                    className={
                      method === option
                        ? "btn btn-primary"
                        : "btn btn-outline"
                    }
                    onClick={() => setMethod(option)}
                    type="button"
                  >
                    {option === "delivery" ? "Delivery" : "Pickup"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Date</label>
                <input className="input mt-2" type="date" />
              </div>
              <div>
                <label className="label">Time window</label>
                <select className="input mt-2">
                  <option>ASAP (20-30 min)</option>
                  <option>12:00 - 12:30</option>
                  <option>12:30 - 1:00</option>
                  <option>1:00 - 1:30</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">Full name</label>
                <input className="input mt-2" placeholder="Your name" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input mt-2" placeholder="+966" />
              </div>
            </div>

            {method === "delivery" ? (
              <div>
                <label className="label">Delivery address</label>
                <input
                  className="input mt-2"
                  placeholder="Street, building, city"
                />
                <input
                  className="input mt-3"
                  placeholder="Apartment, floor, door code"
                />
              </div>
            ) : (
              <div className="card border border-dashed border-ink-200 bg-ink-50/60 p-4">
                <p className="text-sm text-ink-600">
                  Pickup at thekindones Tahlia branch. Park in spot 3 and we will
                  bring your order out.
                </p>
              </div>
            )}

            <div>
              <label className="label">Payment</label>
              <div className="mt-2 grid gap-4">
                <input className="input" placeholder="Card number" />
                <div className="grid gap-4 md:grid-cols-3">
                  <input className="input" placeholder="MM / YY" />
                  <input className="input" placeholder="CVC" />
                  <input className="input" placeholder="ZIP" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {status === "unauthenticated" ? (
            <div className="card p-6">
              <h3 className="text-xl font-semibold">Sign in to continue</h3>
              <p className="text-sm text-ink-500">
                Create an account or sign in to place your order.
              </p>
              <button className="btn btn-primary mt-4 w-full" onClick={() => signIn()}>
                Sign in
              </button>
              <Link href="/auth/sign-up" className="btn btn-outline mt-3 w-full">
                Create account
              </Link>
            </div>
          ) : null}
          <div className="card p-6">
            <h3 className="text-xl font-semibold">Order summary</h3>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-ink-600">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span>
                    {formatPrice(
                      (item.product.price +
                        item.modifiers.reduce(
                          (sum, option) => sum + (option.priceDelta || 0),
                          0
                        )) *
                        item.quantity
                    )}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Fees</span>
                <span>{formatPrice(summary.deliveryFee + summary.serviceFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-500">Tax</span>
                <span>{formatPrice(summary.tax)}</span>
              </div>
            <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="btn btn-primary mt-6 w-full" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order..." : "Place order"}
          </button>
            <Link href="/cart" className="btn btn-ghost mt-3 w-full">
              Edit cart
            </Link>
          </div>

          <div className="card p-6">
            <h4 className="text-lg font-semibold">Need help?</h4>
            <p className="text-sm text-ink-500">
              Live support is available 8am-11pm on WhatsApp and phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
