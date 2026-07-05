import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createProblemSchema } from '@/lib/validations/problem';
import { createProblem, listProblems } from '@/services/problem.service';

export async function GET() {
  try {
    await requireSession();
    const problems = await listProblems();
    return NextResponse.json(problems);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = createProblemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const problem = await createProblem(parsed.data);
    return NextResponse.json(problem, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
