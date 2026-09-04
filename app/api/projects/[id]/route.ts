import { NextResponse } from 'next/server';
import { ProjectPriority, ProjectStatus } from '@/types';
import { getProject, saveProject, deleteProject } from '@/db/index';
import { requireAdmin } from '@/lib/auth';
import { ensureInitialized } from '@/lib/server-init';
import { logEvent } from '@/db/logger';

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const { status, priority, notes, deadline, comment } = await request.json();
  const adminName = auth.username;

  try {
    const targetProject = await getProject(id);
    if (!targetProject) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const changes: Record<string, unknown> = {};

    if (status && status !== targetProject.status) {
      targetProject.timeline.push({
        status: status as ProjectStatus,
        updatedAt: now,
        updatedBy: adminName,
        comment: comment || `Status updated from "${targetProject.status}" to "${status}".`,
      });
      targetProject.status = status as ProjectStatus;
      changes.status = status;
    }

    if (priority) {
      targetProject.priority = priority as ProjectPriority;
      changes.priority = priority;
    }

    if (notes !== undefined) {
      targetProject.notes = notes;
      changes.notesUpdated = true;
    }

    if (deadline) {
      targetProject.deadline = deadline;
      changes.deadline = deadline;
    }

    const updated = await saveProject(targetProject);
    logEvent('project.updated', { projectId: id, changes }, { actor: adminName });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logEvent('project.update_failed', { projectId: id, error: String(error) }, { level: 'error', actor: adminName });
    return NextResponse.json({ error: 'Failed to update project.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const adminName = auth.username;

  try {
    const deleted = await deleteProject(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    logEvent('project.deleted', { projectId: id, snapshot: deleted }, { actor: adminName });
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    logEvent('project.delete_failed', { projectId: id, error: String(error) }, { level: 'error', actor: adminName });
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
