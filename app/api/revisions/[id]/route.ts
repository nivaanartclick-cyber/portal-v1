import { NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/server-init';
import { requireAdmin } from '@/lib/auth';
import { logEvent } from '@/db/logger';
import { getRevision, saveRevision } from '@/db/index';
import { RevisionStatus } from '@/types/revision';

const VALID_STATUSES: RevisionStatus[] = ['Pending', 'Reviewing', 'In Progress', 'Resolved', 'Closed'];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const revision = await getRevision(id);
    if (!revision) {
      return NextResponse.json({ error: 'Revision not found.' }, { status: 404 });
    }
    return NextResponse.json({ data: revision });
  } catch (error) {
    logEvent('revision.fetch_failed', { error: String(error), id }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to fetch revision.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await request.json();
  const { status, adminNotes, projectId } = body;

  try {
    const existing = await getRevision(id);
    if (!existing) {
      return NextResponse.json({ error: 'Revision not found.' }, { status: 404 });
    }

    const updated = {
      ...existing,
      status: status && VALID_STATUSES.includes(status) ? status : existing.status,
      adminNotes: adminNotes !== undefined ? String(adminNotes) : existing.adminNotes,
      projectId: projectId !== undefined ? (projectId || undefined) : existing.projectId,
    };

    const saved = await saveRevision(updated);
    logEvent('revision.updated', { revisionId: id, status: saved.status }, { actor: auth.username });
    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    logEvent('revision.update_failed', { error: String(error), id }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to update revision.' }, { status: 500 });
  }
}
