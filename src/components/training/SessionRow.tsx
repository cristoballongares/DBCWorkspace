'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SessionData = {
  id: string;
  date: string | Date;
  plannedProblems: number | null;
  actualProblems: number | null;
  notes: string | null;
  user: { name: string };
};

export function SessionRow({ session }: { session: SessionData }) {
  const router = useRouter();
  const [actualProblems, setActualProblems] = useState(session.actualProblems?.toString() ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave() {
    setIsSubmitting(true);
    await fetch(`/api/training/sessions/${session.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actualProblems: actualProblems ? Number(actualProblems) : undefined }),
    });
    setIsSubmitting(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm('Eliminar esta sesion?')) return;
    await fetch(`/api/training/sessions/${session.id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <tr className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated">
      <td className="px-4 py-2.5 font-medium text-text-primary">{session.user.name}</td>
      <td className="px-4 py-2.5 text-xs text-text-muted">
        {new Date(session.date).toLocaleDateString()}
      </td>
      <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">
        {session.plannedProblems ?? '-'}
      </td>
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            value={actualProblems}
            onChange={(e) => setActualProblems(e.target.value)}
            className="w-20"
          />
          <Button variant="secondary" onClick={handleSave} disabled={isSubmitting}>
            Guardar
          </Button>
        </div>
      </td>
      <td className="px-4 py-2.5 text-xs text-text-muted">{session.notes ?? '-'}</td>
      <td className="px-4 py-2.5">
        <Button variant="destructive" onClick={handleDelete}>
          Eliminar
        </Button>
      </td>
    </tr>
  );
}
