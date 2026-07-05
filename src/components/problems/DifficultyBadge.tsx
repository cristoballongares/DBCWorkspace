import type { Difficulty } from '@prisma/client';

const difficultyConfig: Record<Difficulty, { label: string; style: string }> = {
  EASY: { label: 'Easy', style: 'text-cyan-400 bg-cyan-950/50 border border-cyan-800' },
  MEDIUM: { label: 'Medium', style: 'text-blue-400 bg-blue-950/50 border border-blue-800' },
  HARD: { label: 'Hard', style: 'text-orange-400 bg-orange-950/50 border border-orange-800' },
  UNRATED: { label: 'Unrated', style: 'text-slate-400 bg-slate-800/50 border border-slate-700' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty];
  return (
    <span className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-mono font-medium ${config.style}`}>
      {config.label}
    </span>
  );
}
