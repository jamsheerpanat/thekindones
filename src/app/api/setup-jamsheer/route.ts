
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== "setup_jamsheer_admin_2026") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const email = "jamsheerpanat@gmail.com";
        const password = "password";
        const hashedPassword = await hashPassword(password);

        // Create or Update Admin User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: "ADMIN",
                password: hashedPassword,
                name: "Jamsheer Panat"
            },
            create: {
                email,
                password: hashedPassword,
                role: "ADMIN",
                name: "Jamsheer Panat"
            }
        });

        return NextResponse.json({
            success: true,
            message: "Admin user 'jamsheerpanat@gmail.com' created/updated successfully.",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
