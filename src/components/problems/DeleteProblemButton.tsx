'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function DeleteProblemButton({ problemId }: { problemId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Eliminar este problema? Esta accion no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    const response = await fetch(`/api/problems/${problemId}`, { method: 'DELETE' });
    setIsDeleting(false);

    if (response.ok) {
      router.push('/problems');
      router.refresh();
    }
  }

  return (
    <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}
