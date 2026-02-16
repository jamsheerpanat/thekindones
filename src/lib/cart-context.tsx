"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ModifierOption } from "@/lib/products";
import type { CardProduct } from "@/lib/menu-helpers";

export type CartItem = {
  id: string;
  product: CardProduct;
  quantity: number;
  modifiers: ModifierOption[];
  note?: string;
};

type CartSummary = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  summary: CartSummary;
  notification: string | null;
  showNotification: (message: string) => void;
  governorates: any[];
  selectedGovernorate: string | null;
  setGovernorate: (id: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "thekindones-cart";

const calculateItemTotal = (item: CartItem) => {
  const modifierTotal = item.modifiers.reduce((sum, option) => sum + (option.priceDelta || 0), 0);
  return (item.product.price + modifierTotal) * item.quantity;
};

const calculateSummary = (items: CartItem[], deliveryFee: number): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [governorates, setGovernorates] = useState<any[]>([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetch("/api/governorates")
      .then(res => res.json())
      .then(data => setGovernorates(data))
      .catch(err => console.error("Failed to load governorates", err));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        setItems(parsed);
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((current) => {
      const modifiersKey = item.modifiers.map((option) => option.label).join(",");
      const existing = current.find(
        (entry) =>
          entry.product.id === item.product.id &&
          entry.modifiers.map((option) => option.label).join(",") === modifiersKey
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id
            ? { ...entry, quantity: entry.quantity + (item.quantity || 1) }
            : entry
        );
      }

      return [
        ...current,
        {
          id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          product: item.product,
          quantity: item.quantity || 1,
          modifiers: item.modifiers,
          note: item.note
        }
      ];
    });

    showNotification(`${item.quantity || 1}x ${item.product.name} added to cart`);
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };
  const clear = () => setItems([]);

  const summary = useMemo(() => {
    const gov = governorates.find(g => g.id === selectedGovernorate);
    const fee = gov ? Number(gov.deliveryFee) : 0;
    return calculateSummary(items, fee);
  }, [items, selectedGovernorate, governorates]);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      summary,
      notification,
      showNotification,
      governorates,
      selectedGovernorate,
      setGovernorate: setSelectedGovernorate
    }),
    [items, summary, notification, governorates, selectedGovernorate]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-ink-900 text-white px-6 py-3 rounded-full shadow-2xl shadow-ink-900/40 flex items-center gap-3 border border-white/10">
            <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-ink-900"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-sm font-bold tracking-wide">{notification}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
