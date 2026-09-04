/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin, isSupabaseConfigured } from './supabase';

const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'server.log');

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  action: string;
  actor?: string;
  details?: Record<string, unknown>;
}

function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch {
    // Read-only filesystem on Vercel — skip
  }
}

async function persistToSupabase(entry: LogEntry): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdmin();
  await supabase.from('audit_logs').insert({
    timestamp: entry.timestamp,
    level: entry.level,
    action: entry.action,
    actor: entry.actor || '',
    details: entry.details || {},
  });
}

export function logEvent(
  action: string,
  details: Record<string, unknown> = {},
  options: { level?: LogEntry['level']; actor?: string } = {}
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: options.level || 'info',
    action,
    actor: options.actor,
    details,
  };

  const line = JSON.stringify(entry) + '\n';

  try {
    ensureLogDir();
    fs.appendFileSync(LOG_FILE, line, 'utf-8');
  } catch {
    // Expected on serverless hosts
  }

  void persistToSupabase(entry).catch((err) => {
    console.error('Failed to persist audit log:', err);
  });

  const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()} ${action}`;
  if (entry.level === 'error') {
    console.error(prefix, details);
  } else {
    console.log(prefix, Object.keys(details).length ? details : '');
  }
}

export function getLogFilePath(): string {
  return LOG_FILE;
}

export async function readLogContents(): Promise<string> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('audit_logs')
        .select('timestamp, level, action, actor, details')
        .order('timestamp', { ascending: true })
        .limit(5000);

      if (!error && data?.length) {
        return data
          .map((row) =>
            JSON.stringify({
              timestamp: row.timestamp,
              level: row.level,
              action: row.action,
              actor: row.actor || undefined,
              details: row.details,
            })
          )
          .join('\n') + '\n';
      }
    } catch {
      // fall through to file
    }
  }

  try {
    ensureLogDir();
    if (fs.existsSync(LOG_FILE)) {
      return fs.readFileSync(LOG_FILE, 'utf-8');
    }
  } catch {
    // ignore
  }
  return '';
}

export async function getLogEntryCount(): Promise<number> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { count } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    } catch {
      // fall through
    }
  }
  const contents = await readLogContents();
  return contents.split('\n').filter(Boolean).length;
}

export function initializeLogger(): void {
  logEvent('server.logger_initialized', { runtime: 'nextjs' });
}
