import type { ProblemStatus } from '@prisma/client';

// SOLVED_INDIVIDUAL se mapea a amarillo (intentado/parcial): el equipo aun
// no tiene la solucion cubierta como conocimiento colectivo, aunque una
// persona ya la resolvio.
const statusConfig: Record<ProblemStatus, { label: string; dot: string; text: string }> = {
  UNSOLVED: { label: 'Pendiente', dot: 'bg-status-pending', text: 'text-status-pending' },
  SOLVED_INDIVIDUAL: { label: 'Individual', dot: 'bg-status-attempted', text: 'text-status-attempted' },
  SOLVED_TEAM: { label: 'Equipo', dot: 'bg-status-solved', text: 'text-status-solved' },
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border-default bg-bg-elevated px-2 py-0.5 text-xs font-medium ${config.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
}
