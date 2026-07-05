import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { ProblemForm } from '@/components/problems/ProblemForm';

export default async function EditProblemPage({ params }: { params: { id: string } }) {
  const problem = await getProblem(params.id);

  if (!problem) {
    notFound();
  }

  return (
    <div className="space-y-4">
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
