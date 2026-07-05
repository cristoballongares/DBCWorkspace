'use client';

import * as React from 'react';
import { Calendar } from '@/components/ui/calendar';

export function DashboardCalendar({ dates }: { dates: Date[] }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
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
