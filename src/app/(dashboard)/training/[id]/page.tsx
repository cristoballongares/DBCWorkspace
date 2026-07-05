import { notFound } from 'next/navigation';
import { getCalendar } from '@/services/training.service';
import { SessionForm } from '@/components/training/SessionForm';
import { SessionRow } from '@/components/training/SessionRow';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function CalendarDetailPage({ params }: { params: { id: string } }) {
  const calendar = await getCalendar(params.id);

  if (!calendar) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Entrenamiento', href: '/training' },
          { label: `Semana del ${new Date(calendar.weekStart).toLocaleDateString()}` },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">
        Semana del {new Date(calendar.weekStart).toLocaleDateString()}
      </h1>
      {calendar.planNotes && <p className="text-sm text-text-secondary">{calendar.planNotes}</p>}

      <SessionForm calendarId={calendar.id} />

      {calendar.sessions.length === 0 ? (
        <p className="text-sm text-text-muted">Todavia no hay sesiones registradas.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border-default">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-2.5 font-medium">Miembro</th>
                <th className="px-4 py-2.5 font-medium">Fecha</th>
                <th className="px-4 py-2.5 font-medium">Planeados</th>
                <th className="px-4 py-2.5 font-medium">Reales</th>
                <th className="px-4 py-2.5 font-medium">Notas</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {calendar.sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
