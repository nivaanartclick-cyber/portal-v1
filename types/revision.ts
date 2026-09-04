/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RevisionStatus =
  | 'Pending'
  | 'Reviewing'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface ProjectRevision {
  id: string;
  projectId?: string;
  ticketId: string;
  email: string;
  clientName: string;
  revisionComments: string;
  additionalDetails: string;
  uploadedFile?: string;
  storagePath?: string;
  googleDriveLink?: string;
  status: RevisionStatus;
  adminNotes: string;
  submissionDate: string;
}

export interface RevisionUpdateInput {
  status?: RevisionStatus;
  adminNotes?: string;
  projectId?: string | null;
}
