import type { Difficulty } from '@prisma/client';

const difficultyConfig: Record<Difficulty, { label: string; text: string }> = {
  EASY: { label: 'Easy', text: 'text-rating-easy' },
  MEDIUM: { label: 'Medium', text: 'text-rating-medium' },
  HARD: { label: 'Hard', text: 'text-rating-hard' },
  UNRATED: { label: 'Unrated', text: 'text-rating-unrated' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty];
  return (
    <span className={`font-mono text-xs font-semibold ${config.text}`}>{config.label}</span>
  );
}
