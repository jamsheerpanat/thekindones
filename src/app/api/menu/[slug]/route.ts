import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const item = await prisma.menuItem.findUnique({
    where: { slug: params.slug },
    include: { category: true }
  });

  if (!item || !item.active) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    price: Number(item.price),
    category: item.category?.name || ""
  });
}
