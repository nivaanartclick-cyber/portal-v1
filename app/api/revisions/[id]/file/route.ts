import { NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/server-init';
import { requireAdmin } from '@/lib/auth';
import { getRevision, getSignedRevisionFileUrl } from '@/db/index';
import { logEvent } from '@/db/logger';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  try {
    const revision = await getRevision(id);
    if (!revision || !revision.storagePath) {
      return NextResponse.json({ error: 'No file attached to this revision.' }, { status: 404 });
    }

    const url = await getSignedRevisionFileUrl(revision.storagePath);
    logEvent('revision.file_download', { revisionId: id }, { actor: auth.username });
    return NextResponse.json({ url, fileName: revision.uploadedFile || 'revision-file' });
  } catch (error) {
    logEvent('revision.file_download_failed', { error: String(error), id }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to generate download URL.' }, { status: 500 });
  }
}
