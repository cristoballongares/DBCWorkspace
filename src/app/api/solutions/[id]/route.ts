import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { updateSolutionSchema } from '@/lib/validations/solution';
import { deleteSolution, getSolution, updateSolution } from '@/services/solution.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const solution = await getSolution(params.id);

    if (!solution) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(solution);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = updateSolutionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const solution = await updateSolution(params.id, parsed.data);
    return NextResponse.json(solution);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    await deleteSolution(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
