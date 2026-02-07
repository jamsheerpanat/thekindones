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
  serviceFee: number;
  tax: number;
  total: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  summary: CartSummary;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "thekindones-cart";

const calculateItemTotal = (item: CartItem) => {
  const modifierTotal = item.modifiers.reduce((sum, option) => sum + (option.priceDelta || 0), 0);
  return (item.product.price + modifierTotal) * item.quantity;
};

const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const deliveryFee = subtotal > 0 ? 3.5 : 0;
  const serviceFee = subtotal > 0 ? Math.min(6, subtotal * 0.08) : 0;
  const tax = subtotal > 0 ? subtotal * 0.085 : 0;
  return {
    subtotal,
    deliveryFee,
    serviceFee,
    tax,
    total: subtotal + deliveryFee + serviceFee + tax
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const summary = useMemo(() => calculateSummary(items), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clear, summary }),
    [items, summary]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
