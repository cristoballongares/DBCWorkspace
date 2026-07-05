import Link from 'next/link';
import { listTopics } from '@/services/topic.service';
import { Button } from '@/components/ui/Button';
import { Folder, FileText, ChevronRight, Hash, Layers } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-end justify-between border-b border-border-default pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <Layers className="h-7 w-7 text-link-default" /> 
            Librería de Temas
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Explora el conocimiento estructurado. Las categorías principales contienen temas y subtemas.
          </p>
        </div>
        <Link href="/topics/new">
          <Button className="shadow-sm">Nuevo Tema</Button>
        </Link>
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border-strong bg-bg-surface">
          <Folder className="h-12 w-12 text-text-muted mb-4 opacity-50" />
          <p className="text-base font-medium text-text-primary">El repositorio está vacío</p>
          <p className="text-sm text-text-muted mt-1">Crea tu primer tema para empezar a organizar el conocimiento.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Array.from(byCategory.entries()).map(([key, group]) => (
            <div key={key} className="space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-text-muted" />
                <h2 className="text-lg font-bold uppercase tracking-wider text-text-primary">
                  {group.label}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex flex-col rounded-xl border border-border-default bg-bg-surface overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="p-4 bg-bg-elevated border-b border-border-default group-hover:bg-bg-overlay transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-link-focus transition-colors flex items-center gap-2">
                          <Folder className="h-4 w-4 text-link-default" />
                          {topic.title}
                        </h3>
                        <p className="text-xs text-text-muted mt-1">
                          {topic.exercises.length} ejercicios
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                    </Link>

                    <div className="p-3 bg-bg-base flex-1">
                      {topic.children && topic.children.length > 0 ? (
                        <ul className="space-y-1">
                          {topic.children.map((child, idx) => (
                            <li key={child.id}>
                              <Link 
                                href={`/topics/${child.slug}`}
                                className="flex items-center gap-2 px-2 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md transition-colors"
                              >
                                <span className="text-border-strong text-xs">{(idx + 1).toString().padStart(2, '0')}.</span>
                                <FileText className="h-3.5 w-3.5" />
                                <span className="truncate">{child.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="h-full flex items-center justify-center p-4">
                          <p className="text-xs text-text-muted italic">Sin subtemas anidados</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
