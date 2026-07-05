import Link from 'next/link';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import { StatusBadge } from './StatusBadge';
import { DifficultyBadge } from './DifficultyBadge';
import { TagPill } from './TagPill';

type ProblemCardData = {
  id: string;
  title: string;
  source: string | null;
  difficulty: Difficulty;
  status: ProblemStatus;
  tags: { tag: { id: string; name: string } }[];
};

export function ProblemCard({ problem }: { problem: ProblemCardData }) {
  return (
    <Link
      href={`/problems/${problem.id}`}
      className="flex items-center justify-between rounded-md border border-border-default bg-bg-surface px-4 py-3 hover:border-border-strong"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{problem.title}</span>
          {problem.source && <span className="text-xs text-text-muted">{problem.source}</span>}
        </div>
        <div className="flex flex-wrap gap-1">
          {problem.tags.map(({ tag }) => (
            <TagPill key={tag.id} name={tag.name} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <StatusBadge status={problem.status} />
      </div>
    </Link>
  );
}
