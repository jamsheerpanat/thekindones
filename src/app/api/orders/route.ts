import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  const payload = orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: Number(order.total),
    currency: order.currency,
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      modifiers: item.modifiers
    }))
  }));

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await requireUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];

  if (!items.length) {
    return NextResponse.json(
      { error: "Order items are required." },
      { status: 400 }
    );
  }

  const ids = items.map((item: { menuItemId: string }) => item.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: ids } }
  });
  if (menuItems.length !== ids.length) {
    return NextResponse.json(
      { error: "One or more items are invalid." },
      { status: 400 }
    );
  }
  const menuMap = new Map(menuItems.map((item) => [item.id, item]));

  let total = 0;
  const orderItems = items.map((item: any) => {
    const menuItem = menuMap.get(item.menuItemId);
    if (!menuItem) {
      return null;
    }
    const quantity = Math.max(1, Number(item.quantity || 1));
    const price = Number(menuItem.price);
    total += price * quantity;
    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: new Prisma.Decimal(price),
      quantity,
      modifiers: item.modifiers || null
    };
  });
  if (orderItems.some((item: any) => !item)) {
    return NextResponse.json(
      { error: "One or more items are invalid." },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      total: new Prisma.Decimal(total.toFixed(3)),
      currency: "KWD",
      items: {
        create: orderItems.filter(Boolean)
      }
    },
    include: { items: true }
  });

  return NextResponse.json(
    {
      id: order.id,
      status: order.status,
      total: Number(order.total),
      currency: order.currency,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        modifiers: item.modifiers
      }))
    },
    { status: 201 }
  );
}
