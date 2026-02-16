import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET() {
    const governorates = await prisma.governorate.findMany({
        orderBy: { name: "asc" }
    });
    return NextResponse.json(governorates);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const governorate = await prisma.governorate.create({
            data: {
                name: body.name,
                deliveryFee: new Prisma.Decimal(body.deliveryFee),
                active: body.active !== undefined ? body.active : true
            }
        });
        return NextResponse.json(governorate);
    } catch (err) {
        return NextResponse.json({ error: "Failed to create governorate" }, { status: 500 });
    }
}
