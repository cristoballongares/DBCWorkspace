import type { ProblemStatus } from '@prisma/client';

// SOLVED_INDIVIDUAL se mapea a amarillo (intentado/parcial): el equipo aun
// no tiene la solucion cubierta como conocimiento colectivo, aunque una
// persona ya la resolvio.
const statusConfig: Record<ProblemStatus, { label: string; className: string }> = {
  UNSOLVED: { label: 'Pendiente', className: 'bg-status-pending/20 text-status-pending' },
  SOLVED_INDIVIDUAL: { label: 'Individual', className: 'bg-status-attempted/20 text-status-attempted' },
  SOLVED_TEAM: { label: 'Equipo', className: 'bg-status-solved/20 text-status-solved' },
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
