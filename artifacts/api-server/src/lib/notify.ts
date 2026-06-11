import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

export type NotifyType = "article" | "trip";

export interface NotifyPayload {
  title: string;
  url: string;
  excerpt?: string;
  coverImageUrl?: string;
}

async function getSiteUrl(): Promise<string> {
  const domain = process.env["REPLIT_DEV_DOMAIN"];
  return domain ? `https://${domain}` : "https://wildpixels.replit.app";
}

function buildEmailHtml(type: NotifyType, payload: NotifyPayload, unsubscribeUrl: string, siteUrl: string): string {
  const label = type === "article" ? "New Field Note" : "New Journey Added";
  const ctaLabel = type === "article" ? "Read the Article →" : "View the Trip →";
  const accentColor = "#d97706";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${label}</title></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0d0d0d;padding:28px 36px;border-bottom:3px solid ${accentColor};">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-size:22px;font-weight:700;color:#f5f5f4;letter-spacing:-0.5px;">Wildpixels</span>
                  <span style="display:block;font-size:10px;color:#a8a29e;text-transform:uppercase;letter-spacing:3px;margin-top:4px;">${label}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Cover image -->
        ${payload.coverImageUrl ? `
        <tr>
          <td style="padding:0;">
            <img src="${payload.coverImageUrl}" alt="${payload.title}" width="600" style="width:100%;max-height:280px;object-fit:cover;display:block;" />
          </td>
        </tr>` : ""}

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 36px;">
            <p style="margin:0 0 8px;font-size:10px;color:${accentColor};text-transform:uppercase;letter-spacing:3px;font-weight:600;">${label}</p>
            <h1 style="margin:0 0 16px;font-size:28px;font-weight:700;color:#1c1917;line-height:1.25;">${payload.title}</h1>
            ${payload.excerpt ? `<p style="margin:0 0 28px;font-size:15px;color:#57534e;line-height:1.7;">${payload.excerpt}</p>` : ""}
            <a href="${payload.url}" style="display:inline-block;background:${accentColor};color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.3px;">${ctaLabel}</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f4;padding:24px 36px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:11px;color:#a8a29e;line-height:1.6;">
              You're receiving this because you subscribed to updates from <a href="${siteUrl}" style="color:${accentColor};text-decoration:none;">Wildpixels</a>.
              &nbsp;·&nbsp;
              <a href="${unsubscribeUrl}" style="color:#a8a29e;text-decoration:underline;">Unsubscribe</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function notifySubscribers(type: NotifyType, payload: NotifyPayload): Promise<void> {
  const user = process.env["GMAIL_USER"];
  const pass = process.env["GMAIL_APP_PASSWORD"];
  if (!user || !pass) {
    console.warn("Notify: email credentials not set — skipping subscriber notifications");
    return;
  }

  const result = await db.execute(sql`SELECT email, unsubscribe_token FROM subscribers`);
  const subscribers = result.rows as Array<{ email: string; unsubscribe_token: string }>;
  if (subscribers.length === 0) return;

  const siteUrl = await getSiteUrl();
  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

  const label = type === "article" ? "New Field Note" : "New Journey Added";
  const subject = `[Wildpixels] ${label}: ${payload.title}`;

  const sendAll = subscribers.map(({ email, unsubscribe_token }) => {
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${unsubscribe_token}`;
    return transporter.sendMail({
      from: `"Wildpixels" <${user}>`,
      to: email,
      subject,
      html: buildEmailHtml(type, payload, unsubscribeUrl, siteUrl),
    }).catch((err) => console.error(`Notify: failed to email ${email}:`, err));
  });

  await Promise.all(sendAll);
  console.info(`Notify: sent ${label} to ${subscribers.length} subscriber(s)`);
}
