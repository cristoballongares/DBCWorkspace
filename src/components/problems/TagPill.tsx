export function TagPill({ name }: { name: string }) {
  return (
    <span className="rounded-sm bg-bg-elevated px-2 py-0.5 font-mono text-xs text-text-secondary">
      {name}
    </span>
  );
}
