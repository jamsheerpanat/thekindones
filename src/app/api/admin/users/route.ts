
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                createdAt: true,
                _count: {
                    select: { orders: true }
                }
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, role } = await req.json();

        // simple validation
        if (!userId || !["USER", "ADMIN"].includes(role)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Prevent modifying yourself to avoid lockout
        if (userId === session.user.id) {
            return NextResponse.json({ error: "Cannot modify your own role" }, { status: 403 });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Failed to update user role:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
