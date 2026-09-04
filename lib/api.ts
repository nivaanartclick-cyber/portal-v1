/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ProjectStatus, ProjectPriority } from '@/types';
import { ProjectRevision, RevisionUpdateInput } from '@/types/revision';
import { SocialLinks } from '@/types/settings';

const fetchOpts: RequestInit = { credentials: 'include' };

export interface AuthStatusResponse {
  authenticated: boolean;
  username?: string;
}

export interface SettingsResponse {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: string;
  socialLinks: SocialLinks;
  supabaseConnected: boolean;
}

export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      ...fetchOpts,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: data.error || 'Invalid credentials' };
  } catch {
    return { success: false, error: 'Network error occurred during login.' };
  }
}

export async function logoutAdmin(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/logout', { ...fetchOpts, method: 'POST' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const res = await fetch('/api/auth/status', fetchOpts);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error('Failed to verify auth status:', e);
  }
  return { authenticated: false };
}

export async function getProjects(): Promise<{ data: Project[]; source: string }> {
  try {
    const res = await fetch('/api/projects', fetchOpts);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
  return { data: [], source: 'error_fallback' };
}

export async function submitProject(
  projectData: Record<string, string>,
  file?: File | null
): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const formData = new FormData();
    Object.entries(projectData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (file) {
      formData.append('file', file);
    }

    const res = await fetch('/api/projects', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Failed to submit project' };
  } catch {
    return { success: false, error: 'Network error during project submission.' };
  }
}

export async function submitRevision(
  revisionData: Record<string, string>,
  file?: File | null
): Promise<{ success: boolean; data?: ProjectRevision; error?: string }> {
  try {
    const formData = new FormData();
    Object.entries(revisionData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });
    if (file) {
      formData.append('file', file);
    }

    const res = await fetch('/api/revisions', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Failed to submit revision' };
  } catch {
    return { success: false, error: 'Network error during revision submission.' };
  }
}

export async function getRevisions(): Promise<{ data: ProjectRevision[] }> {
  try {
    const res = await fetch('/api/revisions', fetchOpts);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch revisions:', error);
  }
  return { data: [] };
}

export async function updateRevision(
  id: string,
  updateData: RevisionUpdateInput
): Promise<{ success: boolean; data?: ProjectRevision; error?: string }> {
  try {
    const res = await fetch(`/api/revisions/${id}`, {
      ...fetchOpts,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Failed to update revision' };
  } catch {
    return { success: false, error: 'Network error during revision update.' };
  }
}

export async function getRevisionFileUrl(revisionId: string): Promise<{ url: string; fileName: string } | null> {
  try {
    const res = await fetch(`/api/revisions/${revisionId}/file`, fetchOpts);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch revision file URL:', error);
  }
  return null;
}

export async function getProjectFileUrl(projectId: string): Promise<{ url: string; fileName: string } | null> {
  try {
    const res = await fetch(`/api/projects/${projectId}/file`, fetchOpts);
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch project file URL:', error);
  }
  return null;
}

export interface ProjectUpdateInput {
  status?: ProjectStatus;
  priority?: ProjectPriority;
  notes?: string;
  deadline?: string;
  comment?: string;
}

export async function updateProject(id: string, updateData: ProjectUpdateInput): Promise<{ success: boolean; data?: Project; error?: string }> {
  try {
    const res = await fetch(`/api/projects/${id}`, {
      ...fetchOpts,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.error || 'Failed to update project' };
  } catch {
    return { success: false, error: 'Network error during project update.' };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/projects/${id}`, { ...fetchOpts, method: 'DELETE' });
    const data = await res.json();
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: data.error || 'Failed to delete project' };
  } catch {
    return { success: false, error: 'Network error during project deletion.' };
  }
}

export async function getSettings(): Promise<SettingsResponse | null> {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        socialLinks: data.socialLinks || {},
      };
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }
  return null;
}

export async function updateSettings(settings: Partial<SettingsResponse>): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/settings', {
      ...fetchOpts,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      return { success: true };
    }
    const data = await res.json();
    return { success: false, error: data.error || 'Failed to update settings' };
  } catch {
    return { success: false, error: 'Network error during settings update.' };
  }
}

export async function submitContact(data: {
  fullName: string;
  emailAddress: string;
  subjectTitle: string;
  messageBody: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: json.error || 'Failed to send message' };
  } catch {
    return { success: false, error: 'Network error while sending message.' };
  }
}

export async function downloadServerLogs(): Promise<void> {
  const res = await fetch('/api/admin/logs', fetchOpts);
  if (!res.ok) {
    throw new Error('Failed to download logs');
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `artclick-logs-${new Date().toISOString().slice(0, 10)}.log`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
