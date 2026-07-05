import { Suspense } from 'react';
import Link from 'next/link';
import { listProblems, listTags } from '@/services/problem.service';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { TagPill } from '@/components/problems/TagPill';
import { Button } from '@/components/ui/Button';
import { TableFilters } from '@/components/problems/TableFilters';

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: { q?: string; tag?: string; difficulty?: string; status?: string };
}) {
  const { q, tag, difficulty, status } = searchParams;
  const [problems, tags] = await Promise.all([
    listProblems({ q, tag, difficulty, status }),
    listTags(),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Problemas</h1>
        <Link href="/problems/new">
          <Button>Nuevo problema</Button>
        </Link>
      </div>

      <Suspense fallback={<div className="h-20 w-full animate-pulse rounded-md bg-bg-surface" />}>
        <TableFilters tags={tags} />
      </Suspense>

      {problems.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay problemas registrados.</p>
      ) : (
        <div className="rounded-md border border-border-default bg-bg-surface overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap md:whitespace-normal">
            <thead className="sticky top-0 bg-bg-surface border-b border-border-default z-10">
              <tr className="text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-2 font-medium text-center w-20">Estado</th>
                <th className="px-4 py-2 font-medium text-left">Titulo</th>
                <th className="px-4 py-2 font-medium text-center w-24">Dificultad</th>
                <th className="px-4 py-2 font-medium text-left">Fuente</th>
                <th className="px-4 py-2 font-medium text-left">Tags</th>
                <th className="px-4 py-2 font-medium text-right w-24">Soluciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {problems.map((problem) => (
                <tr
                  key={problem.id}
                  className="hover:bg-bg-elevated transition-colors"
                >
                  <td className="px-4 py-1.5 text-center">
                    <StatusBadge status={problem.status} />
                  </td>
                  <td className="px-4 py-1.5">
                    <Link
                      href={`/problems/${problem.id}`}
                      className="font-medium text-text-primary hover:text-link-focus block truncate max-w-[200px] md:max-w-[300px]"
                      title={problem.title}
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-1.5 text-center">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>
                  <td className="px-4 py-1.5 text-xs text-text-muted truncate max-w-[120px]">
                    {problem.source ?? '-'}
                  </td>
                  <td className="px-4 py-1.5">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map(({ tag }) => (
                        <TagPill key={tag.id} name={tag.name} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-1.5 text-right font-mono text-xs text-text-secondary">
                    {problem._count.solutions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
