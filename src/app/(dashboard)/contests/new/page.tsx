import { listProblems } from '@/services/problem.service';
import { ContestForm } from '@/components/contests/ContestForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function NewContestPage() {
  const problems = await listProblems();

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: 'Contests', href: '/contests' }, { label: 'Nuevo' }]} />
      <h1 className="text-2xl font-semibold text-text-primary">Nuevo contest</h1>
      <ContestForm problems={problems.map((p) => ({ id: p.id, title: p.title }))} />
    </div>
  );
}
