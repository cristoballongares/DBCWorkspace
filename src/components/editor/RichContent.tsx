'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

export function RichContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.querySelectorAll<HTMLElement>('[data-type="math-inline"]').forEach((node) => {
      const latex = node.getAttribute('data-latex') || '';
      try {
        node.innerHTML = katex.renderToString(latex, { throwOnError: false, displayMode: false });
      } catch {
        node.textContent = latex;
      }
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose prose-invert prose-sm max-w-none text-text-primary"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
