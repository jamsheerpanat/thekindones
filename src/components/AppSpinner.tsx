"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CardProduct } from "@/lib/menu-helpers";
import { useCart } from "@/lib/cart-context";

const SPIN_MS = 3200;
const SESSION_KEY = "thekindones-spinner-seen-v2";
const MAX_ITEMS = 7;

export const AppSpinner = ({ items }: { items: CardProduct[] }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!items.length) {
      setVisible(false);
      return;
    }
    if (typeof window === "undefined") return;
    const seen = window.sessionStorage.getItem(SESSION_KEY);
    if (seen) {
      setVisible(false);
      return;
    }
    setVisible(true);

    const available = Math.min(items.length, MAX_ITEMS);
    const index = Math.floor(Math.random() * available);
    const step = 360 / MAX_ITEMS;
    const spins = 4;
    const target = -(index * step) - 360 * spins;
    setSelectedIndex(index);
    setSpinning(true);
    const raf = window.requestAnimationFrame(() => setRotation(target));
    const stopTimer = window.setTimeout(() => setSpinning(false), SPIN_MS);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(stopTimer);
    };
  }, [items]);

  const wheelItems = useMemo(
    () =>
      Array.from({ length: MAX_ITEMS }, (_, index) =>
        items[index] ? items[index] : null
      ),
    [items]
  );

  const selectedItem =
    selectedIndex !== null ? items[selectedIndex] : null;

  const handleOrder = () => {
    if (!selectedItem) return;
    addItem({ product: selectedItem, modifiers: [] });
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
    setVisible(false);
    router.push("/cart");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/70 backdrop-blur-sm">
      <div className="card-next w-[92%] max-w-4xl p-6 text-center md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-ink-400">
          thekindones
        </p>
        <p className="mt-4 text-sm font-semibold text-ink-700">
          Curating 7 picks for you
        </p>
        <div className="relative mx-auto mt-6 flex h-[280px] w-[280px] items-center justify-center [--radius:110px] md:h-[360px] md:w-[360px] md:[--radius:145px]">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,_rgba(230,187,31,0.35),_rgba(255,255,255,0.5),_rgba(18,16,15,0.1),_rgba(230,187,31,0.35))] opacity-80" />
          <div className="absolute inset-4 rounded-full border border-white/70 bg-white/50 backdrop-blur-sm shadow-soft" />
          <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-brand-400 shadow-crisp" />

          <div
            className="absolute inset-0"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.16,1,0.3,1)`
                : "none"
            }}
          >
            {wheelItems.map((item, index) => {
              const angle = (360 / MAX_ITEMS) * index;
              return (
                <div
                  key={item?.id ?? `placeholder-${index}`}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--radius) * -1)) rotate(${-angle}deg)`
                  }}
                >
                  <div className="relative h-16 w-16 rounded-2xl border border-white/70 bg-white/90 shadow-crisp md:h-20 md:w-20">
                    {item?.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-brand-200 text-[11px] font-semibold text-ink-900">
                        {item?.name
                          ? item.name.slice(0, 2).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-16 rounded-full border border-white/70 bg-white/80 shadow-glow flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold uppercase tracking-[0.25em] text-brand-50">
              Spin
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          {selectedItem ? (
            <div className="rounded-2xl border border-ink-100/60 bg-white/80 px-4 py-3 text-sm font-semibold text-ink-900">
              Selected: {selectedItem.name}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink-200/60 bg-white/70 px-4 py-3 text-sm text-ink-500">
              Select 7 featured items in Admin &gt; Menu to populate this spinner.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="btn btn-primary"
              onClick={handleOrder}
              disabled={!selectedItem || spinning}
            >
              {spinning ? "Spinning..." : "Choose this order"}
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.sessionStorage.setItem(SESSION_KEY, "1");
                }
                setVisible(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
