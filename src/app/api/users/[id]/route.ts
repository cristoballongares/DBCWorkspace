import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { deleteUser } from '@/services/user.service';

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAdmin();
    await deleteUser(params.id, session.user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'CANNOT_DELETE_SELF') {
      return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
