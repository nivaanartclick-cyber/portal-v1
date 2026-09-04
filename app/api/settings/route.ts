import { NextResponse } from 'next/server';
import { getSettings, saveSettings, isSupabaseConfigured } from '@/db/index';
import { requireAdmin } from '@/lib/auth';
import { ensureInitialized } from '@/lib/server-init';
import { logEvent } from '@/db/logger';

export async function GET() {
  try {
    await ensureInitialized();
    const settings = await getSettings();
    return NextResponse.json({
      ...settings,
      supabaseConnected: isSupabaseConfigured(),
    });
  } catch (error) {
    logEvent('settings.fetch_failed', { error: String(error) }, { level: 'error' });
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { businessName, businessEmail, businessPhone, businessAddress, businessHours, socialLinks } = body;

  try {
    const currentSettings = await getSettings();
    const updated = {
      businessName: businessName || currentSettings.businessName,
      businessEmail: businessEmail || currentSettings.businessEmail,
      businessPhone: businessPhone || currentSettings.businessPhone,
      businessAddress: businessAddress || currentSettings.businessAddress,
      businessHours: businessHours || currentSettings.businessHours,
      socialLinks: socialLinks !== undefined ? socialLinks : currentSettings.socialLinks,
    };

    await saveSettings(updated);
    logEvent('settings.updated', { fields: Object.keys(body) }, { actor: auth.username });
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    logEvent('settings.update_failed', { error: String(error) }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to update settings.' }, { status: 500 });
  }
}
