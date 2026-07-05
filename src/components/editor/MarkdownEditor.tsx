'use client';

import { MarkdownContent } from './MarkdownContent';

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (source: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 divide-x divide-border-default rounded-sm border border-border-default">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={'Escribe en Markdown. LaTeX inline: $x^2$  ·  bloque: $$\\sum_{i=1}^n i$$'}
        className="min-h-[20rem] resize-y bg-bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
      />
      <div className="min-h-[20rem] overflow-y-auto bg-bg-base px-3 py-2">
        <MarkdownContent source={value} />
      </div>
    </div>
  );
}
