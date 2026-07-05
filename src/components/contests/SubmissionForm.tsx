'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type ContestProblemOption = { id: string; label: string; title: string };

export function SubmissionForm({
  contestId,
  problems,
}: {
  contestId: string;
  problems: ContestProblemOption[];
}) {
  const router = useRouter();
  const [contestProblemId, setContestProblemId] = useState(problems[0]?.id ?? '');
  const [verdict, setVerdict] = useState('AC');
  const [minutesFromStart, setMinutesFromStart] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch(`/api/contests/${contestId}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contestProblemId,
        verdict,
        minutesFromStart: Number(minutesFromStart),
      }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo registrar el envio');
      return;
    }

    setMinutesFromStart('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-md border border-border-default bg-bg-surface p-4">
      <div className="space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="contestProblemId">
          Problema
        </label>
        <Select
          id="contestProblemId"
          value={contestProblemId}
          onChange={(e) => setContestProblemId(e.target.value)}
        >
          {problems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label} - {p.title}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="verdict">
          Veredicto
        </label>
        <Select id="verdict" value={verdict} onChange={(e) => setVerdict(e.target.value)}>
          <option value="AC">AC</option>
          <option value="WA">WA</option>
          <option value="TLE">TLE</option>
          <option value="RE">RE</option>
          <option value="CE">CE</option>
          <option value="OTHER">Otro</option>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="minutesFromStart">
          Minuto del envio
        </label>
        <Input
          id="minutesFromStart"
          type="number"
          min={0}
          required
          value={minutesFromStart}
          onChange={(e) => setMinutesFromStart(e.target.value)}
          className="w-24"
        />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting || !contestProblemId}>
        {isSubmitting ? 'Registrando...' : 'Registrar envio'}
      </Button>
    </form>
  );
}
