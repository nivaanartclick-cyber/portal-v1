import { NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/server-init';
import { requireAdmin } from '@/lib/auth';
import { logEvent } from '@/db/logger';
import {
  getAllRevisions,
  nextRevisionId,
  createRevision,
  getProjectByTicketAndEmail,
  saveProject,
  uploadFileForRevision,
  isSupabaseConfigured,
} from '@/db/index';

export async function GET() {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const revisions = await getAllRevisions();
    return NextResponse.json({ data: revisions });
  } catch (error) {
    logEvent('revision.list_failed', { error: String(error) }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to fetch revisions.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureInitialized();
  const formData = await request.formData();

  const ticketId = String(formData.get('ticketId') || '').trim().toUpperCase();
  const email = String(formData.get('email') || '').trim();
  const clientName = String(formData.get('clientName') || '').trim();
  const revisionComments = String(formData.get('revisionComments') || '').trim();
  const additionalDetails = String(formData.get('additionalDetails') || '').trim();
  const googleDriveLink = String(formData.get('googleDriveLink') || '').trim();
  const file = formData.get('file');

  if (!email || !revisionComments) {
    return NextResponse.json({ error: 'Email and revision comments are required.' }, { status: 400 });
  }

  let projectId: string | undefined;
  let resolvedTicketId = ticketId;
  let linkedProject: Awaited<ReturnType<typeof getProjectByTicketAndEmail>> | null = null;

  if (ticketId) {
    linkedProject = await getProjectByTicketAndEmail(ticketId, email);
    if (!linkedProject) {
      return NextResponse.json(
        { error: 'Order not found or email does not match this ticket ID. Please verify both fields.' },
        { status: 404 }
      );
    }
    projectId = linkedProject.id;
  }

  try {
    const newId = await nextRevisionId();
    const now = new Date().toISOString();

    let storagePath = '';
    let resolvedFileName = '';

    if (file instanceof File && file.size > 0) {
      if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'File uploads require Supabase storage configuration.' }, { status: 503 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadFileForRevision(newId, projectId || null, file.name, buffer, file.type);
      storagePath = uploaded.storagePath;
      resolvedFileName = file.name;
    }

    const saved = await createRevision({
      id: newId,
      projectId,
      ticketId: resolvedTicketId,
      email,
      clientName,
      revisionComments,
      additionalDetails,
      uploadedFile: resolvedFileName,
      storagePath: storagePath || undefined,
      googleDriveLink,
      status: 'Pending',
      adminNotes: '',
      submissionDate: now,
    });

    if (projectId && linkedProject) {
        const updatedTimeline = [
          ...(linkedProject.timeline || []),
          {
            status: linkedProject.status,
            updatedAt: now,
            updatedBy: 'Client',
            comment: `Client submitted revision request ${newId}.`,
          },
        ];
        await saveProject({ ...linkedProject, timeline: updatedTimeline });
    }

    logEvent('revision.created', {
      revisionId: saved.id,
      projectId: saved.projectId || null,
      email: saved.email,
      hasFile: Boolean(storagePath),
    });

    void (async () => {
      try {
        const { sendRevisionConfirmationEmails } = await import('@/lib/email');
        const { resolveTeamDeadline } = await import('@/lib/deadline');
        const { value: teamDeadline, wasDefaulted: teamDeadlineWasDefaulted } = resolveTeamDeadline(
          '',
          saved.submissionDate
        );
        await sendRevisionConfirmationEmails({
          revisionId: saved.id,
          ticketId: saved.ticketId,
          projectId: saved.projectId,
          email: saved.email,
          clientName: saved.clientName,
          revisionComments: saved.revisionComments,
          additionalDetails: saved.additionalDetails,
          googleDriveLink: saved.googleDriveLink,
          submissionDate: saved.submissionDate,
          teamBudget: linkedProject?.budget,
          teamDeadline,
          teamDeadlineWasDefaulted,
        });
      } catch (emailError) {
        logEvent('email.revision_failed', { error: String(emailError), revisionId: saved.id }, { level: 'error' });
      }
    })();

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logEvent('revision.create_failed', { error: String(error) }, { level: 'error' });
    return NextResponse.json({ error: 'Failed to submit revision request.' }, { status: 500 });
  }
}
