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
    // IMPORTANT: In production with Resend, you MUST verify your domain to send to any email.
    // If your domain is NOT verified, you can only send to your OWN account email.
    // Using onboarding@resend.dev as a fallback for testing.
    const { data, error } = await resend.emails.send({
      from: "The Kind Ones <hello@thekindones.com>", // Updated to a placeholder - needs verification in Resend
      to: [email],
      subject: "Welcome to The Kind Ones!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="color: #231d21; font-family: serif;">Welcome to The Kind Ones, ${name}!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join our community. Explore our menu and discover gourmet flavors crafted with care.
          </p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'https://octolabs.cloud'}/menu" style="background-color: #231d21; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">View Our Menu</a>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #9CA3AF;">
            © ${new Date().getFullYear()} The Kind Ones • Gourmet Crafted
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error Detail:", JSON.stringify(error, null, 2));
      return { ok: false, error };
    }

    console.log("Email task completed for:", email);
    return { ok: true, data };
  } catch (err) {
    console.error("Resend Fatal Catch:", err);
    return { ok: false, error: err };
  }
};
