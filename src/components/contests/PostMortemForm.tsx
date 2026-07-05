'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

type PostMortemValues = {
  whatWorked: string;
  whatFailed: string;
  actionItems: string;
};

export function PostMortemForm({
  contestId,
  initialValues,
}: {
  contestId: string;
  initialValues?: PostMortemValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PostMortemValues>(
    initialValues ?? { whatWorked: '', whatFailed: '', actionItems: '' },
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/contests/${contestId}/postmortem`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo guardar el post-mortem');
      return;
    }

    router.push(`/contests/${contestId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="whatWorked">
          Que funciono
        </label>
        <textarea
          id="whatWorked"
          rows={3}
          value={values.whatWorked}
          onChange={(e) => setValues({ ...values, whatWorked: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="whatFailed">
          Que fallo
        </label>
        <textarea
          id="whatFailed"
          rows={3}
          value={values.whatFailed}
          onChange={(e) => setValues({ ...values, whatFailed: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="actionItems">
          Acciones a tomar
        </label>
        <textarea
          id="actionItems"
          rows={3}
          value={values.actionItems}
          onChange={(e) => setValues({ ...values, actionItems: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar post-mortem'}
      </Button>
    </form>
  );
}
