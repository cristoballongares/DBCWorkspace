import Link from 'next/link';
import { RichContent } from '@/components/editor/RichContent';
import { Button } from '@/components/ui/Button';
import { DeleteSolutionButton } from './DeleteSolutionButton';

type SolutionCardData = {
  id: string;
  content: string;
  reasoning: string | null;
  timeSpentMin: number | null;
  attemptCount: number;
  author: { id: string; name: string };
};

export function SolutionCard({ solution }: { solution: SolutionCardData }) {
  return (
    <div className="space-y-3 rounded-md border border-border-default bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{solution.author.name}</span>
          {' · '}
          {solution.attemptCount} intento{solution.attemptCount === 1 ? '' : 's'}
          {solution.timeSpentMin ? ` · ${solution.timeSpentMin} min` : ''}
        </div>
        <div className="flex gap-2">
          <Link href={`/solutions/${solution.id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <DeleteSolutionButton solutionId={solution.id} />
        </div>
      </div>

      <RichContent html={solution.content} />

      {solution.reasoning && (
        <p className="whitespace-pre-wrap text-sm text-text-secondary">{solution.reasoning}</p>
      )}
    </div>
  );
}
