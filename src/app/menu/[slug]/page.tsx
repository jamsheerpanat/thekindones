import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { prisma } from "@/lib/prisma";
import { toDetailProduct } from "@/lib/menu-helpers";

export const dynamic = "force-dynamic";

export default async function MenuItemPage({
  params
}: {
  params: { slug: string };
}) {
  const item = await prisma.menuItem.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  });

  if (!item || !item.active) {
    notFound();
  }

  const product = toDetailProduct(item);

  return <ProductDetail product={product} />;
}
