import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { prisma } from "@/lib/prisma";
import {
  getCategoriesFromItems,
  toCardProduct
} from "@/lib/menu-helpers";

export default async function HomePage() {
  const [items, heroSettings] = await Promise.all([
    prisma.menuItem.findMany({
      where: { active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.heroSettings.findFirst()
  ]);

  const cards = items.map((item) => toCardProduct(item));
  const categories = getCategoriesFromItems(items);

  // Use DB settings or fall back to defaults
  const hero = {
    title: heroSettings?.title || "Order in minutes",
    subtitle: heroSettings?.subtitle || "Pick a category, customize, and checkout in a few taps.",
    image: heroSettings?.image || cards[0]?.image,
    promoText: heroSettings?.promoText || "Promo: Free delivery on first order",
    primaryBtn: heroSettings?.primaryBtn || "Start shopping",
    primaryUrl: heroSettings?.primaryUrl || "/menu",
    secondaryBtn: heroSettings?.secondaryBtn || "View menu",
    secondaryUrl: heroSettings?.secondaryUrl || "/menu",
  };

  const trending = cards.slice(0, 6);

  return (
    <div>
      <section className="pt-4 pb-2 md:pt-8 md:pb-4">
        <div className="container-padded">
          <div className="card-next relative overflow-hidden p-6 md:p-8">
            {hero.image ? (
              <div className="absolute inset-0">
                <Image
                  src={hero.image}
                  alt="hero banner"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/30" />
              </div>
            ) : null}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
                  thekindones
                </p>
                <h1 className="text-3xl md:text-4xl">{hero.title}</h1>
                <p className="text-sm text-ink-600">
                  {hero.subtitle}
                </p>
                {hero.promoText && (
                  <span className="chip w-fit bg-brand-200 text-ink-900">
                    {hero.promoText}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={hero.primaryUrl} className="btn btn-primary">
                  {hero.primaryBtn}
                </Link>
                <Link href={hero.secondaryUrl} className="btn btn-outline">
                  {hero.secondaryBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-2 pb-12 md:pt-4 md:pb-16">
        <div className="container-padded grid gap-8">
          <div className="card p-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink-900">
                Shop by category
              </h2>
              <Link href="/menu" className="btn btn-ghost">
                View all
              </Link>
            </div>
            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible no-scrollbar">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/menu?category=${encodeURIComponent(category)}`}
                  className="chip"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink-900">
                  Ready to order?
                </h3>
                <p className="text-sm text-ink-500">
                  Start with the menu and build your meal in seconds.
                </p>
              </div>
              <Link href="/menu" className="btn btn-primary">
                Go to menu
              </Link>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-ink-900">
                Trending now
              </h2>
              <Link href="/menu" className="btn btn-ghost">
                View menu
              </Link>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
