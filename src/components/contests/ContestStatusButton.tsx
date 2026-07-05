'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ContestStatus } from '@prisma/client';
import { Button } from '@/components/ui/Button';

const NEXT_STATUS: Partial<Record<ContestStatus, ContestStatus>> = {
  SCHEDULED: 'RUNNING',
  RUNNING: 'FROZEN',
  FROZEN: 'FINISHED',
};

const NEXT_LABEL: Partial<Record<ContestStatus, string>> = {
  SCHEDULED: 'Iniciar contest',
  RUNNING: 'Congelar scoreboard',
  FROZEN: 'Finalizar contest',
};

export function ContestStatusButton({
  contestId,
  status,
}: {
  contestId: string;
  status: ContestStatus;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStatus = NEXT_STATUS[status];
  if (!nextStatus) return null;

  async function handleClick() {
    setIsSubmitting(true);
    const response = await fetch(`/api/contests/${contestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    setIsSubmitting(false);

    if (response.ok) {
      router.refresh();
    }
  }

  return (
    <Button onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? 'Actualizando...' : NEXT_LABEL[status]}
    </Button>
  );
}
