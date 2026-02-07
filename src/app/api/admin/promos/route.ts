import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const promos = await prisma.promo.findMany({ orderBy: { createdAt: "desc" } });
  const payload = promos.map((promo) => ({
    id: promo.id,
    code: promo.code,
    description: promo.description,
    discount: promo.discount,
    amount: Number(promo.amount),
    active: promo.active,
    startsAt: promo.startsAt,
    endsAt: promo.endsAt
  }));
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const code = String(body.code || "").trim().toUpperCase();
  const amount = Number(body.amount || 0);

  if (!code || !amount) {
    return NextResponse.json(
      { error: "Code and amount are required." },
      { status: 400 }
    );
  }

  const promo = await prisma.promo.create({
    data: {
      code,
      description: body.description ? String(body.description).trim() : null,
      discount: body.discount === "FIXED" ? "FIXED" : "PERCENT",
      amount: new Prisma.Decimal(amount),
      active: body.active !== false,
      startsAt: body.startsAt ? new Date(body.startsAt) : null,
      endsAt: body.endsAt ? new Date(body.endsAt) : null
    }
  });

  return NextResponse.json(
    {
      id: promo.id,
      code: promo.code,
      description: promo.description,
      discount: promo.discount,
      amount: Number(promo.amount),
      active: promo.active,
      startsAt: promo.startsAt,
      endsAt: promo.endsAt
    },
    { status: 201 }
  );
}
