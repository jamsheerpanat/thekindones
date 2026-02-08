import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Basic security to prevent accidental deletion
    if (secret !== "clear_all_users_2025") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Delete all users
        await prisma.user.deleteMany();

        return NextResponse.json({
            success: true,
            message: "All users have been removed from the database."
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}
