import { notFound } from 'next/navigation';
import { getContest } from '@/services/contest.service';
import { getPostMortem } from '@/services/postmortem.service';
import { PostMortemForm } from '@/components/contests/PostMortemForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default async function EditPostMortemPage({ params }: { params: { id: string } }) {
  const contest = await getContest(params.id);

  if (!contest) {
    notFound();
  }

  const postMortem = await getPostMortem(contest.id);

  return (
    <div className="max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Contests', href: '/contests' },
          { label: contest.name, href: `/contests/${contest.id}` },
          { label: 'Post-mortem' },
        ]}
      />
      <h1 className="text-2xl font-semibold text-text-primary">Post-mortem: {contest.name}</h1>
      <PostMortemForm
        contestId={contest.id}
        initialValues={{
          whatWorked: postMortem?.whatWorked ?? '',
          whatFailed: postMortem?.whatFailed ?? '',
          actionItems: postMortem?.actionItems ?? '',
        }}
      />
    </div>
  );
}
