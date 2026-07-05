'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight, common } from 'lowlight';
import { MathInline } from '@/lib/tiptap/math-extension';

const lowlight = createLowlight(common);

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      MathInline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'min-h-[10rem] rounded-sm border border-border-default bg-bg-surface px-3 py-2 text-sm text-text-primary focus:border-link-focus focus:outline-none prose prose-invert prose-sm max-w-none',
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  if (!editor) return null;

  function insertMath() {
    const latex = window.prompt('LaTeX');
    if (!latex) return;
    editor?.chain().focus().insertMath(latex).run();
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          Negrita
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Cursiva
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Codigo
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Lista
        </ToolbarButton>
        <ToolbarButton onClick={insertMath}>LaTeX</ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm border border-border-default px-2 py-1 text-xs ${
        active ? 'bg-link-focus text-white' : 'bg-bg-elevated text-text-secondary hover:border-border-strong'
      }`}
    >
      {children}
    </button>
  );
}
