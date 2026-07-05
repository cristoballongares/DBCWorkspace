'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';

export function EditorialForm({
  problemId,
  initialContent,
}: {
  problemId: string;
  initialContent?: string;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch(`/api/problems/${problemId}/editorial`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError('No se pudo guardar el editorial');
      return;
    }

    router.push(`/problems/${problemId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-text-secondary">Editorial (Markdown + LaTeX)</label>
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar editorial'}
      </Button>
    </form>
  );
}
