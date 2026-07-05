'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export function TableFilters({ tags }: { tags: { id: string; name: string }[] }) {
  const [q, setQ] = useQueryState('q', parseAsString.withDefault(''));
  const [tag, setTag] = useQueryState('tag', parseAsString.withDefault(''));
  const [difficulty, setDifficulty] = useQueryState('difficulty', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));

  const hasFilters = q || tag || difficulty || status;

  const clearFilters = () => {
    setQ('');
    setTag('');
    setDifficulty('');
    setStatus('');
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-md border border-border-default bg-bg-surface p-4">
      <div className="min-w-[12rem] flex-1 space-y-1">
        <label className="text-xs text-text-secondary" htmlFor="q">
          Buscar por título
        </label>
        <Input 
          id="q" 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="Ej. is:unsolved difficulty:HARD" 
          className="bg-bg-base border-border-default text-text-primary"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary">Etiqueta</label>
        <Select value={tag} onChange={(e) => setTag(e.target.value)} className="w-[140px]">
          <option value="">Todas</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary">Dificultad</label>
        <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-[120px]">
          <option value="">Todas</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
          <option value="UNRATED">Unrated</option>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-text-secondary">Estado</label>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-[160px]">
          <option value="">Todos</option>
          <option value="UNSOLVED">No resuelto</option>
          <option value="SOLVED_INDIVIDUAL">Resuelto individual</option>
          <option value="SOLVED_TEAM">Resuelto en equipo</option>
        </Select>
      </div>

      {hasFilters && (
        <Button type="button" variant="secondary" onClick={clearFilters} className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong">
          Limpiar
        </Button>
      )}
    </div>
  );
}
