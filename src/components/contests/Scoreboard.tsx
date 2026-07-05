import type { ScoreboardRow } from '@/services/submission.service';

export function Scoreboard({ rows }: { rows: ScoreboardRow[] }) {
  const labels = rows[0]?.cells.map((c) => c.label) ?? [];

  return (
    <div className="overflow-x-auto rounded-md border border-border-default">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-default text-xs uppercase tracking-wide text-text-muted">
            <th className="px-4 py-2.5 font-medium">Equipo</th>
            {labels.map((label) => (
              <th key={label} className="px-4 py-2.5 text-center font-medium">
                {label}
              </th>
            ))}
            <th className="px-4 py-2.5 text-center font-medium">Resueltos</th>
            <th className="px-4 py-2.5 text-center font-medium">Penalidad</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId} className="border-b border-border-default last:border-b-0 hover:bg-bg-elevated">
              <td className="px-4 py-2.5 font-medium text-text-primary">{row.userName}</td>
              {row.cells.map((cell) => (
                <td key={cell.contestProblemId} className="px-4 py-2.5 text-center font-mono text-xs">
                  {cell.frozen && cell.solvedAtMin === null ? (
                    <span className="text-status-attempted">?</span>
                  ) : cell.solvedAtMin !== null ? (
                    <span className="text-status-solved">
                      +{cell.attempts > 0 ? `${cell.attempts}/` : ''}
                      {cell.solvedAtMin}
                    </span>
                  ) : cell.attempts > 0 ? (
                    <span className="text-status-pending">-{cell.attempts}</span>
                  ) : (
                    <span className="text-text-muted">-</span>
                  )}
                </td>
              ))}
              <td className="px-4 py-2.5 text-center font-mono text-xs text-text-secondary">
                {row.solvedCount}
              </td>
              <td className="px-4 py-2.5 text-center font-mono text-xs text-text-secondary">
                {row.totalPenalty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
