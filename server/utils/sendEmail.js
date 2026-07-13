import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Centralized email sender. Swap the provider here later without touching callers.
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to,
      subject,
      html,
    });
  } catch (err) {
    // Don't let email failures break the checkout/reset flow itself.
    console.error("Email send failed:", err.message);
  }
};

export const orderConfirmationEmail = (order) => `
  <h2>Thanks for your order!</h2>
  <p>Order ID: ${order._id}</p>
  <ul>
    ${order.items.map((i) => `<li>${i.quantity} x ${i.name} — $${(i.price * i.quantity).toFixed(2)}</li>`).join("")}
  </ul>
  <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
  <p>We'll email you again once your order ships.</p>
`;

export const passwordResetEmail = (resetUrl) => `
  <h2>Reset your password</h2>
  <p>Click the link below to set a new password. This link expires in 1 hour.</p>
  <p><a href="${resetUrl}">${resetUrl}</a></p>
  <p>If you didn't request this, you can safely ignore this email.</p>
`;
