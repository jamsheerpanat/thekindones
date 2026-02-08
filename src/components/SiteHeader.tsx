"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide header on mobile for the menu page (custom mobile view there)
  const hideOnMobile = pathname.startsWith("/menu");

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-out pt-6 ${hideOnMobile ? "hidden md:flex" : "flex"
          } pointer-events-none`}
      >
        <header
          className={`pointer-events-auto relative flex items-center justify-between gap-4 px-3 py-2 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${scrolled
              ? "w-[90%] md:w-[85%] max-w-5xl rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-ink-900/5 ring-1 ring-black/5"
              : "w-[95%] max-w-7xl rounded-full bg-white/40 backdrop-blur-sm border border-white/30"
            }`}
        >
          {/* Left: Logo */}
          <div className="flex-shrink-0 pl-2">
            <Logo size="sm" />
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-5 py-2.5 text-[13px] font-semibold tracking-wide transition-all duration-300 rounded-full ${active
                      ? "text-ink-900 bg-white shadow-sm ring-1 ring-black/5"
                      : "text-ink-600 hover:text-ink-900 hover:bg-white/50"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 pr-2">
            {/* Admin Link */}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-white border border-ink-100 shadow-sm hover:scale-105 transition-transform text-ink-600"
                title="Admin Panel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <path d="M9 3v18" />
                  <path d="M14 3v18" />
                  <path d="M3 9h18" />
                  <path d="M3 14h18" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white border border-ink-100 shadow-sm text-ink-900 hover:scale-105 active:scale-95 transition-all group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:text-brand-600 transition-colors"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth */}
            <div className="flex items-center gap-2">
              {status === "authenticated" ? (
                <div className="flex items-center gap-2 pl-2 bg-white/50 rounded-full p-1 border border-white/60">
                  <Link href="/account" className="relative group">
                    <div className="h-9 w-9 rounded-full overflow-hidden border border-ink-100 shadow-sm hover:ring-2 hover:ring-brand-200 transition-all">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-ink-900 font-bold text-xs uppercase">
                          {session.user?.name?.slice(0, 2) || "U"}
                        </div>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="h-9 w-9 flex items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 transition-colors"
                    title="Sign Out"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="hidden md:flex h-10 px-6 items-center justify-center rounded-full bg-ink-900 text-white text-[13px] font-bold tracking-wide hover:bg-ink-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white border border-ink-100 shadow-sm text-ink-900 active:scale-95 transition-transform"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl md:hidden animate-in fade-in slide-in-from-bottom-5 duration-300 flex flex-col pt-32 px-8">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-2 bg-ink-50 rounded-full text-ink-500 hover:bg-ink-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
          </button>

          <nav className="flex flex-col gap-6 text-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-ink-900 hover:text-brand-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {status !== "authenticated" ? (
              <button
                onClick={() => {
                  signIn();
                  setMobileMenuOpen(false);
                }}
                className="mt-8 btn btn-primary w-full"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="mt-8 btn btn-outline w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                Log Out
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
};
