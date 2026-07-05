'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type SelectableProblem = { id: string; title: string };

export function ContestForm({ problems }: { problems: SelectableProblem[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMin, setDurationMin] = useState('300');
  const [penaltyMin, setPenaltyMin] = useState('20');
  const [freezeMin, setFreezeMin] = useState('60');
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleProblem(problemId: string, checked: boolean) {
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) {
        next[problemId] = LABELS[Object.keys(prev).length] ?? '?';
      } else {
        delete next[problemId];
      }
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const contestProblems = Object.entries(selected).map(([problemId, label]) => ({
      problemId,
      label,
    }));

    if (contestProblems.length === 0) {
      setError('Selecciona al menos un problema');
      return;
    }

    setIsSubmitting(true);

    const response = await fetch('/api/contests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        startTime,
        durationMin: Number(durationMin),
        penaltyMin: Number(penaltyMin),
        freezeMin: Number(freezeMin),
        problems: contestProblems,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo crear el contest');
      return;
    }

    const contest = await response.json();
    router.push(`/contests/${contest.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="name">
          Nombre
        </label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="startTime">
            Inicio
          </label>
          <Input
            id="startTime"
            type="datetime-local"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="durationMin">
            Duracion (min)
          </label>
          <Input
            id="durationMin"
            type="number"
            min={1}
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="penaltyMin">
            Penalidad (min)
          </label>
          <Input
            id="penaltyMin"
            type="number"
            min={0}
            value={penaltyMin}
            onChange={(e) => setPenaltyMin(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-text-secondary" htmlFor="freezeMin">
            Freeze (min antes del fin)
          </label>
          <Input
            id="freezeMin"
            type="number"
            min={0}
            value={freezeMin}
            onChange={(e) => setFreezeMin(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-text-secondary">Problemas</span>
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border border-border-default p-2">
          {problems.map((problem) => (
            <label
              key={problem.id}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-text-primary hover:bg-bg-elevated"
            >
              <input
                type="checkbox"
                checked={problem.id in selected}
                onChange={(e) => toggleProblem(problem.id, e.target.checked)}
              />
              <span className="w-6 font-mono text-xs text-text-muted">
                {selected[problem.id] ?? ''}
              </span>
              <span>{problem.title}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando...' : 'Crear contest'}
      </Button>
    </form>
  );
}
