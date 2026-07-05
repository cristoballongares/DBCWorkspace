import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { updateProblemSchema } from '@/lib/validations/problem';
import { deleteProblem, getProblem, updateProblem } from '@/services/problem.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const problem = await getProblem(params.id);

    if (!problem) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = updateProblemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const problem = await updateProblem(params.id, parsed.data);
    return NextResponse.json(problem);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    await deleteProblem(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
