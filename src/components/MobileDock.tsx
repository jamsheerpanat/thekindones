"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type DockItem = {
  label: string;
  href: string;
  match?: string;
};

const ITEMS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Home",
    href: "/",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  },
  {
    label: "Menu",
    href: "/menu",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
  },
  {
    label: "Cart",
    href: "/cart",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
  },
  {
    label: "Account",
    href: "/account",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  }
];

export const MobileDock = () => {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hide on auth pages or detail pages where we want focus
  if (pathname.startsWith("/admin") || pathname.startsWith("/menu/") || pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[50] md:hidden w-[85%] max-w-[320px]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-[1.75rem] border border-white shadow-2xl shadow-ink-900/10 px-1.5 py-1.5 flex items-center justify-between ring-1 ring-black/5">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 h-14 flex-1 rounded-2xl transition-all duration-300 ${active
                ? "bg-ink-900 text-brand-50 shadow-lg"
                : "text-ink-400 hover:text-ink-600 active:scale-90"
                }`}
            >
              <div className="relative">
                <div className={active ? "scale-90" : "scale-100"}>
                  {item.icon}
                </div>
                {item.label === "Cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 bg-brand-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
              {active && (
                <div className="absolute bottom-1 w-1 h-1 bg-brand-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
