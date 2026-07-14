import { listTags } from '@/services/problem.service';
import { PracticePanel } from '@/components/practice/PracticePanel';

export default async function PracticePage() {
  const tags = await listTags();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">Práctica</h1>
      <p className="text-sm text-text-muted">
        Elige filtros (o deja &quot;Todas&quot; para un problema variado) y recibe un problema al azar de la base.
      </p>

      <PracticePanel tags={tags} />
    </div>
  );
}
