"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CardProduct } from "@/lib/menu-helpers";
import { useCart } from "@/lib/cart-context";

const SPIN_MS = 3800;
const SESSION_KEY = "thekindones-spinner-seen-v3"; // Version bump to force show
const MAX_ITEMS = 8; // Increased slightly for better look

export const AppSpinner = ({ items }: { items: CardProduct[] }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Initialize visibility logic
  useEffect(() => {
    if (!items.length) return;

    // Check session storage to avoid annoyance
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [items]);

  const wheelItems = useMemo(() => {
    // Fill up to MAX_ITEMS, repeating if necessary
    const filled: (CardProduct | null)[] = [];
    for (let i = 0; i < MAX_ITEMS; i++) {
      filled.push(items[i % items.length] || null);
    }
    return filled;
  }, [items]);

  const handleSpin = () => {
    if (spinning || showResult) return;

    const available = items.length;
    if (available === 0) return;

    setSpinning(true);

    // Pick a random winner based on the filled array
    // The pointer is at the TOP (0 degrees usually, but let's calibrate)
    // If we rotate the container, the top item changes.
    // Each segment is 360 / MAX_ITEMS.
    const segmentAngle = 360 / MAX_ITEMS;

    // Random index in the wheelItems array
    const winningIndex = Math.floor(Math.random() * MAX_ITEMS);
    setSelectedIndex(winningIndex);

    // Calculate rotation to land this item at the top.
    // To land index i at top, we need to rotate so that index i is at -90deg or 270deg?
    // Let's assume item 0 is at top initially.
    // To bring item i to top, we rotate by - (i * segmentAngle).
    // Add extra spins for effect.
    const extraSpins = 5;
    const baseTarget = -(winningIndex * segmentAngle);
    // Add some random offset within the segment to make it look natural
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.6);

    const targetRotation = baseTarget - (360 * extraSpins) + randomOffset;

    setRotation(targetRotation);

    // Wait for animation to finish
    setTimeout(() => {
      setSpinning(false);
      setShowResult(true);
    }, SPIN_MS);
  };

  const handleClaim = () => {
    if (selectedIndex === null) return;
    const product = wheelItems[selectedIndex];
    if (product) {
      addItem({ product, modifiers: [] });
      closeSpinner();
      router.push("/cart");
    }
  };

  const closeSpinner = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  if (!visible) return null;

  const winner = selectedIndex !== null ? wheelItems[selectedIndex] : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-white/40 overflow-hidden ring-1 ring-black/5 flex flex-col items-center">

        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeSpinner}
          className="absolute top-4 right-4 p-2 text-ink-400 hover:text-ink-900 hover:bg-ink-100/50 rounded-full transition-colors z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
        </button>

        {/* Content Header */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl font-display font-bold text-ink-900 leading-tight">
            Feeling Lucky?
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            Spin the wheel to get a curated recommendation!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 z-10 filter drop-shadow-xl">
          {/* The Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-white bg-white shadow-inner overflow-hidden relative transition-transform cubic-bezier(0.2, 0.8, 0.2, 1)"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? `${SPIN_MS}ms` : '0ms'
            }}
          >
            {/* Segments Background (Conic) */}
            <div className="absolute inset-0 rounded-full opacity-30"
              style={{ background: `conic-gradient(from 0deg, #f1c652, #e4e6e5, #f1c652, #e4e6e5, #f1c652, #e4e6e5, #f1c652, #e4e6e5)` }}
            />

            {/* Separator Lines & Items */}
            {wheelItems.map((item, index) => {
              const angle = (360 / MAX_ITEMS) * index;
              return (
                <div
                  key={index}
                  className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-white/40 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                >
                  {/* Item Icon */}
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-0"
                    style={{ transform: `translateX(-50%) rotate(${-angle}deg)` }} // Counter-rotate content? No, we want it aligned with segment
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm p-1 flex items-center justify-center transform -rotate-0">
                      {item?.image ? (
                        <Image src={item.image} alt="item" width={40} height={40} className="rounded-full object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs font-bold text-ink-400">?</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg border-4 border-brand-100 flex items-center justify-center z-20">
              <div className="w-10 h-10 bg-brand-500 rounded-full shadow-inner flex items-center justify-center">
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Spin</span>
              </div>
            </div>
          </div>

          {/* Pointer (Static at top) */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-ink-900">
              <path d="M12 22L7 12H17L12 22Z" transform="rotate(180 12 12)" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full relative z-10 flex flex-col items-center gap-3 min-h-[80px]">
          {!showResult ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="w-full btn btn-primary py-3.5 text-lg font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-all text-white"
            >
              {spinning ? "Spinning..." : "Press to Spin!"}
            </button>
          ) : (
            <div className="w-full animate-fade-up text-center space-y-4">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 flex items-center gap-3 text-left">
                <div className="w-12 h-12 bg-white rounded-lg flex-shrink-0 relative overflow-hidden shadow-sm">
                  {winner?.image && <Image src={winner.image} alt="winner" fill className="object-cover" />}
                </div>
                <div>
                  <p className="text-xs text-brand-600 font-bold uppercase tracking-wider">You won!</p>
                  <p className="text-sm font-bold text-ink-900 line-clamp-1">{winner?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleClaim} className="btn btn-primary w-full py-3 text-sm">
                  Order Now
                </button>
                <button onClick={closeSpinner} className="btn btn-outline w-full py-3 text-sm">
                  Maybe Later
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {!showResult && !spinning && (
          <p className="mt-6 text-xs text-ink-400 text-center relative z-10">
            Daily pick refresh at midnight.
          </p>
        )}

      </div>
    </div>
  );
};
