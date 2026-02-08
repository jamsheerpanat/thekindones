"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cart-context";

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider basePath="/tko/api/auth">
    <CartProvider>{children}</CartProvider>
  </SessionProvider>
);
