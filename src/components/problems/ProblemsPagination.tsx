'use client';

import { useTransition } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';
import { Button } from '@/components/ui/Button';

export function ProblemsPagination({
  total,
  pageSize,
}: {
  total: number;
  pageSize: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: false, startTransition }),
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, total);

  if (total === 0) return null;

  return (
    <div
      className={`flex items-center justify-between gap-3 text-sm text-text-secondary transition-opacity ${isPending ? 'opacity-60' : ''}`}
    >
      <span>
        Mostrando {from}-{to} de {total} problemas
      </span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong"
          disabled={currentPage <= 1}
          onClick={() => setPage(currentPage - 1)}
        >
          Anterior
        </Button>
        <span className="text-xs text-text-muted">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(currentPage + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
