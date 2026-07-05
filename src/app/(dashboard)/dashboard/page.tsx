import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardData } from '@/services/dashboard.service';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border border-border-default bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">Problemas resueltos por mi</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {data.problemsSolvedByMe} <span className="text-sm font-normal text-text-muted">/ {data.totalProblems}</span>
          </p>
        </div>
        <div className="rounded-md border border-border-default bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">Mi rating actual</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">
            {data.myRating?.rating !== null && data.myRating?.rating !== undefined
              ? data.myRating.rating.toFixed(1)
              : '-'}
          </p>
          {data.myRating?.lastContest && (
            <p className="text-xs text-text-muted">ultimo: {data.myRating.lastContest}</p>
          )}
        </div>
        <div className="rounded-md border border-border-default bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">Proximos contests</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{data.upcomingContests.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Proximos contests
          </h2>
          {data.upcomingContests.length === 0 ? (
            <p className="text-sm text-text-muted">No hay contests programados.</p>
          ) : (
            <div className="space-y-2">
              {data.upcomingContests.map((contest) => (
                <Link
                  key={contest.id}
                  href={`/contests/${contest.id}`}
                  className="block rounded-md border border-border-default bg-bg-surface p-3 text-sm hover:bg-bg-elevated"
                >
                  <p className="font-medium text-text-primary">{contest.name}</p>
                  <p className="text-xs text-text-muted">{new Date(contest.startTime).toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            Actividad reciente
          </h2>
          {data.recentSolutions.length === 0 ? (
            <p className="text-sm text-text-muted">Todavia no hay soluciones registradas.</p>
          ) : (
            <div className="space-y-2">
              {data.recentSolutions.map((solution) => (
                <Link
                  key={solution.id}
                  href={`/problems/${solution.problem.id}`}
                  className="block rounded-md border border-border-default bg-bg-surface p-3 text-sm hover:bg-bg-elevated"
                >
                  <p className="text-text-primary">
                    <span className="font-medium">{solution.author.name}</span> resolvio{' '}
                    {solution.problem.title}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
