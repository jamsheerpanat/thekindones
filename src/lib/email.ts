import { Resend } from "resend";

let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
}

export const sendWelcomeEmail = async ({
    email,
    name,
}: {
    email: string;
    name: string;
}) => {
    if (!resend) {
        console.error("Resend API Key is missing. Email not sent.");
        return { ok: false, error: "Missing API Key" };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "The Kind Ones <onboarding@resend.dev>",
            to: [email],
            subject: "Welcome to The Kind Ones!",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome, ${name}!</h1>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            We're thrilled to have you join <strong>The Kind Ones</strong> community.
          </p>
          <p style="color: #555; font-size: 16px; line-height: 1.5;">
            Explore our menu and discover your new favorite meal.
          </p>
          <div style="margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL}/menu" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Menu</a>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} The Kind Ones. All rights reserved.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error("Error sending welcome email:", error);
            return { ok: false, error };
        }

        console.log("Welcome email sent successfully to:", email);
        return { ok: true, data };
    } catch (err) {
        console.error("Unexpected error sending email:", err);
        return { ok: false, error: err };
    }
};
