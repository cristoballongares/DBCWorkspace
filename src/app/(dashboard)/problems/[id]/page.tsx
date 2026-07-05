import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { TagPill } from '@/components/problems/TagPill';
import { Button } from '@/components/ui/Button';
import { DeleteProblemButton } from '@/components/problems/DeleteProblemButton';

export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const problem = await getProblem(params.id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">{problem.title}</h1>
        <div className="flex gap-2">
          <Link href={`/problems/${problem.id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <DeleteProblemButton problemId={problem.id} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DifficultyBadge difficulty={problem.difficulty} />
        <StatusBadge status={problem.status} />
        {problem.source && <span className="text-sm text-text-muted">{problem.source}</span>}
      </div>

      <div className="flex flex-wrap gap-1">
        {problem.tags.map(({ tag }) => (
          <TagPill key={tag.id} name={tag.name} />
        ))}
      </div>

      {problem.url && (
        <a href={problem.url} target="_blank" rel="noreferrer" className="text-sm text-link-focus">
          {problem.url}
        </a>
      )}

      {problem.statementNotes && (
        <p className="whitespace-pre-wrap text-sm text-text-secondary">{problem.statementNotes}</p>
      )}
    </div>
  );
}
