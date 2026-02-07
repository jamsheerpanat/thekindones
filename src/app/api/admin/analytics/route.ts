import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [orderCount, userCount, activePromos] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.promo.count({ where: { active: true } })
  ]);

  return NextResponse.json({
    orderCount,
    userCount,
    activePromos
  });
}
