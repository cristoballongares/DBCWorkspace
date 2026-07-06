import Link from 'next/link';
import { MarkdownContent } from '@/components/editor/MarkdownContent';
import { Button } from '@/components/ui/Button';
import { DeleteSolutionButton } from './DeleteSolutionButton';

type SolutionCardData = {
  id: string;
  content: string;
  reasoning: string | null;
  timeSpentMin: number | null;
  attemptCount: number;
  author: { id: string; name: string } | null;
};

export function SolutionCard({ solution }: { solution: SolutionCardData }) {
  return (
    <div className="space-y-3 rounded-md border border-border-default bg-bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">{solution.author?.name ?? "Usuario eliminado"}</span>
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

      <MarkdownContent source={solution.content} />

      {solution.reasoning && (
        <p className="whitespace-pre-wrap text-sm text-text-secondary">{solution.reasoning}</p>
      )}
    </div>
  );
}
