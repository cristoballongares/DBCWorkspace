import Link from 'next/link';
import { listProblems, listTags } from '@/services/problem.service';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { TagPill } from '@/components/problems/TagPill';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

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

      <form method="get" className="flex flex-wrap items-end gap-3 rounded-md border border-border-default bg-bg-surface p-4">
        <div className="min-w-[12rem] flex-1 space-y-1">
          <label className="text-xs text-text-secondary" htmlFor="q">
            Buscar por titulo
          </label>
          <Input id="q" name="q" defaultValue={q ?? ''} placeholder="Titulo del problema" />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-secondary" htmlFor="tag">
            Tag
          </label>
          <Select id="tag" name="tag" defaultValue={tag ?? ''}>
            <option value="">Todos</option>
            {tags.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-secondary" htmlFor="difficulty">
            Dificultad
          </label>
          <Select id="difficulty" name="difficulty" defaultValue={difficulty ?? ''}>
            <option value="">Todas</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
            <option value="UNRATED">Unrated</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-text-secondary" htmlFor="status">
            Estado
          </label>
          <Select id="status" name="status" defaultValue={status ?? ''}>
            <option value="">Todos</option>
            <option value="UNSOLVED">No resuelto</option>
            <option value="SOLVED_INDIVIDUAL">Resuelto individual</option>
            <option value="SOLVED_TEAM">Resuelto en equipo</option>
          </Select>
        </div>

        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
        {(q || tag || difficulty || status) && (
          <Link href="/problems">
            <Button type="button" variant="secondary">
              Limpiar
            </Button>
          </Link>
        )}
      </form>

      {problems.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay problemas registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border-default">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 font-medium">Titulo</th>
                <th className="px-4 py-2.5 font-medium">Dificultad</th>
                <th className="px-4 py-2.5 font-medium">Fuente</th>
                <th className="px-4 py-2.5 font-medium">Tags</th>
                <th className="px-4 py-2.5 font-medium">Soluciones</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr
                  key={problem.id}
                  className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated"
                >
                  <td className="px-4 py-2.5">
                    <StatusBadge status={problem.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/problems/${problem.id}`}
                      className="font-medium text-text-primary hover:text-link-focus"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">{problem.source ?? '-'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map(({ tag }) => (
                        <TagPill key={tag.id} name={tag.name} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">
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
