import { getTeamStats } from '@/services/dashboard.service';

export default async function TeamPage() {
  const team = await getTeamStats();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-text-primary">Equipo</h1>

      <div className="overflow-x-auto rounded-md border border-border-default">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
              <th className="px-4 py-2.5 font-medium">Nombre</th>
              <th className="px-4 py-2.5 font-medium">Rol</th>
              <th className="px-4 py-2.5 font-medium">Soluciones</th>
              <th className="px-4 py-2.5 font-medium">Rating</th>
              <th className="px-4 py-2.5 font-medium">Ultimo contest</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.id} className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated">
                <td className="px-4 py-2.5 font-medium text-text-primary">{member.name}</td>
                <td className="px-4 py-2.5 text-xs text-text-muted">{member.role}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">{member.solutionCount}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-text-secondary">
                  {member.rating !== null ? member.rating.toFixed(1) : '-'}
                </td>
                <td className="px-4 py-2.5 text-xs text-text-muted">{member.lastContest ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
