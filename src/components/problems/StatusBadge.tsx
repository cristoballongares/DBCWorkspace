import type { ProblemStatus } from '@prisma/client';
import { Star, User, CircleDashed } from 'lucide-react';

const statusConfig = {
  UNSOLVED: { label: 'Pendiente', icon: CircleDashed, text: 'text-text-muted', bg: 'bg-transparent border-border-default' },
  SOLVED_INDIVIDUAL: { label: 'Individual', icon: User, text: 'text-link-focus', bg: 'bg-bg-elevated border-border-strong' },
  SOLVED_TEAM: { label: 'Equipo', icon: Star, text: 'text-yellow-500 fill-yellow-500', bg: 'bg-bg-elevated border-yellow-500/20' },
};

export function StatusBadge({ status }: { status: ProblemStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <div
      className={`inline-flex items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${config.bg} ${config.text}`}
      title={config.label}
    >
      <Icon className={`h-3.5 w-3.5 ${status === 'SOLVED_TEAM' ? 'fill-yellow-500' : ''}`} />
      <span className="sr-only md:not-sr-only">{config.label}</span>
    </div>
  );
}
