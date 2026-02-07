"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, summary, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="section">
        <div className="container-padded flex flex-col items-center gap-4 text-center">
          <h2>Your cart is empty</h2>
          <p>Build a meal from the menu to get started.</p>
          <Link href="/menu" className="btn btn-primary">
            Explore the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2>Your cart</h2>
            <Link href="/menu" className="btn btn-ghost">
              Continue shopping
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="card flex flex-col gap-4 p-5 md:flex-row">
                <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-ink-100/40 md:h-24 md:w-24">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-ink-500">
                        {item.modifiers.map((option) => option.label).join(", ")}
                      </p>
                    </div>
                    <button
                      className="btn btn-ghost"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        className="btn btn-outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="text-sm font-semibold text-ink-900">
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink-900">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card h-fit p-6">
          <h3 className="text-xl font-semibold">Order summary</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Subtotal</span>
              <span>{formatPrice(summary.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Delivery fee</span>
              <span>{formatPrice(summary.deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ink-500">Service fee</span>
              <span>{formatPrice(summary.serviceFee)}</span>
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
          <Link href="/checkout" className="btn btn-primary mt-6 w-full">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
