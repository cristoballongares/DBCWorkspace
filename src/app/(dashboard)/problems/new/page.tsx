import { ProblemForm } from '@/components/problems/ProblemForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function NewProblemPage() {
  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: 'Problemas', href: '/problems' }, { label: 'Nuevo problema' }]} />
      <h1 className="text-2xl font-semibold text-text-primary">Nuevo problema</h1>
      <ProblemForm />
    </div>
  );
}
