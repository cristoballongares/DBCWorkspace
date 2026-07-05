import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createContestSchema } from '@/lib/validations/contest';
import { createContest, listContests } from '@/services/contest.service';

export async function GET() {
  try {
    await requireSession();
    const contests = await listContests();
    return NextResponse.json(contests);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createContestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const contest = await createContest(parsed.data, session.user.id);
    return NextResponse.json(contest, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
