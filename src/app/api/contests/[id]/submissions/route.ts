import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createSubmissionSchema } from '@/lib/validations/submission';
import { createSubmission, listSubmissionsByContest } from '@/services/submission.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const submissions = await listSubmissionsByContest(params.id);
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const submission = await createSubmission(params.id, session.user.id, parsed.data);
    return NextResponse.json(submission, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
