/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseAdmin, STORAGE_BUCKET } from './supabase';
import { ProjectRevision, RevisionStatus } from '@/types/revision';

interface RevisionRow {
  id: string;
  project_id: string | null;
  ticket_id: string;
  email: string;
  client_name: string;
  revision_comments: string;
  additional_details: string;
  uploaded_file: string;
  storage_path: string;
  google_drive_link: string;
  status: RevisionStatus;
  admin_notes: string;
  submission_date: string;
}

function rowToRevision(row: RevisionRow): ProjectRevision {
  return {
    id: row.id,
    projectId: row.project_id || undefined,
    ticketId: row.ticket_id,
    email: row.email,
    clientName: row.client_name,
    revisionComments: row.revision_comments,
    additionalDetails: row.additional_details,
    uploadedFile: row.uploaded_file || undefined,
    storagePath: row.storage_path || undefined,
    googleDriveLink: row.google_drive_link || undefined,
    status: row.status,
    adminNotes: row.admin_notes,
    submissionDate: row.submission_date,
  };
}

function revisionToRow(revision: ProjectRevision): RevisionRow {
  return {
    id: revision.id,
    project_id: revision.projectId || null,
    ticket_id: revision.ticketId,
    email: revision.email,
    client_name: revision.clientName,
    revision_comments: revision.revisionComments,
    additional_details: revision.additionalDetails,
    uploaded_file: revision.uploadedFile || '',
    storage_path: revision.storagePath || '',
    google_drive_link: revision.googleDriveLink || '',
    status: revision.status,
    admin_notes: revision.adminNotes,
    submission_date: revision.submissionDate,
  };
}

export async function generateNextRevisionId(): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('project_revisions')
    .select('id')
    .order('submission_date', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to generate revision id: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return 'REV-1001';
  }

  const match = (data[0] as { id: string }).id.match(/REV-(\d+)/);
  const num = match ? parseInt(match[1], 10) + 1 : 1001;
  return `REV-${num}`;
}

export async function fetchAllRevisions(): Promise<ProjectRevision[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('project_revisions')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch revisions: ${error.message}`);
  }

  return (data as RevisionRow[]).map(rowToRevision);
}

export async function getRevisionById(id: string): Promise<ProjectRevision | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('project_revisions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch revision: ${error.message}`);
  }

  return data ? rowToRevision(data as RevisionRow) : null;
}

export async function insertRevision(revision: ProjectRevision): Promise<ProjectRevision> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('project_revisions')
    .insert(revisionToRow(revision))
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to insert revision: ${error.message}`);
  }

  return rowToRevision(data as RevisionRow);
}

export async function updateRevisionById(
  id: string,
  updates: Partial<ProjectRevision>
): Promise<ProjectRevision> {
  const supabase = getSupabaseAdmin();
  const existing = await getRevisionById(id);
  if (!existing) {
    throw new Error('Revision not found.');
  }

  const merged: ProjectRevision = { ...existing, ...updates, id };
  const { data, error } = await supabase
    .from('project_revisions')
    .update(revisionToRow(merged))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update revision: ${error.message}`);
  }

  return rowToRevision(data as RevisionRow);
}

export async function uploadRevisionFile(
  revisionId: string,
  projectId: string | null,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ storagePath: string; fileUrl: string }> {
  const supabase = getSupabaseAdmin();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const prefix = projectId ? `${projectId}/revisions` : `unlinked/${revisionId}`;
  const storagePath = `${prefix}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload revision file: ${uploadError.message}`);
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  if (signError || !signed?.signedUrl) {
    throw new Error(`Failed to create revision file URL: ${signError?.message || 'Unknown error'}`);
  }

  return { storagePath, fileUrl: signed.signedUrl };
}

export async function getSignedRevisionFileUrl(
  storagePath: string,
  expiresInSeconds = 3600
): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to sign revision file URL: ${error?.message || 'Unknown error'}`);
  }

  return data.signedUrl;
}
