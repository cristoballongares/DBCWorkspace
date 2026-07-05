'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';

type SelectableProblem = { id: string; title: string };
type SelectableParent = { id: string; title: string };

type TopicFormValues = {
  id?: string;
  title: string;
  category: string;
  content: string;
  commonPitfalls: string;
  problemIds: string[];
  parentId: string;
  order: string;
};

const emptyValues: TopicFormValues = {
  title: '',
  category: '',
  content: '',
  commonPitfalls: '',
  problemIds: [],
  parentId: '',
  order: '0',
};

export function TopicForm({
  problems,
  categories,
  parents,
  initialValues,
}: {
  problems: SelectableProblem[];
  categories: string[];
  parents: SelectableParent[];
  initialValues?: TopicFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<TopicFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialValues?.id);

  function toggleProblem(problemId: string, checked: boolean) {
    setValues((prev) => ({
      ...prev,
      problemIds: checked
        ? [...prev.problemIds, problemId]
        : prev.problemIds.filter((id) => id !== problemId),
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: values.title,
      category: values.category,
      content: values.content,
      commonPitfalls: values.commonPitfalls || undefined,
      problemIds: values.problemIds,
      parentId: values.parentId || undefined,
      order: values.order ? Number(values.order) : 0,
    };

    const response = await fetch(isEditing ? `/api/topics/${initialValues!.id}` : '/api/topics', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo guardar el tema');
      return;
    }

    const topic = await response.json();
    router.push(`/topics/${topic.slug}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="title">
            Titulo
          </label>
          <Input
            id="title"
            required
            placeholder="Segment Tree"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="category">
            Categoria
          </label>
          <Input
            id="category"
            required
            list="topic-categories"
            placeholder="Estructuras de datos"
            value={values.category}
            onChange={(e) => setValues({ ...values, category: e.target.value })}
          />
          <datalist id="topic-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="parentId">
            Tema padre (opcional)
          </label>
          <Select
            id="parentId"
            value={values.parentId}
            onChange={(e) => setValues({ ...values, parentId: e.target.value })}
          >
            <option value="">Ninguno (tema de nivel superior)</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.title}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="order">
            Orden dentro del tema padre
          </label>
          <Input
            id="order"
            type="number"
            value={values.order}
            onChange={(e) => setValues({ ...values, order: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Explicacion (Markdown + LaTeX)</label>
        <MarkdownEditor
          value={values.content}
          onChange={(content) => setValues((prev) => ({ ...prev, content }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="commonPitfalls">
          Errores comunes
        </label>
        <textarea
          id="commonPitfalls"
          rows={3}
          value={values.commonPitfalls}
          onChange={(e) => setValues({ ...values, commonPitfalls: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <span className="text-sm text-text-secondary">Ejercicios relacionados</span>
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-border-default p-2">
          {problems.map((problem) => (
            <label
              key={problem.id}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-text-primary hover:bg-bg-elevated"
            >
              <input
                type="checkbox"
                checked={values.problemIds.includes(problem.id)}
                onChange={(e) => toggleProblem(problem.id, e.target.checked)}
              />
              <span>{problem.title}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear tema'}
      </Button>
    </form>
  );
}
