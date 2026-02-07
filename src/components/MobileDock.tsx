"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

const ITEMS = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Cart", href: "/cart" },
  { label: "Account", href: "/account" }
];

export const MobileDock = () => {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (pathname.startsWith("/admin") || pathname.startsWith("/menu")) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="glass rounded-3xl border border-white/70 px-3 py-3">
          <nav className="grid grid-cols-4 items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
            {ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.match ?? item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "flex flex-col items-center gap-1 rounded-2xl bg-ink-900 px-2 py-2 text-brand-50"
                      : "flex flex-col items-center gap-1 rounded-2xl px-2 py-2"
                  }
                >
                  <span>{item.label}</span>
                  {item.label === "Cart" && cartCount > 0 ? (
                    <span className="rounded-full bg-brand-200 px-2 py-0.5 text-[10px] font-semibold text-ink-900">
                      {cartCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};
