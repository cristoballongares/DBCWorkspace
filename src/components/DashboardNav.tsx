'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { Role } from '@prisma/client';

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const problemsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const contestsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const invitationsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const signOutIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();

  const items: NavItem[] = [
    { href: '/problems', label: 'Problemas', icon: problemsIcon },
    { href: '/contests', label: 'Contests', icon: contestsIcon },
  ];

  if (role === 'ADMIN') {
    items.push({ href: '/admin/invitations', label: 'Invitaciones', icon: invitationsIcon });
  }

  return (
    <nav className="flex h-screen w-60 flex-shrink-0 flex-col border-r border-border-default bg-bg-surface">
      <div className="px-4 py-5">
        <span className="text-sm font-semibold tracking-wide text-text-primary">DBCWorkspace</span>
      </div>
      <div className="flex-1 space-y-0.5 px-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition-colors duration-150 ${
                isActive
                  ? 'border-link-focus bg-accent-muted text-link-focus'
                  : 'border-transparent text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-auto border-t border-border-default px-2 py-3">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full cursor-pointer items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
        >
          {signOutIcon}
          Cerrar sesion
        </button>
      </div>
    </nav>
  );
}
