'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type ProblemFormValues = {
  id?: string;
  title: string;
  source: string;
  url: string;
  difficulty: Difficulty;
  status: ProblemStatus;
  statementNotes: string;
  tagNames: string[];
};

const emptyValues: ProblemFormValues = {
  title: '',
  source: '',
  url: '',
  difficulty: 'UNRATED',
  status: 'UNSOLVED',
  statementNotes: '',
  tagNames: [],
};

export function ProblemForm({ initialValues }: { initialValues?: ProblemFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ProblemFormValues>(initialValues ?? emptyValues);
  const [tagInput, setTagInput] = useState(values.tagNames.join(', '));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialValues?.id);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const tagNames = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload = { ...values, tagNames };

    const response = await fetch(
      isEditing ? `/api/problems/${initialValues!.id}` : '/api/problems',
      {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo guardar el problema');
      return;
    }

    const problem = await response.json();
    router.push(`/problems/${problem.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="title">
          Titulo
        </label>
        <Input
          id="title"
          required
          value={values.title}
          onChange={(e) => setValues({ ...values, title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="source">
            Fuente
          </label>
          <Input
            id="source"
            placeholder="Codeforces 1500A"
            value={values.source}
            onChange={(e) => setValues({ ...values, source: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="url">
            URL
          </label>
          <Input
            id="url"
            type="url"
            value={values.url}
            onChange={(e) => setValues({ ...values, url: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="difficulty">
            Dificultad
          </label>
          <select
            id="difficulty"
            value={values.difficulty}
            onChange={(e) => setValues({ ...values, difficulty: e.target.value as Difficulty })}
            className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary"
          >
            <option value="UNRATED">Unrated</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value as ProblemStatus })}
            className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary"
          >
            <option value="UNSOLVED">Pendiente</option>
            <option value="SOLVED_INDIVIDUAL">Resuelto individual</option>
            <option value="SOLVED_TEAM">Resuelto equipo</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="tags">
          Tags (separados por coma)
        </label>
        <Input
          id="tags"
          placeholder="dp, graphs, segment-tree"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="statementNotes">
          Notas del enunciado
        </label>
        <textarea
          id="statementNotes"
          rows={4}
          value={values.statementNotes}
          onChange={(e) => setValues({ ...values, statementNotes: e.target.value })}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear problema'}
      </Button>
    </form>
  );
}
