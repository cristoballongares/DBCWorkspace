import Link from 'next/link';
import { listContests } from '@/services/contest.service';
import { ContestStatusBadge } from '@/components/contests/ContestStatusBadge';
import { Button } from '@/components/ui/Button';

export default async function ContestsPage() {
  const contests = await listContests();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Contests</h1>
        <Link href="/contests/new">
          <Button>Nuevo contest</Button>
        </Link>
      </div>

      {contests.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay contests registrados.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border-default">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 font-medium">Nombre</th>
                <th className="px-4 py-2.5 font-medium">Inicio</th>
                <th className="px-4 py-2.5 font-medium">Duracion</th>
                <th className="px-4 py-2.5 font-medium">Problemas</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr
                  key={contest.id}
                  className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated"
                >
                  <td className="px-4 py-2.5">
                    <ContestStatusBadge status={contest.status} />
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/contests/${contest.id}`}
                      className="font-medium text-text-primary hover:text-link-focus"
                    >
                      {contest.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">
                    {new Date(contest.startTime).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-muted">{contest.durationMin} min</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">
                    {contest.problems.length}
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
