/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSupabaseAdmin, STORAGE_BUCKET } from './supabase';
import { Project, ProjectStatus, ProjectPriority } from '@/types';
import { INITIAL_PROJECTS } from '@/data/mockData';

interface ProjectRow {
  id: string;
  client_name: string;
  company_name: string;
  email: string;
  phone: string;
  service_required: string;
  project_description: string;
  deadline: string;
  budget: string;
  uploaded_file: string;
  storage_path: string;
  file_url: string;
  google_drive_link: string;
  additional_notes: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  submission_date: string;
  notes: string;
  timeline: Project['timeline'];
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    clientName: row.client_name,
    companyName: row.company_name,
    email: row.email,
    phone: row.phone,
    serviceRequired: row.service_required,
    projectDescription: row.project_description,
    deadline: row.deadline,
    budget: row.budget,
    uploadedFile: row.uploaded_file,
    googleDriveLink: row.google_drive_link,
    additionalNotes: row.additional_notes,
    status: row.status,
    priority: row.priority,
    submissionDate: row.submission_date,
    notes: row.notes,
    timeline: row.timeline || [],
    storagePath: row.storage_path || undefined,
    fileUrl: row.file_url || undefined,
  };
}

function projectToRow(project: Project): ProjectRow {
  return {
    id: project.id,
    client_name: project.clientName,
    company_name: project.companyName || '',
    email: project.email,
    phone: project.phone || '',
    service_required: project.serviceRequired,
    project_description: project.projectDescription,
    deadline: project.deadline,
    budget: project.budget || '',
    uploaded_file: project.uploadedFile || '',
    storage_path: project.storagePath || '',
    file_url: project.fileUrl || '',
    google_drive_link: project.googleDriveLink || '',
    additional_notes: project.additionalNotes || '',
    status: project.status,
    priority: project.priority,
    submission_date: project.submissionDate,
    notes: project.notes || '',
    timeline: project.timeline || [],
  };
}

export async function fetchAllProjects(): Promise<Project[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('submission_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  return (data as ProjectRow[]).map(rowToProject);
}

export async function seedProjectsIfEmpty(): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { count, error: countError } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    throw new Error(`Failed to check projects table: ${countError.message}`);
  }

  if ((count ?? 0) > 0) {
    return;
  }

  const rows = INITIAL_PROJECTS.map(projectToRow);
  const { error } = await supabase.from('projects').insert(rows);
  if (error) {
    throw new Error(`Failed to seed projects: ${error.message}`);
  }
}

export async function generateNextProjectId(): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Failed to generate project id: ${error.message}`);
  }

  const projectNumbers = (data || []).map((row) => {
    const match = row.id.match(/HAS-(\d+)/);
    return match ? parseInt(match[1], 10) : 8100;
  });

  const nextIdNum = projectNumbers.length > 0 ? Math.max(...projectNumbers) + 1 : 8107;
  return `HAS-${nextIdNum}`;
}

export async function insertProject(project: Project): Promise<Project> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .insert(projectToRow(project))
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to insert project: ${error.message}`);
  }

  return rowToProject(data as ProjectRow);
}

export async function updateProjectById(id: string, project: Project): Promise<Project> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('projects')
    .update(projectToRow(project))
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`);
  }

  return rowToProject(data as ProjectRow);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  return data ? rowToProject(data as ProjectRow) : null;
}

export async function uploadProjectFile(
  projectId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ storagePath: string; fileUrl: string }> {
  const supabase = getSupabaseAdmin();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${projectId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: mimeType || 'application/octet-stream',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365);

  if (signError || !signed?.signedUrl) {
    throw new Error(`Failed to create file URL: ${signError?.message || 'Unknown error'}`);
  }

  return { storagePath, fileUrl: signed.signedUrl };
}

export async function getSignedFileUrl(storagePath: string, expiresInSeconds = 3600): Promise<string> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to sign file URL: ${error?.message || 'Unknown error'}`);
  }

  return data.signedUrl;
}

export async function deleteProjectById(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

export async function deleteProjectFile(storagePath: string): Promise<void> {
  if (!storagePath) return;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
  if (error) {
    throw new Error(`Failed to delete project file: ${error.message}`);
  }
}

export async function replaceAllProjects(projects: Project[]): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error: deleteError } = await supabase.from('projects').delete().neq('id', '');
  if (deleteError) {
    throw new Error(`Failed to clear projects: ${deleteError.message}`);
  }

  if (projects.length === 0) {
    return;
  }

  const { error } = await supabase.from('projects').insert(projects.map(projectToRow));
  if (error) {
    throw new Error(`Failed to bulk insert projects: ${error.message}`);
  }
}
