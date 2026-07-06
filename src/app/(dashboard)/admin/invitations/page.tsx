'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

type Invitation = {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  token: string;
  acceptedAt: string | null;
  expiresAt: string;
};

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  createdAt: string;
};

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [userError, setUserError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadInvitations() {
    const response = await fetch('/api/invitations');
    if (response.ok) {
      setInvitations(await response.json());
    }
  }

  async function loadUsers() {
    const response = await fetch('/api/users');
    if (response.ok) {
      setUsers(await response.json());
    }
  }

  useEffect(() => {
    loadInvitations();
    loadUsers();
  }, []);

  async function handleDeleteUser(user: ManagedUser) {
    if (!confirm(`Eliminar a ${user.name}? Esta accion no se puede deshacer.`)) {
      return;
    }

    setUserError(null);
    setDeletingId(user.id);
    const response = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
    setDeletingId(null);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setUserError(body?.error ?? 'No se pudo eliminar el usuario');
      return;
    }

    await loadUsers();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const response = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    if (!response.ok) {
      setError('No se pudo crear la invitacion');
      return;
    }

    setEmail('');
    await loadInvitations();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text-primary">Invitaciones</h1>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="email@ejemplo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MEMBER')}
          className="w-auto"
        >
          <option value="MEMBER">MEMBER</option>
          <option value="ADMIN">ADMIN</option>
        </Select>
        <Button type="submit">Generar link</Button>
      </form>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <div className="overflow-x-auto rounded-md border border-border-default">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 font-medium">Estado</th>
              <th className="px-4 py-2.5 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr
                key={invitation.id}
                className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated"
              >
                <td className="px-4 py-2.5 text-text-primary">{invitation.email}</td>
                <td className="px-4 py-2.5 text-text-primary">{invitation.role}</td>
                <td className="px-4 py-2.5 text-text-primary">
                  {invitation.acceptedAt ? 'Aceptada' : 'Pendiente'}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-link-focus">
                  {invitation.acceptedAt
                    ? '-'
                    : `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${invitation.token}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1 className="text-2xl font-semibold text-text-primary">Usuarios</h1>

      {userError && <p className="text-sm text-status-pending">{userError}</p>}

      <div className="overflow-x-auto rounded-md border border-border-default">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated"
              >
                <td className="px-4 py-2.5 text-text-primary">{user.name}</td>
                <td className="px-4 py-2.5 text-text-primary">{user.email}</td>
                <td className="px-4 py-2.5 text-text-primary">{user.role}</td>
                <td className="px-4 py-2.5 text-right">
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteUser(user)}
                    disabled={deletingId === user.id}
                  >
                    {deletingId === user.id ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
