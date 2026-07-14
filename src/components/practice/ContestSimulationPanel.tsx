'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/problems/DifficultyBadge';
import { StatusBadge } from '@/components/problems/StatusBadge';
import { TagPill } from '@/components/problems/TagPill';

const STORAGE_KEY = 'practice-simulation-session';

type RandomProblem = {
  id: string;
  title: string;
  source: string | null;
  url: string | null;
  difficulty: Difficulty;
  status: ProblemStatus;
  tags: { tag: { id: string; name: string } }[];
};

type Group = {
  requested: number;
  tag?: string;
  difficulty?: string;
  problems: RandomProblem[];
};

type Session = {
  endAt: number;
  durationMin: number;
  hideTags: boolean;
  groups: Group[];
  problems: RandomProblem[];
  solvedIds: string[];
};

type BucketRow = {
  id: string;
  tag: string;
  difficulty: string;
  onlyUnsolved: boolean;
  count: number;
};

function emptyBucket(): BucketRow {
  return { id: crypto.randomUUID(), tag: '', difficulty: '', onlyUnsolved: true, count: 3 };
}

function bucketLabel(group: Group) {
  const parts = [group.tag || 'Cualquier tag', group.difficulty || 'cualquier dificultad'];
  return parts.join(' · ');
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function ProblemRow({
  problem,
  hideTags,
  onMarkSolved,
}: {
  problem: RandomProblem;
  hideTags: boolean;
  onMarkSolved: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border-default bg-bg-surface p-3">
      <div className="space-y-1">
        <p className="font-medium text-text-primary">{problem.title}</p>
        {problem.source && <p className="text-xs text-text-muted">{problem.source}</p>}
        {!hideTags && (
          <div className="flex flex-wrap gap-1">
            {problem.tags.map(({ tag: t }) => (
              <TagPill key={t.id} name={t.name} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={problem.status} />
        <DifficultyBadge difficulty={problem.difficulty} />
        {problem.url && (
          <a href={problem.url} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="secondary" className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong">
              Enunciado
            </Button>
          </a>
        )}
        <Link href={`/problems/${problem.id}`}>
          <Button type="button" variant="secondary" className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong">
            Detalle
          </Button>
        </Link>
        {problem.status === 'UNSOLVED' && (
          <Button type="button" onClick={() => onMarkSolved(problem.id)}>
            Marcar resuelto
          </Button>
        )}
      </div>
    </div>
  );
}

export function ContestSimulationPanel({ tags }: { tags: { id: string; name: string }[] }) {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const [durationMin, setDurationMin] = useState(120);
  const [buckets, setBuckets] = useState<BucketRow[]>([emptyBucket()]);
  const [hideTags, setHideTags] = useState(true);
  const [starting, setStarting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [session]);

  function persist(next: Session | null) {
    setSession(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function addBucket() {
    setBuckets((prev) => [...prev, emptyBucket()]);
  }

  function removeBucket(id: string) {
    setBuckets((prev) => (prev.length > 1 ? prev.filter((b) => b.id !== id) : prev));
  }

  function updateBucket(id: string, patch: Partial<BucketRow>) {
    setBuckets((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function startSimulation() {
    setStarting(true);
    setWarnings([]);

    const response = await fetch('/api/problems/random-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buckets: buckets.map((b) => ({
          tag: b.tag || undefined,
          difficulty: b.difficulty || undefined,
          onlyUnsolved: b.onlyUnsolved,
          count: b.count,
        })),
      }),
    });
    setStarting(false);

    if (!response.ok) return;

    const { groups } = (await response.json()) as { groups: Group[] };

    const shortfalls = groups
      .filter((g) => g.problems.length < g.requested)
      .map((g) => `Solo se encontraron ${g.problems.length} de ${g.requested} pedidos para "${bucketLabel(g)}".`);
    setWarnings(shortfalls);

    const flat = groups.flatMap((g) => g.problems);

    persist({
      endAt: Date.now() + durationMin * 60_000,
      durationMin,
      hideTags,
      groups,
      problems: hideTags ? shuffle(flat) : flat,
      solvedIds: [],
    });
  }

  async function markSolved(problemId: string) {
    if (!session) return;
    const response = await fetch(`/api/problems/${problemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SOLVED_INDIVIDUAL' }),
    });

    if (response.ok) {
      const markResolved = (p: RandomProblem) =>
        p.id === problemId ? { ...p, status: 'SOLVED_INDIVIDUAL' as const } : p;

      persist({
        ...session,
        solvedIds: [...session.solvedIds, problemId],
        problems: session.problems.map(markResolved),
        groups: session.groups.map((g) => ({ ...g, problems: g.problems.map(markResolved) })),
      });
    }
  }

  function endSimulation() {
    persist(null);
    setBuckets([emptyBucket()]);
  }

  if (!hydrated) {
    return <div className="h-32 w-full animate-pulse rounded-md bg-bg-surface" />;
  }

  if (session) {
    const remainingMs = session.endAt - now;
    const finished = remainingMs <= 0;
    const totalProblems = session.problems.length;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border-default bg-bg-surface p-4">
          <div>
            <p className="text-xs text-text-secondary">Tiempo restante</p>
            <p className={`font-mono text-2xl font-semibold ${remainingMs < 5 * 60_000 ? 'text-red-500' : 'text-text-primary'}`}>
              {finished ? 'Tiempo terminado' : formatTime(remainingMs)}
            </p>
          </div>
          <div className="text-sm text-text-secondary">
            Resueltos: {session.solvedIds.length} / {totalProblems}
          </div>
          <Button
            type="button"
            variant="secondary"
            className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong"
            onClick={endSimulation}
          >
            Terminar simulacro
          </Button>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-1 rounded-md border border-yellow-800 bg-yellow-950/30 p-3 text-sm text-yellow-400">
            {warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </div>
        )}

        {session.hideTags ? (
          <div className="space-y-2">
            {session.problems.map((problem) => (
              <ProblemRow key={problem.id} problem={problem} hideTags onMarkSolved={markSolved} />
            ))}
          </div>
        ) : (
          session.groups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-sm font-medium text-text-secondary">{bucketLabel(group)}</h3>
              <div className="space-y-2">
                {group.problems.map((problem) => (
                  <ProblemRow key={problem.id} problem={problem} hideTags={false} onMarkSolved={markSolved} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border-default bg-bg-surface p-4 space-y-3">
        <div className="space-y-1">
          <label className="text-xs text-text-secondary">Duración (minutos)</label>
          <Input
            type="number"
            min={1}
            value={durationMin}
            onChange={(e) => setDurationMin(Math.max(1, Number(e.target.value) || 1))}
            className="w-[120px] bg-bg-base border-border-default text-text-primary"
          />
        </div>

        <div className="space-y-2">
          {buckets.map((bucket) => (
            <div key={bucket.id} className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <label className="text-xs text-text-secondary">Etiqueta</label>
                <Select
                  value={bucket.tag}
                  onChange={(e) => updateBucket(bucket.id, { tag: e.target.value })}
                  className="w-[160px]"
                >
                  <option value="">Cualquiera (variado)</option>
                  {tags.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary">Dificultad</label>
                <Select
                  value={bucket.difficulty}
                  onChange={(e) => updateBucket(bucket.id, { difficulty: e.target.value })}
                  className="w-[120px]"
                >
                  <option value="">Cualquiera</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="UNRATED">Unrated</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-text-secondary">Cantidad</label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={bucket.count}
                  onChange={(e) => updateBucket(bucket.id, { count: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-[80px] bg-bg-base border-border-default text-text-primary"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 pb-1.5 text-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={bucket.onlyUnsolved}
                  onChange={(e) => updateBucket(bucket.id, { onlyUnsolved: e.target.checked })}
                />
                Solo sin resolver
              </label>

              {buckets.length > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong"
                  onClick={() => removeBucket(bucket.id)}
                >
                  Quitar
                </Button>
              )}
            </div>
          ))}
        </div>

        <label className="flex cursor-pointer items-start gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={hideTags}
            onChange={(e) => setHideTags(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Ocultar tags y mezclar problemas (simular contest real)
            <span className="block text-xs text-text-muted">
              Sin esto, ver los grupos y sus etiquetas revela de qué tema es cada problema.
            </span>
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="button" variant="secondary" className="bg-bg-elevated text-text-primary hover:bg-border-strong border-border-strong" onClick={addBucket}>
            + Agregar grupo
          </Button>
          <Button type="button" onClick={startSimulation} disabled={starting}>
            {starting ? 'Preparando...' : 'Iniciar simulacro'}
          </Button>
        </div>
      </div>
    </div>
  );
}
