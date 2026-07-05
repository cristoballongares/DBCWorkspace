import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTopicBySlug } from '@/services/topic.service';
import { MarkdownContent } from '@/components/editor/MarkdownContent';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { DeleteTopicButton } from '@/components/topics/DeleteTopicButton';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function TopicDetailPage({ params }: { params: { slug: string } }) {
  const topic = await getTopicBySlug(params.slug);

  if (!topic) {
    notFound();
  }

  const siblings = topic.parent?.children ?? [];
  const siblingIndex = siblings.findIndex((s) => s.id === topic.id);
  const prevSibling = siblingIndex > 0 ? siblings[siblingIndex - 1] : null;
  const nextSibling =
    siblingIndex >= 0 && siblingIndex < siblings.length - 1 ? siblings[siblingIndex + 1] : null;

  return (
    <div className="max-w-4xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Temas', href: '/topics' },
          ...(topic.parent
            ? [{ label: topic.parent.title, href: `/topics/${topic.parent.slug}` }]
            : []),
          { label: topic.title },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-muted">{topic.category}</p>
          <h1 className="text-2xl font-semibold text-text-primary">{topic.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/topics/${topic.slug}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
          <DeleteTopicButton topicId={topic.id} />
        </div>
      </div>

      {(prevSibling || nextSibling) && (
        <div className="flex items-center justify-between text-sm">
          {prevSibling ? (
            <Link href={`/topics/${prevSibling.slug}`} className="text-link-focus hover:underline">
              ← {prevSibling.title}
            </Link>
          ) : (
            <span />
          )}
          {nextSibling && (
            <Link href={`/topics/${nextSibling.slug}`} className="text-link-focus hover:underline">
              {nextSibling.title} →
            </Link>
          )}
        </div>
      )}

      <div className="rounded-md border border-border-default bg-bg-surface p-6">
        <MarkdownContent source={topic.content} />
      </div>

      {topic.commonPitfalls && (
        <div className="rounded-md border border-border-default bg-bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-text-muted">Errores comunes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-text-secondary">
            {topic.commonPitfalls}
          </p>
        </div>
      )}

      {topic.children.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-text-primary">
            Subtemas ({topic.children.length})
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {topic.children.map((child) => (
              <Link
                key={child.id}
                href={`/topics/${child.slug}`}
                className="rounded-md border border-border-default bg-bg-surface p-3 text-sm font-medium text-text-primary hover:bg-bg-elevated"
              >
                {child.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-text-primary">Ejercicios</h2>
        {topic.exercises.length === 0 ? (
          <p className="text-sm text-text-muted">Todavia no hay ejercicios vinculados.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-border-default">
            <table className="w-full text-left text-sm">
              <tbody>
                {topic.exercises.map((exercise) => (
                  <tr
                    key={exercise.problemId}
                    className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated"
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/problems/${exercise.problem.id}`}
                        className="font-medium text-text-primary hover:text-link-focus"
                      >
                        {exercise.problem.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <DifficultyBadge difficulty={exercise.problem.difficulty} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
