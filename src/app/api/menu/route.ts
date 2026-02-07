import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const items = await prisma.menuItem.findMany({
    where: {
      active: true,
      ...(category
        ? {
            category: {
              OR: [
                { name: category },
                { slug: category.toLowerCase() }
              ]
            }
          }
        : {})
    },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  const payload = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    price: Number(item.price),
    category: item.category?.name || ""
  }));

  return NextResponse.json(payload);
}
