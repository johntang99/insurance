/**
 * BAAM System I — Insurance Brokerage Platform
 * Quote Request Email Notification System
 *
 * Uses Resend (same provider as the rest of the platform).
 * Email failures NEVER block the quote API — wrapped in try/catch.
 */

import { Resend } from 'resend';
import { getLineName } from '@/lib/insurance/theme';

interface QuoteNotificationData {
  // Lead info
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  coverageTypes: string[];
  preferredLanguage?: string;
  bestContactTime?: string;
  details?: Record<string, unknown>;
  source?: string;
  // Site info
  siteName: string;
  siteId: string;
  notificationEmail?: string;
  fromEmail?: string;
  adminBaseUrl?: string;
}

function buildSubject(data: QuoteNotificationData): string {
  const types = data.coverageTypes.map(getLineName).join(', ');
  return `🔔 New Quote Request — ${types} — ${data.firstName} ${data.lastName}`;
}

function buildHtmlBody(data: QuoteNotificationData): string {
  const types = data.coverageTypes.map(getLineName).join(', ');
  const adminLink = data.adminBaseUrl
    ? `${data.adminBaseUrl}/admin/quote-requests`
    : '#';

  const detailRows = data.details
    ? Object.entries(data.details)
        .filter(([, v]) => v && v !== '')
        .map(([k, v]) => `
          <tr>
            <td style="padding:6px 12px;color:#7a8a9a;font-size:13px;white-space:nowrap;">${k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</td>
            <td style="padding:6px 12px;color:#1a2535;font-size:13px;">${v}</td>
          </tr>`)
        .join('')
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f8fa;font-family:Inter,system-ui,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

      <!-- Header -->
      <tr>
        <td style="background:#0b1f3a;padding:24px 28px;">
          <p style="margin:0;color:rgba(255,255,255,.5);font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;">${data.siteName}</p>
          <h1 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700;">🔔 New Quote Request</h1>
        </td>
      </tr>

      <!-- Status badge -->
      <tr>
        <td style="background:#fef3cd;padding:12px 28px;border-bottom:1px solid #e2e8f0;">
          <p style="margin:0;color:#92400e;font-size:13px;font-weight:600;">
            ⚡ New lead — respond within 2 hours for best conversion
          </p>
        </td>
      </tr>

      <!-- Contact info -->
      <tr>
        <td style="padding:24px 28px 0;">
          <h2 style="margin:0 0 16px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#7a8a9a;">Contact Information</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
            <tr style="background:#f7f8fa;">
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;width:100px;">Name</td>
              <td style="padding:10px 12px;color:#0b1f3a;font-size:14px;font-weight:700;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Phone</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;">
                <a href="tel:${data.phone.replace(/\D/g,'')}" style="color:#c9933a;font-size:15px;font-weight:700;text-decoration:none;">${data.phone}</a>
              </td>
            </tr>
            ${data.email ? `
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Email</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;">
                <a href="mailto:${data.email}" style="color:#1e4275;font-size:13px;text-decoration:none;">${data.email}</a>
              </td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Coverage</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;color:#1a2535;font-size:13px;font-weight:600;">${types}</td>
            </tr>
            ${data.bestContactTime ? `
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Best Time</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;color:#1a2535;font-size:13px;">${data.bestContactTime}</td>
            </tr>` : ''}
            ${data.preferredLanguage && data.preferredLanguage !== 'English' ? `
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Language</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;color:#c9933a;font-size:13px;font-weight:600;">${data.preferredLanguage}</td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 12px;color:#7a8a9a;font-size:13px;font-weight:600;border-top:1px solid #e2e8f0;">Source</td>
              <td style="padding:10px 12px;border-top:1px solid #e2e8f0;color:#1a2535;font-size:13px;">${data.source || 'website'}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Additional details -->
      ${detailRows ? `
      <tr>
        <td style="padding:20px 28px 0;">
          <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#7a8a9a;">Additional Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
            ${detailRows}
          </table>
        </td>
      </tr>` : ''}

      <!-- CTA -->
      <tr>
        <td style="padding:24px 28px;">
          <a href="${adminLink}" style="display:inline-block;background:#0b1f3a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">
            View in Admin Dashboard →
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background:#f7f8fa;padding:16px 28px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#b0bec8;font-size:11px;">
            This notification was sent by ${data.siteName} Insurance Platform. Do not reply to this email.
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildTextBody(data: QuoteNotificationData): string {
  const types = data.coverageTypes.map(getLineName).join(', ');
  return `
NEW QUOTE REQUEST — ${data.siteName}

Name:     ${data.firstName} ${data.lastName}
Phone:    ${data.phone}
Email:    ${data.email || 'Not provided'}
Coverage: ${types}
Time:     ${data.bestContactTime || 'Anytime'}
Language: ${data.preferredLanguage || 'English'}
Source:   ${data.source || 'website'}

${data.details?.message ? `Message: ${data.details.message}\n` : ''}

View in Admin: ${data.adminBaseUrl || ''}/admin/quote-requests/${data.id}
  `.trim();
}

export async function sendQuoteNotification(data: QuoteNotificationData): Promise<void> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('[Quote Notification] RESEND_API_KEY not set — skipping email');
      return;
    }

    const to = data.notificationEmail
      ? data.notificationEmail.split(',').map(e => e.trim()).filter(Boolean)
      : null;

    if (!to || to.length === 0) {
      const fallback = process.env.CONTACT_FALLBACK_TO || process.env.QUOTE_NOTIFICATION_EMAIL;
      if (!fallback) {
        console.log('[Quote Notification] No notification email configured — skipping');
        return;
      }
      to?.push(fallback) || [fallback];
    }

    const from = data.fromEmail || process.env.RESEND_FROM || 'noreply@baamplatform.com';
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from,
      to: to!,
      subject: buildSubject(data),
      html: buildHtmlBody(data),
      text: buildTextBody(data),
    });

    console.log(`[Quote Notification] Sent to ${to?.join(', ')} for lead ${data.id}`);
  } catch (err) {
    // NEVER let email failure block the quote submission
    console.error('[Quote Notification] Email send failed (lead still saved):', err);
  }
}
