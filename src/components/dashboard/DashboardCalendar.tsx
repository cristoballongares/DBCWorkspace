'use client';

import { Calendar } from '@/components/ui/calendar';

export function DashboardCalendar({ dates }: { dates: Date[] }) {
  return (
    <Calendar
      className="rounded-md border border-border-default bg-bg-surface w-fit mx-auto"
      modifiers={{
        booked: dates
      }}
      modifiersClassNames={{
        booked: "bg-link-focus text-white font-bold rounded-full"
      }}
    />
  );
}
