import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const promo = await prisma.promo.findUnique({ where: { id: params.id } });
  if (!promo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: promo.id,
    code: promo.code,
    description: promo.description,
    discount: promo.discount,
    amount: Number(promo.amount),
    active: promo.active,
    startsAt: promo.startsAt,
    endsAt: promo.endsAt
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
  const updates = {
    code: body.code ? String(body.code).trim().toUpperCase() : undefined,
    description:
      body.description !== undefined
        ? String(body.description || "").trim()
        : undefined,
    discount:
      body.discount !== undefined
        ? body.discount === "FIXED"
          ? "FIXED"
          : "PERCENT"
        : undefined,
    amount:
      body.amount !== undefined
        ? new Prisma.Decimal(Number(body.amount))
        : undefined,
    active: body.active !== undefined ? Boolean(body.active) : undefined,
    startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    endsAt: body.endsAt ? new Date(body.endsAt) : undefined
  };

  const promo = await prisma.promo.update({
    where: { id: params.id },
    data: updates
  });

  return NextResponse.json({
    id: promo.id,
    code: promo.code,
    description: promo.description,
    discount: promo.discount,
    amount: Number(promo.amount),
    active: promo.active,
    startsAt: promo.startsAt,
    endsAt: promo.endsAt
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

  await prisma.promo.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
