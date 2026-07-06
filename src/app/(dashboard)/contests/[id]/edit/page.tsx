import { notFound } from 'next/navigation';
import { getContest } from '@/services/contest.service';
import { listProblems } from '@/services/problem.service';
import { ContestForm } from '@/components/contests/ContestForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditContestPage({ params }: { params: { id: string } }) {
  const [contest, problems] = await Promise.all([
    getContest(params.id),
    listProblems(),
  ]);

  if (!contest) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Contests', href: '/contests' },
          { label: contest.name, href: `/contests/${contest.id}` },
          { label: 'Editar' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Editar contest</h1>
      <ContestForm
        problems={problems.map((p) => ({ id: p.id, title: p.title }))}
        contest={{
          id: contest.id,
          name: contest.name,
          startTime: contest.startTime,
          durationMin: contest.durationMin,
          penaltyMin: contest.penaltyMin,
          freezeMin: contest.freezeMin,
          problems: contest.problems.map((cp) => ({ problemId: cp.problemId, label: cp.label })),
        }}
      />
    </div>
  );
}
