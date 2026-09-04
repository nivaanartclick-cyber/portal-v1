import { NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSessionCookie } from '@/lib/auth';
import { logEvent } from '@/db/logger';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  if (verifyAdminCredentials(username, password)) {
    const response = NextResponse.json({ success: true, username });
    setAdminSessionCookie(response, username);
    logEvent('auth.login', { username }, { actor: username });
    return response;
  }

  logEvent('auth.login_failed', { username }, { level: 'warn' });
  return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
}
