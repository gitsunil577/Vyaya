import { Resend } from "resend";

let resend;

// Constructed lazily so the app can still run in dev without
// RESEND_API_KEY set — the error only surfaces when an email is actually sent.
function getClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY — set it in .env before sending mail");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendMail({ to, subject, html, attachments }) {
  return getClient().emails.send({
    from: "Vyaya@gmail.com",
    to,
    subject,
    html,
    // Resend expects attachment content as a base64 string (or a plain
    // Buffer, which it will base64-encode itself — passing base64
    // explicitly here so behavior is explicit either way).
    attachments: attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.isBuffer(a.content) ? a.content.toString("base64") : a.content,
    })),
  });
}
