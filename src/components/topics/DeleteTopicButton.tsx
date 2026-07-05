'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function DeleteTopicButton({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm('Eliminar este tema? Esta accion no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);
    const response = await fetch(`/api/topics/${topicId}`, { method: 'DELETE' });
    setIsDeleting(false);

    if (response.ok) {
      router.push('/topics');
      router.refresh();
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Eliminando...' : 'Eliminar'}
    </Button>
  );
}
