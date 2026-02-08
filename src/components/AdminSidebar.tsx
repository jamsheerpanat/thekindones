"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Menu", href: "/admin/menu" },
  { label: "Hero Banner", href: "/admin/hero" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Promos", href: "/admin/promos" },
  { label: "Users", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Settings", href: "/admin/settings" }
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="card h-fit w-full max-w-xs p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
        Admin
      </p>
      <h3 className="mt-2 text-lg font-semibold text-ink-900">Operations</h3>
      <nav className="mt-6 flex flex-col gap-2">
        {ADMIN_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "rounded-2xl bg-ink-900 px-4 py-3 text-sm font-semibold text-brand-50"
                  : "rounded-2xl px-4 py-3 text-sm font-semibold text-ink-600 hover:bg-ink-900/5"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
