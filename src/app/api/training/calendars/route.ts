import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createCalendarSchema } from '@/lib/validations/training';
import { createCalendar, listCalendars } from '@/services/training.service';

export async function GET() {
  try {
    await requireSession();
    const calendars = await listCalendars();
    return NextResponse.json(calendars);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = createCalendarSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const calendar = await createCalendar(parsed.data);
    return NextResponse.json(calendar, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
