"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import type { CardProduct } from "@/lib/menu-helpers";

export const MenuExplorer = ({
  items,
  categories
}: {
  items: CardProduct[];
  categories: string[];
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();

  const allCategories = ["All", ...categories];

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const match = allCategories.find(
        (category) => category.toLowerCase() === categoryParam.toLowerCase()
      );
      if (match) {
        setActiveCategory(match);
      }
    }
  }, [searchParams, allCategories]);

  const filtered = useMemo(() => {
    return items.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesQuery =
        query.length === 0 ||
        product.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="card flex flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Browse the menu</h3>
            <p className="text-sm text-ink-500">
              Tap a category or search for a dish.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <input
              className="input"
              placeholder="Search menu"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              className="btn btn-outline"
              onClick={() => setQuery("")}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                className={
                  active
                    ? "chip border-ink-900/10 bg-ink-900 text-brand-50"
                    : "chip"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
