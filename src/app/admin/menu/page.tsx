"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type MenuItemRow = {
  id: string;
  name: string;
  category: { name: string } | string;
  image?: string | null;
  price: number | string;
  active: boolean;
  featured: boolean;
};

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItemRow[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/menu");
    if (res.ok) {
      setItems(await res.json());
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.category || !form.price) return;
    setLoading(true);
    setError("");
    await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        image: form.image
      })
    });
    setLoading(false);
    setForm({ name: "", category: "", price: "", description: "", image: "" });
    await load();
  };

  const toggleActive = async (item: MenuItemRow) => {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active })
    });
    await load();
  };

  const toggleFeatured = async (item: MenuItemRow) => {
    setError("");
    const res = await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Unable to update featured items.");
    }
    await load();
  };

  const featuredCount = items.filter((item) => item.featured).length;
  const canFeatureMore = featuredCount < 7;

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2>Menu management</h2>
          <p className="text-sm text-ink-500">
            Update pricing, availability, and featured items.
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
            Featured picks: {featuredCount}/7
          </p>
          {error ? (
            <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
          ) : null}
        </div>
        <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
          {loading ? "Saving..." : "Add new item"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Item name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
        <input
          className="input"
          placeholder="Category"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        />
        <input
          className="input"
          placeholder="Price (KWD)"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
        />
        <input
          className="input"
          placeholder="Image URL"
          value={form.image}
          onChange={(event) => setForm({ ...form, image: event.target.value })}
        />
        <textarea
          className="input md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </div>

      <div className="mt-6 grid gap-4">
        {items.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-2xl border border-ink-100 p-4 md:flex-row md:items-center"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-ink-100/40">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">
                {product.name}
              </p>
              <p className="text-xs text-ink-400">
                {typeof product.category === "string"
                  ? product.category
                  : product.category?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip">
                {formatPrice(Number(product.price))}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => toggleFeatured(product)}
                disabled={!product.featured && !canFeatureMore}
              >
                {product.featured ? "Unfeature" : "Feature"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => toggleActive(product)}
              >
                {product.active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
        {!items.length ? (
          <p className="text-sm text-ink-400">No menu items yet.</p>
        ) : null}
      </div>
    </div>
  );
}
