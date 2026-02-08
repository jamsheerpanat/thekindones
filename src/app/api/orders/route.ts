import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { sendOrderConfirmation } from "@/lib/email";
import crypto from "crypto";

export const runtime = "nodejs";

const requireUser = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  return session;
};

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
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const guestData = body.guest; // { email, name, phone }

    let userId = session?.user?.id;
    let tempPassword = "";

    // If no session, handle automatic guest account creation
    if (!session) {
      if (!guestData?.email || !guestData?.name) {
        return NextResponse.json(
          { error: "Contact details are required for guest checkout." },
          { status: 400 }
        );
      }

      const email = guestData.email.toLowerCase().trim();

      // Check if user exists
      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        // Generate random temporary password
        tempPassword = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
        const hashedPassword = await hashPassword(tempPassword);

        user = await prisma.user.create({
          data: {
            email,
            name: guestData.name,
            phone: guestData.phone,
            password: hashedPassword,
          }
        });
      }

      userId = user.id;
    }
    const items = Array.isArray(body.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json(
        { error: "Order items are required." },
        { status: 400 }
      );
    }

    const ids = items.map((item: { menuItemId: string }) => item.menuItemId);
    const uniqueIds = Array.from(new Set(ids)) as string[];

    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: uniqueIds } }
    });

    // Check if we found all unique IDs requested
    const foundIds = new Set(menuItems.map(i => i.id));
    const allFound = uniqueIds.every(id => foundIds.has(id));

    if (!allFound) {
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
        return null; // Should not happen given check above
      }

      const quantity = Math.max(1, Number(item.quantity || 1));
      const price = Number(menuItem.price);

      // Add base price * quantity
      let lineTotal = price * quantity;

      // If modifiers affect price, add/subtract here (simplified implementation)
      // Note: Real implementation would validate modifiers too
      // For now, assume modifiers don't change price OR price is calculated client-side (bad) and verified here?
      // The original logic just summed base price. Let's stick to that for now, but really modifiers should be checked.

      total += lineTotal;

      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: new Prisma.Decimal(price),
        quantity,
        modifiers: item.modifiers ? JSON.stringify(item.modifiers) : null
      };
    });

    const order = await prisma.order.create({
      data: {
        userId,
        total: new Prisma.Decimal(total.toFixed(3)),
        currency: "KWD",
        items: {
          create: orderItems.filter(Boolean)
        }
      },
      include: {
        items: true,
        user: true
      }
    });

    // Send order confirmation email in background
    if (order.user?.email) {
      sendOrderConfirmation({
        email: order.user.email,
        name: order.user.name || "Customer",
        orderId: order.id,
        tempPassword: tempPassword || undefined
      }).catch(err => console.error("Order Email Error:", err));
    }

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
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Unable to create order. Please try again." },
      { status: 500 }
    );
  }
}
