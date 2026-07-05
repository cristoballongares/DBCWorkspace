import { notFound } from 'next/navigation';
import { getProblem } from '@/services/problem.service';
import { getEditorialByProblem } from '@/services/editorial.service';
import { EditorialForm } from '@/components/editorials/EditorialForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditEditorialPage({ params }: { params: { id: string } }) {
  const problem = await getProblem(params.id);

  if (!problem) {
    notFound();
  }

  const editorial = await getEditorialByProblem(problem.id);

  return (
    <div className="max-w-4xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Problemas', href: '/problems' },
          { label: problem.title, href: `/problems/${problem.id}` },
          { label: 'Editorial' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Editorial: {problem.title}</h1>
      <EditorialForm problemId={problem.id} initialContent={editorial?.content} />
    </div>
  );
}
