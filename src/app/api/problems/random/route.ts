import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { getRandomProblem } from '@/services/problem.service';

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);

    const problem = await getRandomProblem({
      tag: searchParams.get('tag') || undefined,
      difficulty: searchParams.get('difficulty') || undefined,
      onlyUnsolved: searchParams.get('onlyUnsolved') === 'true',
    });

    if (!problem) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
