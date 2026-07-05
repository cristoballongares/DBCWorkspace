import Link from 'next/link';
import { listProblems } from '@/services/problem.service';
import { ProblemCard } from '@/components/problems/ProblemCard';
import { Button } from '@/components/ui/Button';

export default async function ProblemsPage() {
  const problems = await listProblems();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Problemas</h1>
        <Link href="/problems/new">
          <Button>Nuevo problema</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {problems.map((problem) => (
          <ProblemCard key={problem.id} problem={problem} />
        ))}
        {problems.length === 0 && (
          <p className="text-sm text-text-muted">Todavia no hay problemas registrados.</p>
        )}
      </div>
    </div>
  );
}
