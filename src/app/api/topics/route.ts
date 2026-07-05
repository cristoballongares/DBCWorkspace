import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createTopicSchema } from '@/lib/validations/topic';
import { createTopic, listTopics } from '@/services/topic.service';

export async function GET() {
  try {
    await requireSession();
    const topics = await listTopics();
    return NextResponse.json(topics);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createTopicSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const topic = await createTopic(parsed.data, session.user.id);
    return NextResponse.json(topic, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
