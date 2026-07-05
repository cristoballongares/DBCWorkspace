import Link from 'next/link';
import { listTopics } from '@/services/topic.service';
import { Button } from '@/components/ui/Button';

export default async function TopicsPage() {
  const topics = await listTopics();
  const byCategory = new Map<string, { label: string; items: typeof topics }>();

  for (const topic of topics) {
    const key = topic.category.trim().toLowerCase();
    const group = byCategory.get(key) ?? { label: topic.category.trim(), items: [] };
    group.items.push(topic);
    byCategory.set(key, group);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Temas</h1>
        <Link href="/topics/new">
          <Button>Nuevo tema</Button>
        </Link>
      </div>

      {topics.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay temas registrados.</p>
      ) : (
        Array.from(byCategory.entries()).map(([key, group]) => (
          <div key={key} className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              {group.label}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {group.items.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.slug}`}
                  className="rounded-md border border-border-default bg-bg-surface p-4 hover:bg-bg-elevated"
                >
                  <p className="font-medium text-text-primary">{topic.title}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {topic._count.children > 0
                      ? `${topic._count.children} subtema${topic._count.children === 1 ? '' : 's'}`
                      : `${topic.exercises.length} ejercicio${topic.exercises.length === 1 ? '' : 's'}`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
