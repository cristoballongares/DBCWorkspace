import type { Difficulty } from '@prisma/client';

const difficultyLabel: Record<Difficulty, string> = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
  UNRATED: 'Unrated',
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="rounded-sm border border-border-default px-2 py-0.5 font-mono text-xs text-text-secondary">
      {difficultyLabel[difficulty]}
    </span>
  );
}
