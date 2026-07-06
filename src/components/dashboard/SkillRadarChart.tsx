import type { SkillStat } from '@/services/skill.service';

const SIZE = 300;
const CENTER = SIZE / 2;
const RADIUS = 100;
const RINGS = [1 / 3, 2 / 3, 1];

function pointAt(index: number, count: number, fraction: number) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
  return {
    x: CENTER + RADIUS * fraction * Math.cos(angle),
    y: CENTER + RADIUS * fraction * Math.sin(angle),
  };
}

function polygonPoints(count: number, fraction: number) {
  return Array.from({ length: count }, (_, i) => {
    const { x, y } = pointAt(i, count, fraction);
    return `${x},${y}`;
  }).join(' ');
}

export function SkillRadarChart({ stats }: { stats: SkillStat[] }) {
  const count = stats.length;
  const dataPoints = stats.map((stat, i) => pointAt(i, count, stat.percentage / 100));

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Radar de habilidades por area" className="w-full max-w-[300px]">
      {RINGS.map((fraction) => (
        <polygon
          key={fraction}
          points={polygonPoints(count, fraction)}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={1}
        />
      ))}

      {stats.map((stat, i) => {
        const { x, y } = pointAt(i, count, 1);
        return (
          <line
            key={stat.area}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="var(--accent-muted)"
        stroke="var(--link-focus)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {stats.map((stat, i) => {
        const p = dataPoints[i];
        if (!p) return null;
        return (
          <circle key={stat.area} cx={p.x} cy={p.y} r={3} fill="var(--link-focus)">
            <title>
              {stat.area}: {stat.solved}/{stat.total} ({stat.percentage}%)
            </title>
          </circle>
        );
      })}

      {stats.map((stat, i) => {
        const { x, y } = pointAt(i, count, 1.22);
        const anchor = Math.abs(x - CENTER) < 4 ? 'middle' : x > CENTER ? 'start' : 'end';
        return (
          <text
            key={stat.area}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill="var(--text-secondary)"
            fontSize={11}
            fontWeight={600}
          >
            {stat.area}
          </text>
        );
      })}
    </svg>
  );
}
