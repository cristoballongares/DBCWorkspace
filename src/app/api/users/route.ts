import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { listUsers } from '@/services/user.service';

export async function GET() {
  try {
    await requireAdmin();
    const users = await listUsers();
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
