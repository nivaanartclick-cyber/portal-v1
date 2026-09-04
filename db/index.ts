/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { Project } from '@/types';
import { ProjectRevision } from '@/types/revision';
import { SocialLinks, EMPTY_SOCIAL_LINKS } from '@/types/settings';
import { INITIAL_PROJECTS } from '@/data/mockData';
import { isSupabaseConfigured } from './supabase';
import * as supabaseProjects from './projects';
import * as supabaseSettings from './settings';
import * as supabaseRevisions from './revisions';

export type DataSource = 'supabase' | 'local_database';

const DB_PATH = path.join(process.cwd(), 'projects-db.json');
const REVISIONS_PATH = path.join(process.cwd(), 'revisions-db.json');
const SETTINGS_PATH = path.join(process.cwd(), 'settings-db.json');

export interface Settings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  businessHours: string;
  socialLinks: SocialLinks;
}

export function getDataSource(): DataSource {
  return isSupabaseConfigured() ? 'supabase' : 'local_database';
}

export async function initializeDataStore(): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabaseProjects.seedProjectsIfEmpty();
    await supabaseSettings.fetchSettings();
    console.log('Supabase connected — using cloud database and storage.');
    return;
  }

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_PROJECTS, null, 2), 'utf-8');
  }
  if (!fs.existsSync(REVISIONS_PATH)) {
    fs.writeFileSync(REVISIONS_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(SETTINGS_PATH)) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(supabaseSettings.DEFAULT_SETTINGS, null, 2), 'utf-8');
  }
  console.warn('Supabase not configured — falling back to local JSON files. Not suitable for production.');
}

function readLocalProjects(): Project[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local projects database:', error);
  }
  return INITIAL_PROJECTS;
}

function writeLocalProjects(projects: Project[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), 'utf-8');
}

function readLocalRevisions(): ProjectRevision[] {
  try {
    if (fs.existsSync(REVISIONS_PATH)) {
      return JSON.parse(fs.readFileSync(REVISIONS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local revisions database:', error);
  }
  return [];
}

function writeLocalRevisions(revisions: ProjectRevision[]) {
  fs.writeFileSync(REVISIONS_PATH, JSON.stringify(revisions, null, 2), 'utf-8');
}

function readLocalSettings(): Settings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
      return {
        ...supabaseSettings.DEFAULT_SETTINGS,
        ...parsed,
        socialLinks: parsed.socialLinks || { ...EMPTY_SOCIAL_LINKS },
      };
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
  }
  return supabaseSettings.DEFAULT_SETTINGS;
}

function writeLocalSettings(settings: Settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

function generateLocalRevisionId(revisions: ProjectRevision[]): string {
  const nums = revisions.map((r) => {
    const match = r.id.match(/REV-(\d+)/);
    return match ? parseInt(match[1], 10) : 1000;
  });
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1001;
  return `REV-${next}`;
}

export async function getAllProjects(): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    return supabaseProjects.fetchAllProjects();
  }
  return readLocalProjects();
}

export async function replaceAllProjects(projects: Project[]): Promise<void> {
  if (isSupabaseConfigured()) {
    await supabaseProjects.replaceAllProjects(projects);
    return;
  }
  writeLocalProjects(projects);
}

export async function getProject(id: string): Promise<Project | null> {
  if (isSupabaseConfigured()) {
    return supabaseProjects.getProjectById(id);
  }
  return readLocalProjects().find((p) => p.id === id) || null;
}

export async function getProjectByTicketAndEmail(
  ticketId: string,
  email: string
): Promise<Project | null> {
  const project = await getProject(ticketId.trim().toUpperCase());
  if (!project) return null;
  if (project.email.toLowerCase() !== email.trim().toLowerCase()) return null;
  return project;
}

export async function createProject(project: Project): Promise<Project> {
  if (isSupabaseConfigured()) {
    return supabaseProjects.insertProject(project);
  }
  const projects = readLocalProjects();
  projects.unshift(project);
  writeLocalProjects(projects);
  return project;
}

export async function saveProject(project: Project): Promise<Project> {
  if (isSupabaseConfigured()) {
    return supabaseProjects.updateProjectById(project.id, project);
  }
  const projects = readLocalProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index === -1) {
    throw new Error('Project not found.');
  }
  projects[index] = project;
  writeLocalProjects(projects);
  return project;
}

export async function nextProjectId(): Promise<string> {
  if (isSupabaseConfigured()) {
    return supabaseProjects.generateNextProjectId();
  }
  const projects = readLocalProjects();
  const projectNumbers = projects.map((p) => {
    const match = p.id.match(/HAS-(\d+)/);
    return match ? parseInt(match[1], 10) : 8100;
  });
  const nextIdNum = projectNumbers.length > 0 ? Math.max(...projectNumbers) + 1 : 8107;
  return `HAS-${nextIdNum}`;
}

export async function getSettings(): Promise<Settings> {
  if (isSupabaseConfigured()) {
    return supabaseSettings.fetchSettings();
  }
  return readLocalSettings();
}

export async function saveSettings(settings: Settings): Promise<Settings> {
  if (isSupabaseConfigured()) {
    return supabaseSettings.updateSettings(settings);
  }
  writeLocalSettings(settings);
  return settings;
}

export async function uploadFileForProject(
  projectId: string,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ storagePath: string; fileUrl: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('File storage requires Supabase configuration.');
  }
  return supabaseProjects.uploadProjectFile(projectId, fileName, buffer, mimeType);
}

export async function uploadFileForRevision(
  revisionId: string,
  projectId: string | null,
  fileName: string,
  buffer: Buffer,
  mimeType: string
): Promise<{ storagePath: string; fileUrl: string }> {
  if (!isSupabaseConfigured()) {
    throw new Error('File storage requires Supabase configuration.');
  }
  return supabaseRevisions.uploadRevisionFile(revisionId, projectId, fileName, buffer, mimeType);
}

export async function deleteProject(id: string): Promise<Project | null> {
  const existing = await getProject(id);
  if (!existing) {
    return null;
  }

  if (isSupabaseConfigured()) {
    if (existing.storagePath) {
      try {
        await supabaseProjects.deleteProjectFile(existing.storagePath);
      } catch (error) {
        console.error('Failed to delete storage file:', error);
      }
    }
    await supabaseProjects.deleteProjectById(id);
  } else {
    const projects = readLocalProjects().filter((p) => p.id !== id);
    writeLocalProjects(projects);
  }

  return existing;
}

export async function getSignedProjectFileUrl(storagePath: string): Promise<string> {
  return supabaseProjects.getSignedFileUrl(storagePath);
}

export async function getSignedRevisionFileUrl(storagePath: string): Promise<string> {
  return supabaseRevisions.getSignedRevisionFileUrl(storagePath);
}

export async function getAllRevisions(): Promise<ProjectRevision[]> {
  if (isSupabaseConfigured()) {
    return supabaseRevisions.fetchAllRevisions();
  }
  return readLocalRevisions();
}

export async function getRevision(id: string): Promise<ProjectRevision | null> {
  if (isSupabaseConfigured()) {
    return supabaseRevisions.getRevisionById(id);
  }
  return readLocalRevisions().find((r) => r.id === id) || null;
}

export async function createRevision(revision: ProjectRevision): Promise<ProjectRevision> {
  if (isSupabaseConfigured()) {
    return supabaseRevisions.insertRevision(revision);
  }
  const revisions = readLocalRevisions();
  revisions.unshift(revision);
  writeLocalRevisions(revisions);
  return revision;
}

export async function saveRevision(revision: ProjectRevision): Promise<ProjectRevision> {
  if (isSupabaseConfigured()) {
    return supabaseRevisions.updateRevisionById(revision.id, revision);
  }
  const revisions = readLocalRevisions();
  const index = revisions.findIndex((r) => r.id === revision.id);
  if (index === -1) {
    throw new Error('Revision not found.');
  }
  revisions[index] = revision;
  writeLocalRevisions(revisions);
  return revision;
}

export async function nextRevisionId(): Promise<string> {
  if (isSupabaseConfigured()) {
    return supabaseRevisions.generateNextRevisionId();
  }
  return generateLocalRevisionId(readLocalRevisions());
}

export { isSupabaseConfigured };
