import { notFound } from 'next/navigation';
import { getTopicBySlug, listTopicCategories } from '@/services/topic.service';
import { listProblems } from '@/services/problem.service';
import { TopicForm } from '@/components/topics/TopicForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditTopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  const [problems, categories] = await Promise.all([listProblems(), listTopicCategories()]);

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Temas', href: '/topics' },
          { label: topic.title, href: `/topics/${topic.slug}` },
          { label: 'Editar' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Editar tema: {topic.title}</h1>
      <TopicForm
        problems={problems.map((p) => ({ id: p.id, title: p.title }))}
        categories={categories}
        initialValues={{
          id: topic.id,
          title: topic.title,
          category: topic.category,
          content: topic.content,
          commonPitfalls: topic.commonPitfalls ?? '',
          problemIds: topic.exercises.map((e) => e.problemId),
        }}
      />
    </div>
  );
}
