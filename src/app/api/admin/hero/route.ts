import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const settings = await prisma.heroSettings.findFirst();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch hero settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await request.json();
        const settings = await prisma.heroSettings.upsert({
            where: { id: "hero-main" },
            update: body,
            create: { id: "hero-main", ...body },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Hero update error:", error);
        return NextResponse.json({ error: "Failed to update hero settings" }, { status: 500 });
    }
}
