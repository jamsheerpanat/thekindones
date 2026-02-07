import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.menuItem.findMany({
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
    active: item.active,
    featured: item.featured,
    category: item.category
  }));

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const image = body.image ? String(body.image).trim() : null;
  const categoryName = String(body.category || "").trim();
  const price = Number(body.price || 0);

  if (!name || !categoryName || !price) {
    return NextResponse.json(
      { error: "Name, category, and price are required." },
      { status: 400 }
    );
  }

  const categorySlug = slugify(categoryName);
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName },
    create: { name: categoryName, slug: categorySlug }
  });

  const item = await prisma.menuItem.create({
    data: {
      name,
      slug: slugify(name),
      description,
      image,
      price: new Prisma.Decimal(price),
      categoryId: category.id,
      active: body.active !== false,
      featured: body.featured === true
    }
  });

  return NextResponse.json(item, { status: 201 });
}
