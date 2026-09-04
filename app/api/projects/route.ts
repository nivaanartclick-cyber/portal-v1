import { NextResponse } from 'next/server';
import { getAllProjects, getDataSource } from '@/db/index';
import { ensureInitialized } from '@/lib/server-init';
import { requireAdmin } from '@/lib/auth';
import { logEvent } from '@/db/logger';
import { resolveTeamDeadline } from '@/lib/deadline';

export async function GET() {
  await ensureInitialized();
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const projects = await getAllProjects();
    return NextResponse.json({ source: getDataSource(), data: projects });
  } catch (error) {
    logEvent('project.list_failed', { error: String(error) }, { level: 'error', actor: auth.username });
    return NextResponse.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await ensureInitialized();
  const formData = await request.formData();

  const clientName = String(formData.get('clientName') || '');
  const companyName = String(formData.get('companyName') || '');
  const email = String(formData.get('email') || '');
  const phone = String(formData.get('phone') || '');
  const serviceRequired = String(formData.get('serviceRequired') || '');
  const projectDescription = String(formData.get('projectDescription') || '');
  const deadline = String(formData.get('deadline') || '');
  const budget = String(formData.get('budget') || '');
  const uploadedFile = String(formData.get('uploadedFile') || '');
  const googleDriveLink = String(formData.get('googleDriveLink') || '');
  const additionalNotes = String(formData.get('additionalNotes') || '');
  const file = formData.get('file');

  if (!clientName || !email || !serviceRequired || !projectDescription) {
    return NextResponse.json({ error: 'Missing required project details.' }, { status: 400 });
  }

  try {
    const { nextProjectId, createProject, uploadFileForProject, isSupabaseConfigured } = await import('@/db/index');
    const newId = await nextProjectId();
    const now = new Date().toISOString();
    const { value: resolvedDeadline, wasDefaulted: deadlineWasDefaulted } = resolveTeamDeadline(deadline, now);

    let storagePath = '';
    let fileUrl = '';
    let resolvedFileName = uploadedFile || '';

    if (file instanceof File && file.size > 0) {
      if (!isSupabaseConfigured()) {
        return NextResponse.json({ error: 'File uploads require Supabase storage configuration.' }, { status: 503 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadFileForProject(newId, file.name, buffer, file.type);
      storagePath = uploaded.storagePath;
      fileUrl = uploaded.fileUrl;
      resolvedFileName = file.name;
    }

    const saved = await createProject({
      id: newId,
      clientName,
      companyName: companyName || '',
      email,
      phone: phone || '',
      serviceRequired,
      projectDescription,
      deadline: resolvedDeadline,
      budget: budget || '',
      uploadedFile: resolvedFileName || 'direct_submission.zip',
      storagePath: storagePath || undefined,
      fileUrl: fileUrl || undefined,
      googleDriveLink: googleDriveLink || '',
      additionalNotes: additionalNotes || '',
      status: 'Todo',
      priority: 'Medium',
      submissionDate: now,
      notes: '',
      timeline: [
        {
          status: 'Todo',
          updatedAt: now,
          updatedBy: 'System',
          comment: 'Project files and details successfully submitted via intake form.',
        },
      ],
    });

    logEvent('project.created', {
      projectId: saved.id,
      clientName: saved.clientName,
      email: saved.email,
      serviceRequired: saved.serviceRequired,
      hasFile: Boolean(storagePath),
    });

    void (async () => {
      try {
        const { sendOrderConfirmationEmails } = await import('@/lib/email');
        await sendOrderConfirmationEmails({
          ticketId: saved.id,
          clientName: saved.clientName,
          email: saved.email,
          companyName: saved.companyName,
          phone: saved.phone,
          serviceRequired: saved.serviceRequired,
          projectDescription: saved.projectDescription,
          deadline: saved.deadline,
          budget: saved.budget,
          googleDriveLink: saved.googleDriveLink,
          additionalNotes: saved.additionalNotes,
          submissionDate: saved.submissionDate,
          deadlineWasDefaulted,
        });
      } catch (emailError) {
        logEvent('email.order_failed', { error: String(emailError), projectId: saved.id }, { level: 'error' });
      }
    })();

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    logEvent('project.create_failed', { error: String(error) }, { level: 'error' });
    return NextResponse.json({ error: 'Failed to submit project.' }, { status: 500 });
  }
}
