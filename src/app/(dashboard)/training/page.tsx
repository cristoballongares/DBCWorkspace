import Link from 'next/link';
import { listCalendars } from '@/services/training.service';
import { Button } from '@/components/ui/Button';

export default async function TrainingPage() {
  const calendars = await listCalendars();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text-primary">Calendario de entrenamiento</h1>
        <Link href="/training/new">
          <Button>Nueva semana</Button>
        </Link>
      </div>

      {calendars.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay semanas de entrenamiento.</p>
      ) : (
        <div className="space-y-2">
          {calendars.map((calendar) => {
            const planned = calendar.sessions.reduce((sum, s) => sum + (s.plannedProblems ?? 0), 0);
            const actual = calendar.sessions.reduce((sum, s) => sum + (s.actualProblems ?? 0), 0);
            return (
              <Link
                key={calendar.id}
                href={`/training/${calendar.id}`}
                className="block rounded-md border border-border-default bg-bg-surface p-4 hover:bg-bg-elevated"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-primary">
                    Semana del {new Date(calendar.weekStart).toLocaleDateString()}
                  </p>
                  <p className="font-mono text-xs text-text-secondary">
                    {actual} / {planned} problemas
                  </p>
                </div>
                {calendar.planNotes && <p className="mt-1 text-sm text-text-muted">{calendar.planNotes}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
