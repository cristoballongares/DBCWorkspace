import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { listSolutionsByProblem } from '@/services/solution.service';
import { getEditorialByProblem } from '@/services/editorial.service';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { TagPill } from '@/components/problems/TagPill';
import { Button } from '@/components/ui/Button';
import { DeleteProblemButton } from '@/components/problems/DeleteProblemButton';
import { SolutionCard } from '@/components/solutions/SolutionCard';
import { DeleteEditorialButton } from '@/components/editorials/DeleteEditorialButton';
import { RichContent } from '@/components/editor/RichContent';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const problem = await getProblem(params.id);

  if (!problem) {
    notFound();
  }

  const solutions = await listSolutionsByProblem(problem.id);
  const editorial = await getEditorialByProblem(problem.id);

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: 'Problemas', href: '/problems' }, { label: problem.title }]} />

      <div className="rounded-md border border-border-default bg-bg-surface p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-text-primary">{problem.title}</h1>
          <div className="flex gap-2">
            <Link href={`/problems/${problem.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            <DeleteProblemButton problemId={problem.id} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <StatusBadge status={problem.status} />
          {problem.source && <span className="text-sm text-text-muted">{problem.source}</span>}
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {problem.tags.map(({ tag }) => (
            <TagPill key={tag.id} name={tag.name} />
          ))}
        </div>

        {problem.url && (
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-sm text-link-focus"
          >
            {problem.url}
          </a>
        )}

        {problem.statementNotes && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-text-secondary">
            {problem.statementNotes}
          </p>
        )}
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Soluciones</h2>
          <Link href={`/problems/${problem.id}/solutions/new`}>
            <Button variant="secondary">Agregar solucion</Button>
          </Link>
        </div>

        {solutions.length === 0 && (
          <p className="text-sm text-text-muted">Todavia no hay soluciones registradas.</p>
        )}

        <div className="space-y-3">
          {solutions.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Editorial</h2>
          <div className="flex gap-2">
            <Link href={`/problems/${problem.id}/editorial/edit`}>
              <Button variant="secondary">{editorial ? 'Editar editorial' : 'Agregar editorial'}</Button>
            </Link>
            {editorial && <DeleteEditorialButton problemId={problem.id} />}
          </div>
        </div>

        {editorial ? (
          <div className="space-y-2 rounded-md border border-border-default bg-bg-surface p-4">
            <p className="text-sm text-text-secondary">{editorial.author.name}</p>
            <RichContent html={editorial.content} />
          </div>
        ) : (
          <p className="text-sm text-text-muted">Todavia no hay editorial para este problema.</p>
        )}
      </div>
    </div>
  );
}
