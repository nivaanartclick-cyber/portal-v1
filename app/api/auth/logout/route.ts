import { NextResponse } from 'next/server';
import { clearAdminSessionCookie, getAdminSession } from '@/lib/auth';
import { logEvent } from '@/db/logger';

export async function POST() {
  const session = await getAdminSession();
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  logEvent('auth.logout', {}, { actor: session?.username });
  return response;
}
