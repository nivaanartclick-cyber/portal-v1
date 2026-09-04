/** Default turnaround window for the team when no deadline is submitted (1.5 days). */
const DEFAULT_DEADLINE_MS = 1.5 * 24 * 60 * 60 * 1000;

export function resolveTeamDeadline(deadline: string | undefined, submissionDate: string): {
  value: string;
  wasDefaulted: boolean;
} {
  const trimmed = deadline?.trim();
  if (trimmed) {
    return { value: trimmed, wasDefaulted: false };
  }

  const dueAt = new Date(submissionDate);
  dueAt.setTime(dueAt.getTime() + DEFAULT_DEADLINE_MS);
  return { value: dueAt.toISOString(), wasDefaulted: true };
}

export function formatDeadlineForEmail(deadline: string, wasDefaulted: boolean): string {
  const trimmed = deadline.trim();
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
  const parsed = dateOnly ? new Date(`${trimmed}T12:00:00`) : new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return deadline;
  }

  const formatted =
    dateOnly && !wasDefaulted
      ? parsed.toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : parsed.toLocaleString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

  return wasDefaulted ? `${formatted} (default: 1.5 days from submission)` : formatted;
}
