import { NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/server-init';
import { logEvent } from '@/db/logger';
import { sendContactConfirmationEmails, isEmailConfigured } from '@/lib/email';

export async function POST(request: Request) {
  await ensureInitialized();
  const body = await request.json();
  const { fullName, emailAddress, subjectTitle, messageBody } = body;

  if (!fullName?.trim() || !emailAddress?.trim() || !subjectTitle?.trim() || !messageBody?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { error: 'Email service is not configured. Please set SMTP environment variables.' },
      { status: 503 }
    );
  }

  const payload = {
    fullName: fullName.trim(),
    email: emailAddress.trim(),
    subject: subjectTitle.trim(),
    message: messageBody.trim(),
  };

  logEvent('contact.submitted', { email: payload.email, subject: payload.subject });

  void (async () => {
    try {
      await sendContactConfirmationEmails(payload);
    } catch (error) {
      logEvent('contact.email_failed', { error: String(error) }, { level: 'error' });
    }
  })();

  return NextResponse.json({ success: true });
}
