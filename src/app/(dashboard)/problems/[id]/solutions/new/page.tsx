import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { SolutionForm } from '@/components/solutions/SolutionForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function NewSolutionPage({ params }: { params: { id: string } }) {
  const problem = await getProblem(params.id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Problemas', href: '/problems' },
          { label: problem.title, href: `/problems/${problem.id}` },
          { label: 'Nueva solucion' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Nueva solucion: {problem.title}</h1>
      <SolutionForm problemId={problem.id} />
    </div>
  );
}
