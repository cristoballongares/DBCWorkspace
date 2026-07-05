'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';

type SolutionFormValues = {
  id?: string;
  content: string;
  reasoning: string;
  timeSpentMin: string;
  attemptCount: string;
};

const emptyValues: SolutionFormValues = {
  content: '',
  reasoning: '',
  timeSpentMin: '',
  attemptCount: '1',
};

export function SolutionForm({
  problemId,
  initialValues,
}: {
  problemId: string;
  initialValues?: SolutionFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SolutionFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialValues?.id);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      content: values.content,
      reasoning: values.reasoning || undefined,
      timeSpentMin: values.timeSpentMin ? Number(values.timeSpentMin) : undefined,
      attemptCount: values.attemptCount ? Number(values.attemptCount) : 1,
    };

    const response = await fetch(
      isEditing ? `/api/solutions/${initialValues!.id}` : `/api/problems/${problemId}/solutions`,
      {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo guardar la solucion');
      return;
    }

    router.push(`/problems/${problemId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Solucion (Markdown + LaTeX)</label>
        <MarkdownEditor
          value={values.content}
          onChange={(content) => setValues((prev) => ({ ...prev, content }))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="reasoning">
          Razonamiento
        </label>
        <textarea
          id="reasoning"
          rows={3}
          value={values.reasoning}
          onChange={(e) => setValues({ ...values, reasoning: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="timeSpentMin">
            Tiempo (min)
          </label>
          <Input
            id="timeSpentMin"
            type="number"
            min={1}
            value={values.timeSpentMin}
            onChange={(e) => setValues({ ...values, timeSpentMin: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="attemptCount">
            Intentos
          </label>
          <Input
            id="attemptCount"
            type="number"
            min={1}
            value={values.attemptCount}
            onChange={(e) => setValues({ ...values, attemptCount: e.target.value })}
          />
        </div>
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar solucion'}
      </Button>
    </form>
  );
}
