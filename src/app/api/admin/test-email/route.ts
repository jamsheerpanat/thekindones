import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const secret = searchParams.get("secret");

    if (secret !== "test_email_2025") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ error: "Email target required" }, { status: 400 });
    }

    try {
        const result = await sendWelcomeEmail({
            email,
            name: "Test User"
        });

        return NextResponse.json({
            success: result.ok,
            detail: result,
            message: result.ok ? "Test email task sent successfully." : "Email failed to send. Check console/API key."
        });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}
