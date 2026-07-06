import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContest } from '@/services/contest.service';
import { ContestStatusBadge } from '@/components/contests/ContestStatusBadge';
import { ContestStatusButton } from '@/components/contests/ContestStatusButton';
import { DeleteContestButton } from '@/components/contests/DeleteContestButton';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function ContestDetailPage({ params }: { params: { id: string } }) {
  const contest = await getContest(params.id);

  if (!contest) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: 'Contests', href: '/contests' }, { label: contest.name }]} />

      <div className="rounded-md border border-border-default bg-bg-surface p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-text-primary">{contest.name}</h1>
          <div className="flex gap-2">
            <Link href={`/contests/${contest.id}/scoreboard`}>
              <Button variant="secondary">Scoreboard</Button>
            </Link>
            <Link href={`/contests/${contest.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
            <ContestStatusButton contestId={contest.id} status={contest.status} />
            <DeleteContestButton contestId={contest.id} />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm text-text-secondary">
          <ContestStatusBadge status={contest.status} />
          <span>{new Date(contest.startTime).toLocaleString()}</span>
          <span>
            {contest.durationMin} min · penalidad {contest.penaltyMin} min · freeze{' '}
            {contest.freezeMin} min
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <h2 className="text-lg font-semibold text-text-primary">Problemas</h2>
        <div className="overflow-x-auto rounded-md border border-border-default">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Label</th>
                <th className="px-4 py-2.5 font-medium">Problema</th>
                <th className="px-4 py-2.5 font-medium">Dificultad</th>
              </tr>
            </thead>
            <tbody>
              {contest.problems.map((cp) => (
                <tr key={cp.id} className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated">
                  <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">{cp.label}</td>
                  <td className="px-4 py-2.5">
                    <Link
                      href={`/problems/${cp.problem.id}`}
                      className="font-medium text-text-primary hover:text-link-focus"
                    >
                      {cp.problem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <DifficultyBadge difficulty={cp.problem.difficulty} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {contest.status === 'FINISHED' && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Post-mortem</h2>
            <Link href={`/contests/${contest.id}/postmortem/edit`}>
              <Button variant="secondary">
                {contest.postMortem ? 'Editar post-mortem' : 'Agregar post-mortem'}
              </Button>
            </Link>
          </div>

          {contest.postMortem ? (
            <div className="space-y-3 rounded-md border border-border-default bg-bg-surface p-4 text-sm">
              {contest.postMortem.whatWorked && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">Que funciono</p>
                  <p className="whitespace-pre-wrap text-text-secondary">{contest.postMortem.whatWorked}</p>
                </div>
              )}
              {contest.postMortem.whatFailed && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">Que fallo</p>
                  <p className="whitespace-pre-wrap text-text-secondary">{contest.postMortem.whatFailed}</p>
                </div>
              )}
              {contest.postMortem.actionItems && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-muted">Acciones a tomar</p>
                  <p className="whitespace-pre-wrap text-text-secondary">{contest.postMortem.actionItems}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-muted">Todavia no hay post-mortem para este contest.</p>
          )}
        </div>
      )}
    </div>
  );
}
