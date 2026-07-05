import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { ProblemForm } from '@/components/problems/ProblemForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditProblemPage({ params }: { params: { id: string } }) {
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
          { label: 'Editar' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Editar problema</h1>
      <ProblemForm
        initialValues={{
          id: problem.id,
          title: problem.title,
          source: problem.source ?? '',
          url: problem.url ?? '',
          difficulty: problem.difficulty,
          status: problem.status,
          statementNotes: problem.statementNotes ?? '',
          tagNames: problem.tags.map(({ tag }) => tag.name),
        }}
      />
    </div>
  );
}
