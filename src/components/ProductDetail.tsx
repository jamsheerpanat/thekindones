"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { ModifierOption } from "@/lib/products";
import type { DetailProduct } from "@/lib/menu-helpers";
import { formatPrice } from "@/lib/utils";

export const ProductDetail = ({ product }: { product: DetailProduct }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [selections, setSelections] = useState<Record<string, ModifierOption>>(
    () =>
      Object.fromEntries(
        product.modifiers.map((group) => [group.name, group.options[0]])
      )
  );

  const selectedOptions = useMemo(
    () => Object.values(selections),
    [selections]
  );

  const total = useMemo(() => {
    const addOns = selectedOptions.reduce(
      (sum, option) => sum + (option.priceDelta || 0),
      0
    );
    return (product.price + addOns) * quantity;
  }, [product.price, quantity, selectedOptions]);

  return (
    <div className="section">
      <div className="container-padded grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card overflow-hidden">
          <div className="relative h-72 w-full bg-ink-100/30 md:h-96">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-brand-200">
                <span className="text-xl font-display">{product.name}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {product.category}
                </p>
                <h2 className="mt-2 text-3xl font-semibold">{product.name}</h2>
                <p className="text-sm text-ink-500">{product.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-ink-400">Starting</p>
                <p className="text-2xl font-semibold text-ink-900">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {product.rating ? (
                <span className="chip">{product.rating.toFixed(1)} rating</span>
              ) : null}
              <span className="chip">{product.calories} cal</span>
              {product.tags?.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-6 p-6">
          <div>
            <h3 className="text-xl font-semibold">Customize your order</h3>
            <p className="text-sm text-ink-500">
              Mix and match extras, then add notes for the kitchen.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {product.modifiers.map((group) => (
              <div key={group.name} className="rounded-2xl border border-ink-100 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink-800">
                    {group.name}
                  </h4>
                  {group.required ? (
                    <span className="text-xs font-semibold uppercase text-ink-400">
                      Required
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 grid gap-2">
                  {group.options.map((option) => {
                    const selected = selections[group.name]?.label === option.label;
                    return (
                      <button
                        key={option.label}
                        className={
                          selected
                            ? "flex items-center justify-between rounded-xl border border-ink-900 bg-ink-900 px-4 py-2 text-sm text-brand-50"
                            : "flex items-center justify-between rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-700"
                        }
                        onClick={() =>
                          setSelections((current) => ({
                            ...current,
                            [group.name]: option
                          }))
                        }
                        type="button"
                      >
                        <span>{option.label}</span>
                        {option.priceDelta ? (
                          <span className="text-xs font-semibold">
                            +{formatPrice(option.priceDelta)}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="label">Kitchen note</label>
            <textarea
              className="input mt-2 min-h-[96px]"
              placeholder="No onions, extra sauce, etc."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                type="button"
              >
                -
              </button>
              <span className="text-lg font-semibold text-ink-900">
                {quantity}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => setQuantity((prev) => prev + 1)}
                type="button"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink-400">Total</p>
              <p className="text-2xl font-semibold text-ink-900">
                {formatPrice(total)}
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              addItem({
                product,
                modifiers: selectedOptions,
                note: notes,
                quantity
              })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
