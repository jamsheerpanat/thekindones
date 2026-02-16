import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const data: any = {};

        if (body.name !== undefined) data.name = body.name;
        if (body.deliveryFee !== undefined) data.deliveryFee = new Prisma.Decimal(body.deliveryFee);
        if (body.active !== undefined) data.active = body.active;

        const governorate = await prisma.governorate.update({
            where: { id: params.id },
            data
        });
        return NextResponse.json(governorate);
    } catch (err) {
        return NextResponse.json({ error: "Failed to update governorate" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.governorate.delete({
            where: { id: params.id }
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete governorate" }, { status: 500 });
    }
}
