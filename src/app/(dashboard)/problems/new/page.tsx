import { ProblemForm } from '@/components/problems/ProblemForm';

export default function NewProblemPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">Nuevo problema</h1>
      <ProblemForm />
    </div>
  );
}
