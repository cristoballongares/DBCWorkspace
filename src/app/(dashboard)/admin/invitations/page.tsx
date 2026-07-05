'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Invitation = {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  token: string;
  acceptedAt: string | null;
  expiresAt: string;
};

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [error, setError] = useState<string | null>(null);

  async function loadInvitations() {
    const response = await fetch('/api/invitations');
    if (response.ok) {
      setInvitations(await response.json());
    }
  }

  useEffect(() => {
    loadInvitations();
  }, []);

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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MEMBER')}
          className="rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary"
        >
          <option value="MEMBER">MEMBER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <Button type="submit">Generar link</Button>
      </form>

      {error && <p className="text-sm text-status-pending">{error}</p>}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default text-left text-text-secondary">
            <th className="py-2">Email</th>
            <th className="py-2">Rol</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => (
            <tr key={invitation.id} className="border-b border-border-default text-text-primary">
              <td className="py-2">{invitation.email}</td>
              <td className="py-2">{invitation.role}</td>
              <td className="py-2">
                {invitation.acceptedAt ? 'Aceptada' : 'Pendiente'}
              </td>
              <td className="py-2 font-mono text-xs text-link-focus">
                {invitation.acceptedAt
                  ? '—'
                  : `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${invitation.token}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
