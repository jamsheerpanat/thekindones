import Image from "next/image";
import Link from "next/link";
import type { CardProduct } from "@/lib/menu-helpers";
import { formatPrice } from "@/lib/utils";

export const ProductCard = ({ product }: { product: CardProduct }) => (
  <Link
    href={`/menu/${product.slug}`}
    className="card-next group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:shadow-soft"
  >
    <div className="p-4">
      <div className="relative h-44 w-full overflow-hidden rounded-3xl bg-ink-100/40">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain transition duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-200 text-ink-900">
            <span className="text-lg font-display">{product.name}</span>
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-ink-900">{product.name}</h3>
          <p className="text-sm text-ink-500 line-clamp-2">
            {product.description}
          </p>
        </div>
        <span className="rounded-full border border-ink-100 bg-white px-3 py-1 text-xs font-semibold text-ink-700">
          {formatPrice(product.price)}
        </span>
      </div>
      {product.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-ink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-auto flex items-center justify-between text-xs text-ink-400">
        <span>{product.category}</span>
        {product.rating && product.reviews ? (
          <span>
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        ) : null}
      </div>
      <div className="pt-2">
        <span className="btn btn-outline w-full">Customize</span>
      </div>
    </div>
  </Link>
);
