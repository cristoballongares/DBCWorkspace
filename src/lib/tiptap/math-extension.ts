import { Node, mergeAttributes } from '@tiptap/core';
import katex from 'katex';

export interface MathInlineOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mathInline: {
      insertMath: (latex: string) => ReturnType;
    };
  }
}

function renderKatex(latex: string) {
  try {
    return katex.renderToString(latex, { throwOnError: false, displayMode: false });
  } catch {
    return latex;
  }
}

export const MathInline = Node.create<MathInlineOptions>({
  name: 'mathInline',
  group: 'inline',
  inline: true,
  atom: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      latex: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-latex') || '',
        renderHTML: (attributes) => ({ 'data-latex': attributes.latex }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="math-inline"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'math-inline' }),
      node.attrs.latex,
    ];
  },

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const span = document.createElement('span');
      span.setAttribute('data-type', 'math-inline');
      span.setAttribute('data-latex', node.attrs.latex);
      span.className = 'inline-block cursor-pointer rounded-sm px-0.5 hover:bg-bg-elevated';
      span.innerHTML = renderKatex(node.attrs.latex || '\\text{...}');

      span.addEventListener('click', () => {
        if (!editor.isEditable) return;
        const next = window.prompt('LaTeX', node.attrs.latex);
        if (next === null) return;
        const pos = typeof getPos === 'function' ? getPos() : undefined;
        if (pos === undefined) return;
        editor
          .chain()
          .focus()
          .command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, { latex: next });
            return true;
          })
          .run();
      });

      return { dom: span };
    };
  },

  addCommands() {
    return {
      insertMath:
        (latex: string) =>
        ({ chain }) =>
          chain()
            .insertContent({ type: this.name, attrs: { latex } })
            .run(),
    };
  },
});
