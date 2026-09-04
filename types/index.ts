/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectStatus =
  | 'Todo'
  | 'Review'
  | 'In Progress'
  | 'Waiting Client'
  | 'Completed'
  | 'Delivered'
  | 'Cancelled';

export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Project {
  id: string;
  clientName: string;
  companyName?: string;
  email: string;
  phone?: string;
  serviceRequired: string;
  projectDescription: string;
  deadline: string; // ISO date format (YYYY-MM-DD)
  budget?: string;
  uploadedFile?: string; // filename or url
  storagePath?: string; // Supabase storage object path
  fileUrl?: string; // signed download URL
  googleDriveLink?: string;
  additionalNotes?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  submissionDate: string; // ISO date-time format
  notes?: string; // Admin notes
  timeline: {
    status: ProjectStatus;
    updatedAt: string;
    updatedBy: string;
    comment?: string;
  }[];
}

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  turnaround: string;
  imagePlaceholder: string; // Tailwind bg color class or prompt-like indicator
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface AnalyticsSummary {
  totalProjects: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  revenuePlaceholder: number;
  projectsPerMonth: { month: string; count: number }[];
  serviceDistribution: { name: string; value: number }[];
  statusDistribution: { name: string; value: number }[];
  completionRate: number; // percentage
  recentActivities: {
    id: string;
    projectId: string;
    clientName: string;
    type: 'status_change' | 'new_submission' | 'note_added';
    description: string;
    timestamp: string;
  }[];
}
