import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDashboardData } from '@/services/dashboard.service';
import { DashboardCalendar } from '@/components/dashboard/DashboardCalendar';
import { TodoList } from '@/components/dashboard/TodoList';
import { Trophy, CheckCircle2, TrendingUp, CalendarDays, Activity } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const data = await getDashboardData(session!.user.id);

  const contestDates = data.upcomingContests.map(c => new Date(c.startTime));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">Resumen de tu rendimiento y próximas actividades.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col justify-between rounded-xl border border-border-default bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-wide text-text-secondary">Problemas Resueltos</p>
            <CheckCircle2 className="h-5 w-5 text-status-solved opacity-80" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-text-primary">{data.problemsSolvedByMe}</h2>
            <span className="text-sm font-medium text-text-muted">/ {data.totalProblems} totales</span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border-default bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-wide text-text-secondary">Mi Rating</p>
            <TrendingUp className="h-5 w-5 text-link-focus opacity-80" />
          </div>
          <div className="mt-4 flex flex-col">
            <h2 className="text-4xl font-bold text-text-primary">
              {data.myRating?.rating !== null && data.myRating?.rating !== undefined
                ? data.myRating.rating.toFixed(1)
                : '-'}
            </h2>
            {data.myRating?.lastContest && (
              <span className="text-xs text-text-muted mt-1">Último: {data.myRating.lastContest}</span>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border-default bg-bg-surface p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-wide text-text-secondary">Próximos Contests</p>
            <Trophy className="h-5 w-5 text-status-attempted opacity-80" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-text-primary">{data.upcomingContests.length}</h2>
            <span className="text-sm font-medium text-text-muted">programados</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Agenda & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border-default bg-bg-surface overflow-hidden">
            <div className="border-b border-border-default px-6 py-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-link-focus" />
              <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Agenda de Contests</h2>
            </div>
            <div className="p-2">
              {data.upcomingContests.length === 0 ? (
                <p className="p-4 text-sm text-text-muted text-center italic">No hay contests en tu radar.</p>
              ) : (
                <div className="divide-y divide-border-default">
                  {data.upcomingContests.map((contest) => (
                    <Link
                      key={contest.id}
                      href={`/contests/${contest.id}`}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-bg-elevated group"
                    >
                      <div>
                        <p className="font-medium text-text-primary group-hover:text-link-focus transition-colors">{contest.name}</p>
                        <p className="text-xs text-text-muted mt-1">ID: {contest.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-text-primary">
                          {new Date(contest.startTime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-xs text-text-muted">
                          {new Date(contest.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-surface overflow-hidden">
            <div className="border-b border-border-default px-6 py-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-status-solved" />
              <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Actividad Reciente</h2>
            </div>
            <div className="p-2">
              {data.recentActivity.length === 0 ? (
                <p className="p-4 text-sm text-text-muted text-center italic">Aún no hay fuego en la pista.</p>
              ) : (
                <div className="divide-y divide-border-default">
                  {data.recentActivity.map((log) => {
                    let iconColor = "text-text-muted";
                    let linkHref = "#";
                    const editorName = log.editor?.name ?? "Usuario eliminado";

                    if (log.entityType === 'SOLUTION' && log.problem) {
                      linkHref = `/problems/${log.problem.id}`;
                    } else if (log.entityType === 'PROBLEM' && log.problem) {
                      linkHref = `/problems/${log.problem.id}`;
                    } else if (log.entityType === 'CONTEST' && log.contest) {
                      linkHref = `/contests/${log.contest.id}`;
                    } else if (log.entityType === 'NOTEBOOK_ENTRY' && log.notebookEntry) {
                      linkHref = `/topics/${log.notebookEntry.slug}`;
                    }

                    return (
                      <Link
                        key={log.id}
                        href={linkHref}
                        className="flex items-center gap-3 p-4 transition-colors hover:bg-bg-elevated"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-border-strong text-xs font-bold text-text-primary">
                          {editorName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-primary">
                            <span className="font-semibold text-link-focus mr-1">{editorName}</span>
                            {log.diffSummary}
                          </p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {new Date(log.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Widget */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border-default bg-bg-surface p-6">
            <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-text-muted" /> Mi Calendario
            </h2>
            <div className="flex justify-center">
              <DashboardCalendar dates={contestDates} />
            </div>
            <p className="text-xs text-center text-text-muted mt-4">
              Los días marcados en azul indican actividades programadas.
            </p>
          </div>

          <TodoList initialTodos={data.publicTodos} />
        </div>
      </div>
    </div>
  );
}
