import { notFound } from 'next/navigation';
import { getSolution } from '@/services/solution.service';
import { getProblem } from '@/services/problem.service';
import { SolutionForm } from '@/components/solutions/SolutionForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditSolutionPage({ params }: { params: { id: string } }) {
  const solution = await getSolution(params.id);

  if (!solution) {
    notFound();
  }

  const problem = await getProblem(solution.problemId);

  return (
    <div className="max-w-4xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Problemas', href: '/problems' },
          ...(problem ? [{ label: problem.title, href: `/problems/${problem.id}` }] : []),
          { label: 'Editar solucion' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Editar solucion</h1>
      <SolutionForm
        problemId={solution.problemId}
        initialValues={{
          id: solution.id,
          content: solution.content,
          reasoning: solution.reasoning ?? '',
          timeSpentMin: solution.timeSpentMin?.toString() ?? '',
          attemptCount: solution.attemptCount.toString(),
        }}
      />
    </div>
  );
}
