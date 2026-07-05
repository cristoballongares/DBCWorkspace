import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createSolutionSchema } from '@/lib/validations/solution';
import { createSolution, listSolutionsByProblem } from '@/services/solution.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const solutions = await listSolutionsByProblem(params.id);
    return NextResponse.json(solutions);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createSolutionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const solution = await createSolution(params.id, session.user.id, parsed.data);
    return NextResponse.json(solution, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
