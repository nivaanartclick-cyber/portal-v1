import { NextResponse } from 'next/server';
import { getProject, getSignedProjectFileUrl } from '@/db/index';
import { requireAdmin } from '@/lib/auth';
import { ensureInitialized } from '@/lib/server-init';
import { logEvent } from '@/db/logger';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;

  try {
    const project = await getProject(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }
    if (!project.storagePath) {
      return NextResponse.json({ error: 'No stored file for this project.' }, { status: 404 });
    }
    const url = await getSignedProjectFileUrl(project.storagePath);
    logEvent('project.file_download', { projectId: project.id, fileName: project.uploadedFile }, { actor: auth.username });
    return NextResponse.json({ url, fileName: project.uploadedFile || 'download' });
  } catch (error) {
    logEvent('project.file_download_failed', { projectId: id, error: String(error) }, { level: 'error' });
    return NextResponse.json({ error: 'Failed to generate file download link.' }, { status: 500 });
  }
}
