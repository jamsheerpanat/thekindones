"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <CartProvider>{children}</CartProvider>
  </SessionProvider>
);
