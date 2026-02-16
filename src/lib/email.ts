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
    // --- RELIABILITY FIX ---
    // Resend's onboarding@resend.dev ONLY works to your own registered email.
    // If your domain isn't verified, this call will fail for customers.
    // Switching to onboarding@resend.dev as it's the only one allowed for unverified accounts.
    const { data, error } = await resend.emails.send({
      from: "The Kind Ones <hello@octolabs.cloud>",
      to: [email],
      subject: "Welcome to The Kind Ones!",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="color: #231d21; font-family: serif;">Welcome to The Kind Ones, ${name}!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join our community. Explore our menu and discover gourmet flavors crafted with care.
          </p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || "https://tko.octolabs.cloud"}/menu" style="background-color: #231d21; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">View Our Menu</a>
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

export const sendOrderConfirmation = async ({
  email,
  name,
  orderId,
  tempPassword,
}: {
  email: string;
  name: string;
  orderId: string;
  tempPassword?: string;
}) => {
  if (!resend) return { ok: false };

  try {
    const { data, error } = await resend.emails.send({
      from: "The Kind Ones <hello@octolabs.cloud>",
      to: [email],
      subject: `Order Confirmed #${orderId.slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="color: #231d21; font-family: serif;">Order Received!</h1>
          <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">
            Hi ${name}, thank you for your order. We're preparing it now!
          </p>
          
          ${tempPassword ? `
          <div style="background: #FFFBEB; border: 1px solid #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #92400E;">An account has been created for you!</p>
            <p style="margin: 5px 0 0; color: #B45309;">Email: ${email}<br>Temporary Password: <strong>${tempPassword}</strong></p>
            <p style="margin: 10px 0 0; font-size: 12px; color: #B45309;">Please change this password after signing in.</p>
          </div>
          ` : ""}

          <div style="margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || "https://tko.octolabs.cloud"}/orders/${orderId}" style="background-color: #231d21; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Track My Order</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #9CA3AF;">
            © ${new Date().getFullYear()} The Kind Ones • Gourmet Crafted
          </p>
        </div>
      `,
    });

    if (error) console.error("Email Error:", error);
    return { ok: !error, data };
  } catch (err) {
    console.error("Email Catch Error:", err);
    return { ok: false };
  }
};
