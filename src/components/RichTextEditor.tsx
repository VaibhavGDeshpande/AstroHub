"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon,
  Image as ImageIcon, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Youtube as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Upload, Undo, Redo, Code, Strikethrough, Minus,
  Type
} from 'lucide-react';
import { useCallback, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

/* ─── tiny helpers ─────────────────────────────────────── */
const btn = (active: boolean, extra = '') =>
  `p-1.5 rounded-md transition-all duration-150 ${extra} ${
    active
      ? 'bg-indigo-600/30 text-indigo-300 ring-1 ring-indigo-500/50'
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }`;

const Divider = () => <div className="w-px h-5 bg-slate-700/60 mx-0.5 self-center" />;

const ToolbarSection = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-0.5">{children}</div>
);

/* ─── WebP conversion (client-side, Canvas API) ─────────── */
function convertToWebP(file: File, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    // If already WebP or AVIF, skip conversion
    if (file.type === 'image/webp' || file.type === 'image/avif') {
      return resolve(file);
    }
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) { URL.revokeObjectURL(url); return resolve(file); }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return resolve(file);
          const name = file.name.replace(/\.[^.]+$/, '.webp');
          resolve(new File([blob], name, { type: 'image/webp' }));
        },
        'image/webp',
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

/* ─── Get natural dimensions of an image URL ──────────── */
function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 800, height: 600 }); // sensible fallback
    img.src = src;
  });
}

/* ─── Convert file to WebP base64 data URL (no upload) ── */
async function fileToWebPBase64(file: File): Promise<string> {
  const webpFile = await convertToWebP(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(webpFile);
  });
}

/* ─── Extended Tiptap Image with loading, width, height ── */
const LazyImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      loading: {
        default: 'lazy',
        parseHTML: (element: HTMLElement) => element.getAttribute('loading') || 'lazy',
        renderHTML: (attributes: Record<string, string>) => {
          return { loading: attributes.loading };
        },
      },
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('width'),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('height'),
        renderHTML: (attributes: Record<string, string>) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
    };
  },
});

/* ─── component ──────────────────────────────────────────── */
export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Explicitly allow all heading levels so H1/H2/H3 work
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      LazyImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg max-w-full mx-auto my-4',
          style: 'aspect-ratio: attr(width) / attr(height); height: auto;',
        },
      }),
      Link.configure({ openOnClick: false }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: { class: 'w-full aspect-video rounded-xl shadow-lg my-6' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your article…' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor
        .getHTML()
        .replaceAll('<p></p>', '<p>&nbsp;</p>')
        .replaceAll('<p><br></p>', '<p>&nbsp;</p>');
      isInternalUpdate.current = true;
      onChange(html);
    },
    editorProps: {
      attributes: {
  class: [
    'focus:outline-none min-h-[400px] max-w-none',
    // Headings
    '[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:leading-tight',
    '[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:leading-tight',
    '[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:leading-tight',
    // Paragraphs
    '[&_p]:text-slate-300 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:font-serif [&_p]:text-xl',
    // Drop cap
    '[&>p:first-of-type]:first-letter:text-7xl [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:text-white [&>p:first-of-type]:first-letter:mr-4 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-[0.8] [&>p:first-of-type]:first-letter:mt-2 [&>p:first-of-type]:first-letter:font-serif',
    // Lists
    '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:text-slate-300 [&_ul]:font-serif [&_ul]:text-xl',
    '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:text-slate-300 [&_ol]:font-serif [&_ol]:text-xl',
    '[&_li]:mb-2',
    // Blockquote
    '[&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4',
    // Code
    '[&_code]:bg-slate-800 [&_code]:text-emerald-400 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm',
    '[&_pre]:bg-slate-800 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-4',
    // Links
    '[&_a]:text-indigo-400 [&_a]:underline [&_a]:underline-offset-2',
    // HR
    '[&_hr]:border-slate-700 [&_hr]:my-6',
    // Strong / em
    '[&_strong]:text-white [&_strong]:font-bold',
    '[&_em]:italic',
  ].join(' '),
},
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        let handled = false;
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              handled = true;
              event.preventDefault();
              fileToWebPBase64(file).then(async (src) => {
                const dims = await getImageDimensions(src);
                const { schema } = view.state;
                const node = schema.nodes.image.create({
                  src,
                  loading: 'lazy',
                  width: String(dims.width),
                  height: String(dims.height),
                });
                view.dispatch(view.state.tr.replaceSelectionWith(node));
              });
            }
          }
        }
        return handled;
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []).filter((f) =>
          f.type.startsWith('image/')
        );
        if (!files.length) return false;
        event.preventDefault();
        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        const pos = coords?.pos ?? view.state.selection.from;
        files.forEach((file) => {
          fileToWebPBase64(file).then(async (src) => {
            const dims = await getImageDimensions(src);
            const { schema } = view.state;
            view.dispatch(view.state.tr.insert(pos, schema.nodes.image.create({
              src,
              loading: 'lazy',
              width: String(dims.width),
              height: String(dims.height),
            })));
          });
        });
        return true;
      },
    },
  });

  /* Keep editor in sync when `content` prop changes externally */
  useEffect(() => {
    if (!editor) return;
    // Skip resync when the change came from the editor itself (user typing)
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    const current = editor.getHTML();
    if (current !== content) editor.commands.setContent(content, { emitUpdate: false });
  }, [content]);           // eslint-disable-line react-hooks/exhaustive-deps

  /* ── action callbacks ─── */
  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', prev ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  }, [editor]);

  const addImageFromUrl = useCallback(async () => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (url) {
      const dims = await getImageDimensions(url);
      editor.chain().focus().setImage({
        src: url,
        width: dims.width,
        height: dims.height,
      }).run();
    }
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube URL');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      const files = Array.from(e.target.files ?? []).filter((f) =>
        f.type.startsWith('image/')
      );
      for (const file of files) {
        const src = await fileToWebPBase64(file);
        const dims = await getImageDimensions(src);
        editor.chain().focus().setImage({
          src,
          width: dims.width,
          height: dims.height,
        }).run();
      }
      e.target.value = '';
    },
    [editor]
  );

  const insertDivider = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().setHorizontalRule().run();
  }, [editor]);

  /* ── word / char count ─── */
  const text = editor?.state.doc.textContent ?? '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  if (!editor) return null;

  return (
    <div className="border border-slate-700/60 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl shadow-black/40">

      {/* ── Toolbar ────────────────────────────────────── */}
      <div className="bg-slate-900/80 backdrop-blur border-b border-slate-700/60 px-3 py-2 flex flex-wrap gap-1.5 items-center">

        {/* History */}
        <ToolbarSection>
          <button type="button" onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)">
            <Undo className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)">
            <Redo className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <Divider />

        {/* Headings */}
        <ToolbarSection>
          <button type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={btn(editor.isActive('paragraph'))}
            title="Paragraph">
            <Type className="w-4 h-4" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={btn(editor.isActive('heading', { level: 1 }))}
            title="Heading 1">
            <Heading1 className="w-4 h-4" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={btn(editor.isActive('heading', { level: 2 }))}
            title="Heading 2">
            <Heading2 className="w-4 h-4" />
          </button>
          <button type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={btn(editor.isActive('heading', { level: 3 }))}
            title="Heading 3">
            <Heading3 className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <Divider />

        {/* Inline marks */}
        <ToolbarSection>
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
            className={btn(editor.isActive('bold'))} title="Bold (Ctrl+B)">
            <Bold className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
            className={btn(editor.isActive('italic'))} title="Italic (Ctrl+I)">
            <Italic className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={btn(editor.isActive('underline'))} title="Underline (Ctrl+U)">
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}
            className={btn(editor.isActive('strike'))} title="Strikethrough">
            <Strikethrough className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}
            className={btn(editor.isActive('code'))} title="Inline Code">
            <Code className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <Divider />

        {/* Alignment */}
        <ToolbarSection>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={btn(editor.isActive({ textAlign: 'left' }))} title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={btn(editor.isActive({ textAlign: 'center' }))} title="Align Center">
            <AlignCenter className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={btn(editor.isActive({ textAlign: 'right' }))} title="Align Right">
            <AlignRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={btn(editor.isActive({ textAlign: 'justify' }))} title="Justify">
            <AlignJustify className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <Divider />

        {/* Lists, quote, rule */}
        <ToolbarSection>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btn(editor.isActive('bulletList'))} title="Bullet List">
            <List className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btn(editor.isActive('orderedList'))} title="Ordered List">
            <ListOrdered className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={btn(editor.isActive('blockquote'))} title="Blockquote">
            <Quote className="w-4 h-4" />
          </button>
          <button type="button" onClick={insertDivider}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
            title="Horizontal Rule">
            <Minus className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <Divider />

        {/* Media */}
        <ToolbarSection>
          <button type="button" onClick={setLink}
            className={btn(editor.isActive('link'))} title="Insert Link">
            <LinkIcon className="w-4 h-4" />
          </button>
          <button type="button" onClick={addImageFromUrl}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
            title="Image from URL">
            <ImageIcon className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-all"
            title="Upload Image">
            <Upload className="w-4 h-4" />
          </button>
          <button type="button" onClick={addYoutube}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all"
            title="Embed YouTube">
            <YoutubeIcon className="w-4 h-4" />
          </button>
        </ToolbarSection>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* ── Bubble Menu ─────────────────────────────────── */}
      <BubbleMenu
        editor={editor}
        // @ts-expect-error - Tiptap types missing tippyOptions
        tippyOptions={{ duration: 150, placement: 'top' }}
        className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden flex shadow-xl shadow-black/50"
      >
        {[
          { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), className: 'font-bold' },
          { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), className: 'italic' },
          { label: 'U', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), className: 'underline' },
          { label: 'S', action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive('strike'), className: 'line-through' },
        ].map(({ label, action, active, className }, i) => (
          <button key={label} type="button" onClick={action}
            className={`px-3 py-1.5 text-sm ${className} ${i > 0 ? 'border-l border-slate-700' : ''} transition-colors ${
              active ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-700'
            }`}>
            {label}
          </button>
        ))}
        <button type="button" onClick={setLink}
          className={`px-3 py-1.5 text-sm border-l border-slate-700 transition-colors ${
            editor.isActive('link') ? 'bg-indigo-600/40 text-indigo-200' : 'text-slate-300 hover:bg-slate-700'
          }`}>
          Link
        </button>
        <div className="border-l border-slate-700 flex">
          {(['left', 'center', 'right'] as const).map((align) => {
            const Icon = align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight;
            return (
              <button key={align} type="button"
                onClick={() => editor.chain().focus().setTextAlign(align).run()}
                className={`px-2 py-1.5 transition-colors ${
                  editor.isActive({ textAlign: align }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'
                }`}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </BubbleMenu>

      {/* ── Editor Area ─────────────────────────────────── */}
      <div className="p-6 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-slate-600 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0">
        <EditorContent editor={editor} />
      </div>

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="px-6 py-2.5 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <ImageIcon className="w-3 h-3" />
          <span>Paste, drag & drop, or upload images directly</span>
        </div>
        <div className="text-xs text-slate-600 tabular-nums">
          {wordCount} words · {charCount} chars
        </div>
      </div>
    </div>
  );
}