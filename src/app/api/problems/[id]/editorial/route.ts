import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { upsertEditorialSchema } from '@/lib/validations/editorial';
import { deleteEditorial, getEditorialByProblem, upsertEditorial } from '@/services/editorial.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const editorial = await getEditorialByProblem(params.id);

    if (!editorial) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(editorial);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = upsertEditorialSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const editorial = await upsertEditorial(params.id, session.user.id, parsed.data);
    return NextResponse.json(editorial);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    await deleteEditorial(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
