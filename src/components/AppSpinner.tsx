"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CardProduct } from "@/lib/menu-helpers";
import { useCart } from "@/lib/cart-context";

const SPIN_MS = 3800;
const SESSION_KEY = "thekindones-spinner-claimed-v1";
const MAX_ITEMS = 8;

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

    // Check sessionStorage to avoid reappearing once dismissed or claimed in the same session
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

    const segmentAngle = 360 / MAX_ITEMS;
    const winningIndex = Math.floor(Math.random() * MAX_ITEMS);
    setSelectedIndex(winningIndex);

    const extraSpins = 5;
    const baseTarget = -(winningIndex * segmentAngle + segmentAngle / 2);
    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.4);
    const targetRotation = baseTarget - (360 * extraSpins) + randomOffset;

    setRotation(targetRotation);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md flex flex-col items-center justify-center min-h-[500px]">

        {/* Close Button - Floating */}
        <button
          onClick={closeSpinner}
          className="absolute -top-12 right-0 md:-right-12 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>

        {/* Header - Minimal & Clean */}
        <div className={`text-center mb-8 transition-opacity duration-500 ${spinning ? 'opacity-50' : 'opacity-100'}`}>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight drop-shadow-lg">
            Spin & Win <span className="text-brand-400">!</span>
          </h2>
          <p className="text-white/80 mt-2 font-medium text-sm tracking-wide uppercase opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Try your luck for a free treat
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] mb-10 filter drop-shadow-2xl">

          {/* Pointer/Marker - Modern Triangle */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 drop-shadow-lg">
            <div className="w-8 h-8 bg-brand-500 rotate-45 transform origin-center border-4 border-white rounded-sm shadow-xl" />
          </div>

          {/* The Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-white/20 bg-white/5 backdrop-blur-sm shadow-2xl relative transition-transform cubic-bezier(0.15, 0.85, 0.35, 1.05)"
            style={{
              transform: `rotate(${rotation}deg)`,
              transitionDuration: spinning ? `${SPIN_MS}ms` : '0ms'
            }}
          >
            {/* Wheel Segments */}
            <div className="absolute inset-0 rounded-full overflow-hidden border-[6px] border-white">
              <div className="absolute inset-0 rounded-full opacity-100"
                style={{
                  background: `conic-gradient(
                        #ffffff 0% ${100 / MAX_ITEMS}%, 
                        #f3f4f6 ${100 / MAX_ITEMS}% ${200 / MAX_ITEMS}%,
                        #ffffff ${200 / MAX_ITEMS}% ${300 / MAX_ITEMS}%,
                        #f3f4f6 ${300 / MAX_ITEMS}% ${400 / MAX_ITEMS}%,
                        #ffffff ${400 / MAX_ITEMS}% ${500 / MAX_ITEMS}%,
                        #f3f4f6 ${500 / MAX_ITEMS}% ${600 / MAX_ITEMS}%,
                        #ffffff ${600 / MAX_ITEMS}% ${700 / MAX_ITEMS}%,
                        #f3f4f6 ${700 / MAX_ITEMS}% ${800 / MAX_ITEMS}%
                    )`
                }}
              />
            </div>

            {/* Separators & Icons */}
            {wheelItems.map((item, index) => {
              const segmentAngle = 360 / MAX_ITEMS;
              const lineAngle = segmentAngle * index;
              const itemAngle = lineAngle + (segmentAngle / 2);
              return (
                <div key={index}>
                  <div
                    className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-ink-200/50 origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${lineAngle}deg)` }}
                  />
                  <div
                    className="absolute top-0 left-1/2 w-12 h-1/2 origin-bottom flex justify-center pt-5"
                    style={{ transform: `translateX(-50%) rotate(${itemAngle}deg)` }}
                  >
                    <div
                      className="w-14 h-14 rounded-full bg-white shadow-sm p-1.5 flex items-center justify-center transform transition-transform"
                      style={{ transform: `rotate(${-itemAngle}deg)` }}
                    >
                      {item?.image ? (
                        <Image src={item.image} alt="item" width={56} height={56} className="rounded-full object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs font-bold text-ink-300">?</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl border-4 border-brand-100 flex items-center justify-center z-20">
              <div className="w-10 h-10 bg-brand-500 rounded-full shadow-inner flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Result */}
        <div className="w-full relative z-20 flex flex-col items-center min-h-[100px]">
          {!showResult ? (
            <button
              onClick={handleSpin}
              disabled={spinning}
              className={`
                group relative px-10 py-4 bg-brand-500 rounded-full text-white font-black uppercase tracking-widest text-lg shadow-[0_0_20px_rgba(247,178,82,0.4)]
                hover:shadow-[0_0_30px_rgba(247,178,82,0.6)] hover:scale-105 active:scale-95 transition-all duration-300
                ${spinning ? 'opacity-50 cursor-not-allowed grayscale' : ''}
              `}
            >
              <span className="relative z-10">{spinning ? "Good Luck..." : "Spin Now"}</span>
            </button>
          ) : (
            <div className="animate-fade-up w-full max-w-[320px] md:max-w-sm mx-auto pb-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">

                {/* Confetti/Glow Effect Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/20 blur-[80px] rounded-full pointer-events-none" />

                <p className="text-sm font-black text-brand-300 uppercase tracking-[0.2em] mb-4 relative z-10">You Won!</p>

                <div className="w-48 h-48 md:w-56 md:h-56 bg-white rounded-2xl relative overflow-hidden shadow-2xl mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 group border-4 border-white/10">
                  {winner?.image && <Image src={winner.image} alt="winner" fill className="object-cover transform group-hover:scale-110 transition-transform duration-700" />}
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6 drop-shadow-md relative z-10">{winner?.name}</h3>

                <div className="flex flex-col gap-3 w-full relative z-10">
                  <button
                    onClick={handleClaim}
                    className="w-full bg-brand-500 hover:bg-brand-400 text-white text-base font-black py-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-[0.98] transition-all tracking-wide uppercase"
                  >
                    Claim Prize
                  </button>
                  <button
                    onClick={closeSpinner}
                    className="w-full py-3 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    No Thanks
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
