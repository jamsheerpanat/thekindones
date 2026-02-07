import Link from "next/link";
import { Logo } from "@/components/Logo";

const LINK_GROUPS = [
  {
    title: "Explore",
    links: [
      { label: "Menu", href: "/menu" },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Subscriptions", href: "/subscriptions" }
    ]
  },
  {
    title: "Account",
    links: [
      { label: "Account", href: "/account" },
      { label: "Loyalty", href: "/loyalty" },
      { label: "Reviews", href: "/reviews" }
    ]
  }
];

export const SiteFooter = () => (
  <footer className="border-t border-white/60 bg-white/80">
    <div className="container-padded flex flex-col gap-10 py-12">
      <div className="grid gap-10 lg:grid-cols-[1.1fr,1.2fr]">
        <div className="flex flex-col gap-4">
          <Logo size="sm" />
          <p className="text-sm text-ink-500">
            thekindones is a modern dining experience built for quick picks,
            curated flavors, and effortless ordering.
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
            <span className="rounded-full border border-ink-100/70 bg-white px-3 py-1">
              Kuwait City
            </span>
            <span className="rounded-full border border-ink-100/70 bg-white px-3 py-1">
              Open daily 8:00am - 11:00pm
            </span>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-400">
                {group.title}
              </p>
              <div className="flex flex-col gap-2">
                {group.links.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-ink-600 hover:text-ink-900 transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-100/60 pt-6 text-xs text-ink-400 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} thekindones. All rights reserved.</span>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/privacy" className="hover:text-ink-900 transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink-900 transition">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-ink-900 transition">
            Contact
          </Link>
        </div>
      </div>
    </div>
  </footer>
);
