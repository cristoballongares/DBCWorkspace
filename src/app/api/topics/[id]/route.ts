import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { updateTopicSchema } from '@/lib/validations/topic';
import { deleteTopic, updateTopic } from '@/services/topic.service';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = updateTopicSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const topic = await updateTopic(params.id, parsed.data, session.user.id);
    return NextResponse.json(topic);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    await deleteTopic(params.id, session.user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
