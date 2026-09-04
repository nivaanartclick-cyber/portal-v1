/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import nodemailer from 'nodemailer';
import { logEvent } from '@/db/logger';
import { formatDeadlineForEmail } from '@/lib/deadline';

/** Internal team inboxes — notified on every order, revision, and contact submission. */
export const TEAM_NOTIFY_EMAILS = [
  'nivaan.artclick@gmail.com',
  'mahir31012002@gmail.com',
] as const;

/** Reply-To address shown when customers reply to order/revision/contact confirmations. */
export const CUSTOMER_REPLY_TO_EMAIL = 'nivaan.artclick@gmail.com';

export function getTeamNotifyRecipients(): string[] {
  return [...TEAM_NOTIFY_EMAILS];
}

export function getCustomerReplyToEmail(): string {
  return process.env.EMAIL_REPLY_TO?.trim() || CUSTOMER_REPLY_TO_EMAIL;
}

/** Fire-and-forget email work so API responses are not blocked by SMTP latency. */
export function runEmailInBackground(task: () => Promise<void>, context: string): void {
  void task().catch((error) => {
    logEvent(`email.${context}_failed`, { error: String(error) }, { level: 'error' });
  });
}

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  fromName: string;
  replyTo: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.EMAIL_FROM
  );
}

export function getEmailConfig(): EmailConfig | null {
  if (!isEmailConfigured()) return null;
  return {
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    from: process.env.EMAIL_FROM!,
    fromName: process.env.EMAIL_FROM_NAME || 'ArtClick',
    replyTo: getCustomerReplyToEmail(),
  };
}

function createTransport() {
  const config = getEmailConfig();
  if (!config) throw new Error('Email is not configured.');
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });
}

function emailShell(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;color:#1c1917;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(28,25,23,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#06b6d4 100%);padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">ArtClick</p>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.85);">${title}</p>
          </td>
        </tr>
        <tr><td style="padding:32px;">${bodyHtml}</td></tr>
        <tr>
          <td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;background:#fafafa;">
            <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.6;">
              ArtClick — Embroidery Digitizing, Vector Art & Design Services<br>
              Promotional Products Industry Partner
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function detailRow(label: string, value: string): string {
  if (!value?.trim()) return '';
  return `<tr>
    <td style="padding:8px 0;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.04em;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#1c1917;vertical-align:top;">${value.replace(/\n/g, '<br>')}</td>
  </tr>`;
}

function detailsTable(rows: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;border-collapse:collapse;">${rows}</table>`;
}

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const config = getEmailConfig();
  if (!config) {
    logEvent('email.skipped', { reason: 'SMTP not configured', subject: options.subject }, { level: 'warn' });
    return;
  }

  const transport = createTransport();
  const replyTo = options.replyTo ?? config.replyTo;
  await transport.sendMail({
    from: `"${config.fromName}" <${config.from}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: `"${config.fromName}" <${replyTo}>`,
  });
}

export async function sendOrderConfirmationEmails(data: {
  ticketId: string;
  clientName: string;
  email: string;
  companyName?: string;
  phone?: string;
  serviceRequired: string;
  projectDescription: string;
  deadline: string;
  budget?: string;
  googleDriveLink?: string;
  additionalNotes?: string;
  submissionDate: string;
  deadlineWasDefaulted?: boolean;
}): Promise<void> {
  const teamRows = [
    detailRow('Ticket ID', data.ticketId),
    detailRow('Submitted', new Date(data.submissionDate).toLocaleString()),
    detailRow('Name', data.clientName),
    detailRow('Email', data.email),
    detailRow('Company', data.companyName || '—'),
    detailRow('Phone', data.phone || '—'),
    detailRow('Service', data.serviceRequired),
    detailRow('Deadline', formatDeadlineForEmail(data.deadline, Boolean(data.deadlineWasDefaulted))),
    detailRow('Budget', data.budget || '—'),
    detailRow('Description', data.projectDescription),
    detailRow('Drive Link', data.googleDriveLink || '—'),
    detailRow('Notes', data.additionalNotes || '—'),
  ].join('');

  const customerRows = [
    detailRow('Ticket ID', data.ticketId),
    detailRow('Submitted', new Date(data.submissionDate).toLocaleString()),
    detailRow('Name', data.clientName),
    detailRow('Email', data.email),
    detailRow('Company', data.companyName || '—'),
    detailRow('Phone', data.phone || '—'),
    detailRow('Service', data.serviceRequired),
    detailRow('Description', data.projectDescription),
    detailRow('Drive Link', data.googleDriveLink || '—'),
    detailRow('Notes', data.additionalNotes || '—'),
  ].join('');

  const customerHtml = emailShell(
    'Order Confirmation',
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${data.clientName || 'there'},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
      Thank you for submitting your project to <strong>ArtClick</strong>. We have received your request and our team will review it shortly.
      Please save your ticket ID for future reference and revision requests.
    </p>
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#4f46e5;">YOUR TICKET ID: ${data.ticketId}</p>
    ${detailsTable(customerRows)}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
      We typically respond within 4 business hours. Need changes later? Use the revision form with your ticket ID and email.
    </p>`
  );

  const teamHtml = emailShell(
    'New Project Order',
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A new project order has been submitted via the website intake form.</p>
    ${detailsTable(teamRows)}
    <p style="margin:0;font-size:13px;color:#6b7280;">Review in the admin dashboard under Project Submissions.</p>`
  );

  await Promise.all([
    sendMail({
      to: data.email,
      subject: `[ArtClick] Order Confirmation — Ticket ${data.ticketId}`,
      html: customerHtml,
      replyTo: getCustomerReplyToEmail(),
    }),
    sendMail({
      to: getTeamNotifyRecipients(),
      subject: `[ArtClick] New Order — ${data.ticketId} — ${data.clientName}`,
      html: teamHtml,
      replyTo: data.email,
    }),
  ]);
}

export async function sendRevisionConfirmationEmails(data: {
  revisionId: string;
  ticketId?: string;
  projectId?: string;
  email: string;
  clientName?: string;
  revisionComments: string;
  additionalDetails?: string;
  googleDriveLink?: string;
  submissionDate: string;
  /** Team-only: linked order budget (revisions). */
  teamBudget?: string;
  /** Team-only: resolved turnaround deadline (revisions). */
  teamDeadline?: string;
  teamDeadlineWasDefaulted?: boolean;
}): Promise<void> {
  const customerRows = [
    detailRow('Revision ID', data.revisionId),
    detailRow('Submitted', new Date(data.submissionDate).toLocaleString()),
    detailRow('Ticket ID', data.ticketId || 'Not provided'),
    detailRow('Email', data.email),
    detailRow('Name', data.clientName || '—'),
    detailRow('Revision Comments', data.revisionComments),
    detailRow('Additional Details', data.additionalDetails || '—'),
    detailRow('Drive Link', data.googleDriveLink || '—'),
  ].join('');

  const teamRows = [
    detailRow('Revision ID', data.revisionId),
    detailRow('Submitted', new Date(data.submissionDate).toLocaleString()),
    detailRow('Ticket ID', data.ticketId || 'Not provided'),
    detailRow('Linked Project', data.projectId || 'Pending manual match'),
    detailRow('Email', data.email),
    detailRow('Name', data.clientName || '—'),
    detailRow('Revision Comments', data.revisionComments),
    detailRow('Additional Details', data.additionalDetails || '—'),
    detailRow('Drive Link', data.googleDriveLink || '—'),
    ...(data.teamDeadline
      ? [detailRow('Deadline', formatDeadlineForEmail(data.teamDeadline, Boolean(data.teamDeadlineWasDefaulted)))]
      : []),
    ...(data.teamBudget !== undefined ? [detailRow('Budget', data.teamBudget || '—')] : []),
  ].join('');

  const customerHtml = emailShell(
    'Revision Request Received',
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${data.clientName || 'there'},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
      We have received your revision request. Our production team will review your feedback and files shortly.
    </p>
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#4f46e5;">REFERENCE: ${data.revisionId}</p>
    ${detailsTable(customerRows)}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">Thank you for choosing ArtClick.</p>`
  );

  const teamHtml = emailShell(
    'New Revision Request',
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A client has submitted a revision request.</p>
    ${detailsTable(teamRows)}
    <p style="margin:0;font-size:13px;color:#6b7280;">Review in Admin → Revision Requests.</p>`
  );

  await Promise.all([
    sendMail({
      to: data.email,
      subject: `[ArtClick] Revision Received — ${data.revisionId}`,
      html: customerHtml,
      replyTo: getCustomerReplyToEmail(),
    }),
    sendMail({
      to: getTeamNotifyRecipients(),
      subject: `[ArtClick] New Revision — ${data.revisionId}${data.ticketId ? ` (${data.ticketId})` : ''}`,
      html: teamHtml,
      replyTo: data.email,
    }),
  ]);
}

export async function sendContactConfirmationEmails(data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const rows = [
    detailRow('Name', data.fullName),
    detailRow('Email', data.email),
    detailRow('Subject', data.subject),
    detailRow('Message', data.message),
    detailRow('Received', new Date().toLocaleString()),
  ].join('');

  const customerHtml = emailShell(
    'Message Received',
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${data.fullName},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#374151;">
      Thank you for contacting <strong>ArtClick</strong>. We have received your message and a member of our team will respond within 4 business hours.
    </p>
    ${detailsTable(rows)}`

  );

  const teamHtml = emailShell(
    'New Contact Inquiry',
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">A new contact form submission was received.</p>
    ${detailsTable(rows)}`
  );

  await Promise.all([
    sendMail({
      to: data.email,
      subject: `[ArtClick] We received your message — ${data.subject}`,
      html: customerHtml,
      replyTo: getCustomerReplyToEmail(),
    }),
    sendMail({
      to: getTeamNotifyRecipients(),
      subject: `[ArtClick] Contact Form — ${data.fullName}: ${data.subject}`,
      html: teamHtml,
      replyTo: data.email,
    }),
  ]);
}
