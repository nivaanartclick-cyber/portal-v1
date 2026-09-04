/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseAdmin } from './supabase';
import { SocialLinks, EMPTY_SOCIAL_LINKS } from '@/types/settings';

export interface AppSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: string;
  socialLinks: SocialLinks;
}

interface SettingsRow {
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  business_hours: string;
  social_links?: SocialLinks | null;
}

export const DEFAULT_SETTINGS: AppSettings = {
  businessName: 'ArtClick',
  businessEmail: 'mailme@artclick.co.in',
  businessPhone: '+91 635 575 7852',
  businessAddress: 'ArtClick, Nr Infinity Park, Vasna Bhayli Road, Vadodara, Gujarat',
  businessHours: 'Mon - Fri: 9:00 AM - 6:00 PM (IST)',
  socialLinks: { ...EMPTY_SOCIAL_LINKS },
};

function rowToSettings(row: SettingsRow): AppSettings {
  return {
    businessName: row.business_name,
    businessEmail: row.business_email,
    businessPhone: row.business_phone,
    businessAddress: row.business_address,
    businessHours: row.business_hours,
    socialLinks: (row.social_links as SocialLinks) || { ...EMPTY_SOCIAL_LINKS },
  };
}

function settingsToRow(settings: AppSettings): Record<string, unknown> {
  return {
    id: 1,
    business_name: settings.businessName,
    business_email: settings.businessEmail,
    business_phone: settings.businessPhone,
    business_address: settings.businessAddress,
    business_hours: settings.businessHours,
    social_links: settings.socialLinks || { ...EMPTY_SOCIAL_LINKS },
  };
}

export async function fetchSettings(): Promise<AppSettings> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch settings: ${error.message}`);
  }

  if (!data) {
    await updateSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return rowToSettings(data as SettingsRow);
}

export async function updateSettings(settings: AppSettings): Promise<AppSettings> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('app_settings')
    .upsert(settingsToRow(settings))
    .select('business_name, business_email, business_phone, business_address, business_hours, social_links')
    .single();

  if (error) {
    throw new Error(`Failed to update settings: ${error.message}`);
  }

  return rowToSettings(data as SettingsRow);
}
