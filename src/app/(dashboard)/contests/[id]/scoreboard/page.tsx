import { notFound } from 'next/navigation';
import { computeScoreboard } from '@/services/submission.service';
import { Scoreboard } from '@/components/contests/Scoreboard';
import { SubmissionForm } from '@/components/contests/SubmissionForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function ContestScoreboardPage({ params }: { params: { id: string } }) {
  const result = await computeScoreboard(params.id);

  if (!result) {
    notFound();
  }

  const { contest, rows } = result;

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Contests', href: '/contests' },
          { label: contest.name, href: `/contests/${contest.id}` },
          { label: 'Scoreboard' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Scoreboard: {contest.name}</h1>

      {contest.status !== 'FINISHED' && (
        <SubmissionForm
          contestId={contest.id}
          problems={contest.problems.map((cp) => ({
            id: cp.id,
            label: cp.label,
            title: cp.problem.title,
          }))}
        />
      )}

      <Scoreboard rows={rows} />
    </div>
  );
}
