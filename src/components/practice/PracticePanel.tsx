'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { TagPill } from '@/components/problems/TagPill';

type RandomProblem = {
  id: string;
  title: string;
  source: string | null;
  url: string | null;
  difficulty: Difficulty;
  status: ProblemStatus;
  tags: { tag: { id: string; name: string } }[];
};

export function PracticePanel({ tags }: { tags: { id: string; name: string }[] }) {
  const [tag, setTag] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [onlyUnsolved, setOnlyUnsolved] = useState(true);

  const [problem, setProblem] = useState<RandomProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function fetchRandomProblem() {
    setLoading(true);
    setNotFound(false);

    const params = new URLSearchParams();
    if (tag) params.set('tag', tag);
    if (difficulty) params.set('difficulty', difficulty);
    if (onlyUnsolved) params.set('onlyUnsolved', 'true');

    const response = await fetch(`/api/problems/random?${params.toString()}`);
    setLoading(false);

    if (response.status === 404) {
      setProblem(null);
      setNotFound(true);
      return;
    }

    if (response.ok) {
      setProblem(await response.json());
    }
  }

  async function markSolved() {
    if (!problem) return;
    setMarking(true);
    const response = await fetch(`/api/problems/${problem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SOLVED_INDIVIDUAL' }),
    });
    setMarking(false);

    if (response.ok) {
      await fetchRandomProblem();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-md border border-border-default bg-bg-surface p-4">
        <div className="space-y-1">
          <label className="text-xs text-text-secondary">Etiqueta</label>
          <Select value={tag} onChange={(e) => setTag(e.target.value)} className="w-[160px]">
            <option value="">Todas (variado)</option>
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

        <label className="flex cursor-pointer items-center gap-2 pb-1.5 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={onlyUnsolved}
            onChange={(e) => setOnlyUnsolved(e.target.checked)}
          />
          Solo problemas sin resolver
        </label>

        <Button type="button" onClick={fetchRandomProblem} disabled={loading}>
          {loading ? 'Buscando...' : problem ? 'Otro problema al azar' : 'Buscar problema'}
        </Button>
      </div>

      {notFound && (
        <p className="text-sm text-text-muted">No hay problemas que cumplan esos filtros.</p>
      )}

      {problem && (
        <div className="space-y-3 rounded-md border border-border-default bg-bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-text-primary">{problem.title}</h2>
              {problem.source && <p className="text-xs text-text-muted">{problem.source}</p>}
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={problem.status} />
              <DifficultyBadge difficulty={problem.difficulty} />
            </div>
          </div>

          {problem.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {problem.tags.map(({ tag: t }) => (
                <TagPill key={t.id} name={t.name} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {problem.url && (
              <a href={problem.url} target="_blank" rel="noopener noreferrer">
                <Button type="button" variant="secondary" className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong">
                  Abrir enunciado
                </Button>
              </a>
            )}
            <Link href={`/problems/${problem.id}`}>
              <Button type="button" variant="secondary" className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong">
                Ver detalle
              </Button>
            </Link>
            {problem.status === 'UNSOLVED' && (
              <Button type="button" onClick={markSolved} disabled={marking}>
                {marking ? 'Guardando...' : 'Marcar como resuelto'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
