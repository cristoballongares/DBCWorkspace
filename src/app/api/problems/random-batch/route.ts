import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { randomBatchSchema } from '@/lib/validations/problem';
import { getRandomProblemsBatch } from '@/services/problem.service';

export async function POST(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = randomBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const groups = await getRandomProblemsBatch(parsed.data.buckets);
    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
