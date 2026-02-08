
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendWelcomeEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== "setup_admin_secret_2026") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const email = "admin@octolabs.cloud";
        const password = "AdminPassword123!"; // Simple default, user should change it
        const hashedPassword = await hashPassword(password);

        // Create or Update Admin User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: "ADMIN",
                password: hashedPassword,
                name: "Super Admin"
            },
            create: {
                email,
                password: hashedPassword,
                role: "ADMIN",
                name: "Super Admin"
            }
        });

        // Send Test Email to verify system
        const emailResult = await sendWelcomeEmail({
            email: user.email!,
            name: user.name || "Admin"
        });

        return NextResponse.json({
            success: true,
            message: "Admin user created/updated successfully.",
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            emailStatus: emailResult
        });
    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}
