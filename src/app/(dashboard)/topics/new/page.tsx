import { listProblems } from '@/services/problem.service';
import { listTopicCategories, listParentCandidates } from '@/services/topic.service';
import { TopicForm } from '@/components/topics/TopicForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function NewTopicPage() {
  const [problems, categories, parents] = await Promise.all([
    listProblems(),
    listTopicCategories(),
    listParentCandidates(),
  ]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Temas', href: '/topics' }, { label: 'Nuevo' }]} />
      <h1 className="text-2xl font-semibold text-text-primary">Nuevo tema</h1>
      <TopicForm
        problems={problems.map((p) => ({ id: p.id, title: p.title }))}
        categories={categories}
        parents={parents}
      />
    </div>
  );
}
