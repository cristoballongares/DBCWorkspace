import { CalendarForm } from '@/components/training/CalendarForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function NewCalendarPage() {
  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Entrenamiento', href: '/training' }, { label: 'Nueva semana' }]} />
      <h1 className="text-2xl font-semibold text-text-primary">Nueva semana de entrenamiento</h1>
      <CalendarForm />
    </div>
  );
}
