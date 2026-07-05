import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DashboardNav } from '@/components/DashboardNav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <DashboardNav role={session.user.role} />
      <SidebarInset className="bg-bg-base transition-all duration-300 ease-in-out min-w-0 flex-1">
        <main className="flex-1 overflow-x-hidden p-8 w-full min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
