'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import type { Role } from '@prisma/client';

export function DashboardNav({ role }: { role: Role }) {
  return (
    <nav className="flex w-56 flex-col justify-between border-r border-border-default bg-bg-surface p-4">
      <div className="space-y-1">
        <Link href="/problems" className="block rounded-sm px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated">
          Problemas
        </Link>
        {role === 'ADMIN' && (
          <Link
            href="/admin/invitations"
            className="block rounded-sm px-3 py-2 text-sm text-text-primary hover:bg-bg-elevated"
          >
            Invitaciones
          </Link>
        )}
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="rounded-sm px-3 py-2 text-left text-sm text-text-secondary hover:bg-bg-elevated"
      >
        Cerrar sesion
      </button>
    </nav>
  );
}
