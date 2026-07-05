'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CalendarForm() {
  const router = useRouter();
  const [weekStart, setWeekStart] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch('/api/training/calendars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weekStart, planNotes: planNotes || undefined }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo crear la semana');
      return;
    }

    const calendar = await response.json();
    router.push(`/training/${calendar.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="weekStart">
          Inicio de semana
        </label>
        <Input
          id="weekStart"
          type="date"
          required
          value={weekStart}
          onChange={(e) => setWeekStart(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-text-secondary" htmlFor="planNotes">
          Notas del plan
        </label>
        <textarea
          id="planNotes"
          rows={3}
          value={planNotes}
          onChange={(e) => setPlanNotes(e.target.value)}
          className="w-full rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-link-focus focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creando...' : 'Crear semana'}
      </Button>
    </form>
  );
}
