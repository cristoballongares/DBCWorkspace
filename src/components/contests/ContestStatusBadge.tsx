import type { ContestStatus } from '@prisma/client';

const statusConfig: Record<ContestStatus, { label: string; text: string }> = {
  SCHEDULED: { label: 'Programado', text: 'text-text-secondary' },
  RUNNING: { label: 'En curso', text: 'text-status-solved' },
  FROZEN: { label: 'Congelado', text: 'text-status-attempted' },
  FINISHED: { label: 'Finalizado', text: 'text-text-muted' },
};

export function ContestStatusBadge({ status }: { status: ContestStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border-default bg-bg-elevated px-2 py-0.5 text-xs font-medium ${config.text}`}
    >
      {config.label}
    </span>
  );
}
