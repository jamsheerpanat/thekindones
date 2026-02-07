"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";

// Removed Admin from public navigation
const NAV_ITEMS = [
  { label: "Menu", href: "/menu" },
  { label: "Gift Cards", href: "/gift-cards" },
  { label: "Subscriptions", href: "/subscriptions" },
];

export const SiteHeader = () => {
  const pathname = usePathname();
  const { items } = useCart();
  const { status, data: session } = useSession();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideOnMobile = pathname.startsWith("/menu");

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pt-4 ${hideOnMobile ? "hidden md:flex" : "flex"
        }`}
    >
      <header
        className={`relative flex items-center justify-between gap-4 px-6 py-3 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] border ${scrolled
            ? "w-[94%] max-w-5xl rounded-[2.5rem] bg-white/60 backdrop-blur-3xl border-white/40 shadow-soft"
            : "w-[98%] max-w-7xl rounded-none bg-transparent border-transparent"
          }`}
      >
        {/* Left: Logo with modern placement */}
        <div className="flex-shrink-0">
          <Logo size={scrolled ? "sm" : "md"} />
        </div>

        {/* Center: Minimalist Dock-style Nav */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-ink-900/5 rounded-full backdrop-blur-sm border border-white/20">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-6 py-2 text-[13px] font-bold tracking-tight transition-all duration-300 rounded-full ${active
                    ? "text-white bg-ink-900 shadow-crisp"
                    : "text-ink-500 hover:text-ink-900 hover:bg-white/50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions Island */}
        <div className="flex items-center gap-2">
          {/* Discrete Admin Link for Admins Only */}
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="group flex items-center justify-center h-10 w-10 rounded-full bg-brand-50 hover:bg-brand-100 border border-brand-200/50 transition-all duration-300"
              title="Admin Panel"
            >
              <svg className="w-5 h-5 text-brand-600 group-hover:rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          )}

          {/* Account Dock */}
          <div className="flex items-center bg-white/40 p-1 rounded-full border border-white/50 backdrop-blur-md shadow-sm">
            {status === "authenticated" ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/account"
                  className="flex items-center gap-2 group"
                >
                  <div className="h-8 w-8 rounded-full bg-ink-900 border-2 border-white shadow-soft overflow-hidden group-hover:scale-105 transition-transform">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white text-[10px] font-black uppercase">
                        {session.user?.name?.slice(0, 2) || "U"}
                      </div>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="h-8 px-3 text-[11px] font-black tracking-tight text-ink-700 uppercase hover:bg-white rounded-full transition-all"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="h-8 px-4 text-[12px] font-black tracking-tight text-ink-900 uppercase hover:bg-white rounded-full transition-all"
              >
                Join Us
              </button>
            )}

            <Link
              href="/cart"
              className="ml-1 relative flex items-center justify-center h-8 px-3 rounded-full bg-ink-900 text-white hover:scale-[1.05] active:scale-95 transition-all shadow-crisp"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-brand-400 rounded-full text-[9px] font-black text-ink-900 border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Search/Menu Toggle (Always visible on mobile) */}
          <button className="md:hidden h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-ink-50">
            <svg className="w-5 h-5 text-ink-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>
    </div>
  );
};
