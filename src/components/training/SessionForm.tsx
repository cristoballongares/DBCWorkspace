'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function SessionForm({ calendarId }: { calendarId: string }) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [plannedProblems, setPlannedProblems] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/training/calendars/${calendarId}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        plannedProblems: plannedProblems ? Number(plannedProblems) : undefined,
        notes: notes || undefined,
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo agregar la sesion');
      return;
    }

    setDate('');
    setPlannedProblems('');
    setNotes('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-md border border-border-default bg-bg-surface p-4">
      <div className="space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="date">
          Fecha
        </label>
        <Input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="plannedProblems">
          Problemas planeados
        </label>
        <Input
          id="plannedProblems"
          type="number"
          min={0}
          value={plannedProblems}
          onChange={(e) => setPlannedProblems(e.target.value)}
          className="w-24"
        />
      </div>

      <div className="min-w-[10rem] flex-1 space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="notes">
          Notas
        </label>
        <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Agregando...' : 'Agregar sesion'}
      </Button>
    </form>
  );
}
