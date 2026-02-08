"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CardProduct } from "@/lib/menu-helpers";
import { formatPrice } from "@/lib/utils";

const Icon = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm">
    {children}
  </span>
);

const Star = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2l2.9 6.1 6.7.9-4.9 4.7 1.2 6.6L12 17l-5.9 3.3 1.2-6.6-4.9-4.7 6.7-.9L12 2z" />
  </svg>
);

const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.8 6.6a5.5 5.5 0 0 0-7.8 0L12 7.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 22l7.8-6.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M12 16V4" />
    <path d="M8 8l4-4 4 4" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const MobileMenu = ({
  items,
  categories
}: {
  items: CardProduct[];
  categories: string[];
}) => {
  const router = useRouter();
  const heroImage = items.find((item) => item.image)?.image;
  const [activeCategory, setActiveCategory] = useState("Picks for you");
  const allCategories = ["Picks for you", ...categories];

  const picks = items.slice(0, 4);

  const filtered = useMemo(() => {
    if (activeCategory === "Picks for you") {
      return items;
    }
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  return (
    <div className="md:hidden bg-ink-50 min-h-screen pb-24">
      <div className="relative">
        {/* Top Hero Section */}
        <div className="relative h-64 w-full overflow-hidden rounded-b-[2rem] bg-ink-100 shadow-lg">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="thekindones hero"
              fill
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-transparent to-black/20" />

          <div
            className="absolute left-4 right-4 top-4 flex items-center justify-between z-10"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <button
              onClick={() => router.back()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg active:scale-95 transition-transform"
            >
              <BackIcon />
            </button>
            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg active:scale-95 transition-transform">
                <HeartIcon />
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg active:scale-95 transition-transform">
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Card */}
        <div className="-mt-14 px-4 relative z-20">
          <div className="card p-5 shadow-xl border-white/50 bg-white/95 backdrop-blur-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
                  <Image
                    src="/brand/logo.png"
                    alt="thekindones"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink-900 leading-none">
                    The Kind Ones
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-ink-500">
                    <span className="flex items-center gap-1 text-brand-600">
                      <Star />
                      4.9
                    </span>
                    <span>•</span>
                    <span>Breakfast & Sandwiches</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-ink-50 flex items-center justify-between text-xs font-bold text-ink-400 uppercase tracking-widest">
              <div className="flex flex-col gap-1">
                <span className="text-ink-900">25-35</span>
                <span>Mins</span>
              </div>
              <div className="h-8 w-[1px] bg-ink-100" />
              <div className="flex flex-col gap-1 items-center">
                <span className="text-ink-900 underline decoration-brand-500 decoration-2">KWD 1.0</span>
                <span>Delivery</span>
              </div>
              <div className="h-8 w-[1px] bg-ink-100" />
              <div className="flex flex-col gap-1 items-end">
                <span className="text-brand-600">PRO FREE</span>
                <span>Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promos */}
      <div className="px-4 mt-6">
        <div className="rounded-[1.5rem] bg-brand-500/10 border border-brand-500/20 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-soft">
              %
            </div>
            <p className="text-sm font-bold text-ink-900">20% off with Mastercard</p>
          </div>
          <button className="text-xs font-bold text-brand-700 underline">Apply</button>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="mt-8 sticky top-0 z-30 bg-ink-50 shadow-sm border-b border-ink-100">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
          {allCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${active
                    ? "bg-ink-900 text-white shadow-lg"
                    : "bg-white text-ink-500 border border-ink-100 shadow-sm"
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Picks Section */}
      {activeCategory === "Picks for you" && (
        <div className="px-4 py-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-ink-900">Popular items</h2>
              <p className="text-xs text-ink-400 font-medium uppercase tracking-wider mt-1">Trending right now</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {picks.map((item) => (
              <Link
                key={item.id}
                href={`/menu/${item.slug}`}
                className="card relative overflow-hidden border border-ink-50 p-3 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-xl bg-ink-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-500 text-white text-[9px] font-black uppercase rounded-full shadow-sm">
                    Best Seller
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-bold text-ink-900 line-clamp-1 leading-tight">
                    {item.name}
                  </p>
                  <p className="text-sm font-black text-brand-600 mt-1">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-black/5">
                  <span className="text-lg font-bold text-ink-900">+</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Full Menu List */}
      <div className="px-4 pb-20">
        <h2 className="text-xl font-bold text-ink-900 mb-6">{activeCategory}</h2>
        <div className="space-y-6">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/menu/${item.slug}`}
              className="flex items-start justify-between gap-4 border-b border-ink-100/40 pb-6 active:bg-ink-100/30 transition-colors rounded-lg px-1"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                  <h3 className="text-base font-bold text-ink-900">
                    {item.name}
                  </h3>
                </div>
                <p className="mt-1.5 text-xs font-medium text-ink-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                <p className="mt-3 text-sm font-black text-ink-900">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-soft border border-ink-100">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5">
                    <ArrowRight />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Customizable</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
