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
    <div className="md:hidden">
      <div className="relative">
        <div className="relative h-56 w-full overflow-hidden rounded-b-3xl bg-ink-100">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="thekindones hero"
              fill
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-900/10 via-transparent to-white/40" />
          <div
            className="absolute left-4 right-4 top-4 flex items-center justify-between"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            <Icon>
              <BackIcon />
            </Icon>
            <div className="flex items-center gap-3">
              <Icon>
                <HeartIcon />
              </Icon>
              <Icon>
                <ShareIcon />
              </Icon>
              <Icon>
                <SearchIcon />
              </Icon>
            </div>
          </div>
        </div>

        <div className="-mt-12 px-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-ink-100 bg-white">
                  <Image
                    src="/brand/logo.png"
                    alt="thekindones"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">
                    The Kind Ones
                  </h3>
                  <p className="text-sm text-ink-500">
                    Breakfast, Sandwiches, Burgers
                  </p>
                </div>
              </div>
              <span className="text-2xl text-ink-400">&gt;</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-ink-600">
              <span className="flex items-center gap-1 rounded-full bg-ink-50 px-3 py-1">
                <span className="text-brand-500">
                  <Star />
                </span>
                4.6 (100+)
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span>45 mins</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>KWD 1.000</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Delivered by restaurant</span>
            </div>

            <div className="mt-4 rounded-2xl bg-[#efe6ff] px-4 py-3 text-sm font-semibold text-[#6f4bc3]">
              Get free delivery with pro
              <span className="float-right text-ink-600 underline">Join</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5">
        <div className="rounded-3xl bg-[#f5ead9] px-5 py-4 text-sm font-semibold text-ink-800">
          20% off with Mastercard
          <span className="float-right text-ink-600 underline">Apply code</span>
        </div>
      </div>

      <div className="mt-5 border-b border-ink-100/60">
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-2 text-sm font-semibold text-ink-500">
          {allCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                className={
                  active
                    ? "border-b-2 border-ink-900 pb-3 text-ink-900"
                    : "pb-3"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-6">
        <h2 className="text-xl font-semibold text-ink-900">Picks for you</h2>
        <p className="mt-1 text-sm text-ink-500">
          Trending items we think you will love
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {picks.map((item, index) => (
            <div
              key={item.id}
              className="card relative overflow-hidden border border-ink-100 p-4"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-ink-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-ink-700">
                  Top rated
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-ink-900">
                {item.name}
              </p>
              <p className="text-sm text-ink-600">
                {formatPrice(item.price)}
              </p>
              <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
                {index % 2 === 0 ? "+" : <ArrowRight />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-10">
        {filtered.slice(0, 8).map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-4 border-b border-ink-100/60 py-6"
          >
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-2 py-1 text-xs font-semibold text-ink-700">
                Top rated
              </span>
              <h3 className="mt-3 text-base font-semibold text-ink-900">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-ink-500">
                {item.description}
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-900">
                {formatPrice(item.price)}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-ink-100">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
                <button className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                  <ArrowRight />
                </button>
              </div>
              <p className="text-xs text-ink-400">Customizable</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
