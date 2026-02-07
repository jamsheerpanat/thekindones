import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const item = await prisma.menuItem.findUnique({
    where: { id: params.id },
    include: { category: true }
  });

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    price: Number(item.price),
    active: item.active,
    featured: item.featured,
    category: item.category
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.name) {
    updates.name = String(body.name).trim();
    updates.slug = slugify(String(body.name));
  }

  if (body.description !== undefined) {
    updates.description = String(body.description || "").trim();
  }

  if (body.image !== undefined) {
    updates.image = body.image ? String(body.image).trim() : null;
  }

  if (body.price !== undefined) {
    updates.price = new Prisma.Decimal(Number(body.price));
  }

  if (body.active !== undefined) {
    updates.active = Boolean(body.active);
  }

  if (body.featured !== undefined) {
    const nextFeatured = Boolean(body.featured);
    if (nextFeatured) {
      const featuredCount = await prisma.menuItem.count({
        where: {
          featured: true,
          id: { not: params.id }
        }
      });
      if (featuredCount >= 7) {
        return NextResponse.json(
          { error: "You can only feature 7 items." },
          { status: 400 }
        );
      }
    }
    updates.featured = nextFeatured;
  }

  if (body.category) {
    const categoryName = String(body.category).trim();
    const categorySlug = slugify(categoryName);
    const category = await prisma.category.upsert({
      where: { slug: categorySlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: categorySlug }
    });
    updates.categoryId = category.id;
  }

  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data: updates
  });

  return NextResponse.json({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description,
    image: item.image,
    price: Number(item.price),
    active: item.active,
    featured: item.featured
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.menuItem.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
