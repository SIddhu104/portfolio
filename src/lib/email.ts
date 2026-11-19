import nodemailer from "nodemailer";

interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams): Promise<{ sent: boolean; method?: string; error?: string }> {
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "siddheshkorade10@gmail.com";
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Primary Method: Gmail SMTP with App Password (zero extra accounts needed)
  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const mailOptions = {
        from: `"${name} (Portfolio Inquiry)" <${gmailUser}>`,
        to: receiverEmail,
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject}`,
        text: `New message from your portfolio website:
        
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Received at: ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d0e12; color: #f1f5f9; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; padding: 24px;">
            <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 16px; margin-bottom: 20px;">
              <span style="display: inline-block; padding: 4px 10px; background-color: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 9999px; color: #38bdf8; font-size: 11px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase;">New Portfolio Message</span>
              <h2 style="margin: 12px 0 4px 0; color: #ffffff; font-size: 20px;">${subject}</h2>
              <p style="margin: 0; color: #94a3b8; font-size: 13px;">Received on ${new Date().toLocaleString()}</p>
            </div>

            <div style="background-color: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; width: 80px; font-weight: 600;">Sender:</td>
                  <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #94a3b8; font-weight: 600;">Email:</td>
                  <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 24px;">
              <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin-bottom: 8px;">Message Content</div>
              <div style="background-color: #070709; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message}</div>
            </div>

            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px; font-size: 12px; color: #64748b; text-align: center;">
              Hit <strong>Reply</strong> to respond directly to ${email}.
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return { sent: true, method: "gmail" };
    } catch (err: unknown) {
      console.error("Gmail SMTP dispatch error:", err);
      return { sent: false, method: "gmail", error: err instanceof Error ? err.message : "SMTP error" };
    }
  }

  // 2. Secondary Method: Resend API (if configured)
  if (resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [receiverEmail],
          reply_to: email,
          subject: `[Portfolio Contact] ${subject}`,
          html: `
            <h2>New Message from Portfolio Website</h2>
            <p><strong>Sender:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <div style="padding: 12px; background: #f4f4f5; border-radius: 6px; margin-top: 10px;">
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        return { sent: true, method: "resend" };
      }
      const data = await res.json();
      return { sent: false, method: "resend", error: data.message || "Resend error" };
    } catch (err: unknown) {
      console.error("Resend API error:", err);
      return { sent: false, method: "resend", error: err instanceof Error ? err.message : "Network error" };
    }
  }

  // If no email provider is configured, messages are saved in database / admin dashboard
  return { sent: false, method: "none", error: "No email service configured" };
}

interface SendReplyEmailParams {
  recipientName: string;
  recipientEmail: string;
  originalSubject: string;
  replyBody: string;
  isInitialEmail?: boolean;
}

export async function sendReplyEmail({
  recipientName,
  recipientEmail,
  originalSubject,
  replyBody,
  isInitialEmail = false,
}: SendReplyEmailParams): Promise<{ sent: boolean; method?: string; error?: string }> {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  const resendApiKey = process.env.RESEND_API_KEY;
  const subject = isInitialEmail
    ? originalSubject
    : originalSubject.toLowerCase().startsWith("re:")
      ? originalSubject
      : `Re: ${originalSubject}`;

  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailAppPassword },
      });

      await transporter.sendMail({
        from: `"${process.env.PORTFOLIO_OWNER_NAME || "Portfolio Owner"} <${gmailUser}>`,
        to: recipientEmail,
        replyTo: gmailUser,
        subject,
        text: `Hi ${recipientName},\n\n${replyBody}\n\n---\nSent from my portfolio`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; color: #18181b;">
            <p>Hi ${recipientName},</p>
            <div style="white-space: pre-wrap; line-height: 1.6;">${replyBody}</div>
            <hr style="margin-top:24px;border:0;border-top:1px solid #e4e4e7;">
            <p style="font-size:12px;color:#71717a;">Sent from my portfolio</p>
          </div>
        `,
      });
      return { sent: true, method: "gmail" };
    } catch (err: unknown) {
      return { sent: false, method: "gmail", error: err instanceof Error ? err.message : "SMTP error" };
    }
  }

  if (resendApiKey && resendApiKey.startsWith("re_")) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [recipientEmail],
          reply_to: process.env.CONTACT_RECEIVER_EMAIL || gmailUser,
          subject,
          html: `<p>Hi ${recipientName},</p><div style="white-space: pre-wrap;">${replyBody}</div>`,
        }),
      });
      if (res.ok) return { sent: true, method: "resend" };
      const data = await res.json();
      return { sent: false, method: "resend", error: data.message || "Resend error" };
    } catch (err: unknown) {
      return { sent: false, method: "resend", error: err instanceof Error ? err.message : "Network error" };
    }
  }

  return { sent: false, method: "none", error: "No email service configured" };
}
