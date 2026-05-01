"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold, Italic, Link as LinkIcon, Image as ImageIcon,
  Heading1, Heading2, List, ListOrdered, Quote,
  Youtube as YoutubeIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Upload
} from 'lucide-react';
import { useCallback, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const btnClass = (active: boolean) =>
  `p-2 rounded hover:bg-slate-800 transition-colors ${active ? 'bg-slate-800 text-white' : 'text-slate-400'}`;
const divider = <div className="w-px h-6 bg-slate-800 mx-1" />;

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl shadow-lg max-w-full mx-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        inline: false,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl shadow-lg my-6',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px]',
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
              
              const insertImage = (src: string) => {
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src });
                const transaction = view.state.tr.replaceSelectionWith(node);
                view.dispatch(transaction);
              };

              uploadImage(file).then((url) => {
                if (url) {
                  insertImage(url);
                } else {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const result = e.target?.result as string;
                    if (result) insertImage(result);
                  };
                  reader.readAsDataURL(file);
                }
              }).catch(() => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const result = e.target?.result as string;
                  if (result) insertImage(result);
                };
                reader.readAsDataURL(file);
              });
            }
          }
        }
        return handled;
      },
      handleDrop: (view, event) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (imageFiles.length === 0) return false;

        event.preventDefault();
        
        const insertImageAt = (src: string, pos: number) => {
          const { schema } = view.state;
          const node = schema.nodes.image.create({ src });
          const transaction = view.state.tr.insert(pos, node);
          view.dispatch(transaction);
        };

        const coords = view.posAtCoords({ left: event.clientX, top: event.clientY });
        const pos = coords ? coords.pos : view.state.selection.from;

        imageFiles.forEach(file => {
          uploadImage(file).then((url) => {
            if (url) {
              insertImageAt(url, pos);
            } else {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) insertImageAt(result, pos);
              };
              reader.readAsDataURL(file);
            }
          }).catch(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              if (result) insertImageAt(result, pos);
            };
            reader.readAsDataURL(file);
          });
        });
        return true;
      },
    },
  });

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
    return null;
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return; 
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('YouTube Video URL');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const url = await uploadImage(file);
        if (url) {
          editor.chain().focus().setImage({ src: url }).run();
        }
      }
    }
    // Reset so the same file can be selected again
    e.target.value = '';
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
      {/* Fixed Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-1 items-center">
        {/* Text formatting */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
          <Bold className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
          <Italic className="w-4 h-4" />
        </button>
        
        {divider}
        
        {/* Headings */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Heading 1">
          <Heading1 className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Heading 2">
          <Heading2 className="w-4 h-4" />
        </button>
        
        {divider}

        {/* Alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justify">
          <AlignJustify className="w-4 h-4" />
        </button>

        {divider}
        
        {/* Lists & Quote */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List">
          <List className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Blockquote">
          <Quote className="w-4 h-4" />
        </button>

        {divider}

        {/* Links & Media */}
        <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))} title="Add Link">
          <LinkIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={addImageFromUrl} className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400" title="Add Image from URL">
          <ImageIcon className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-emerald-400" title="Upload Image from Device">
          <Upload className="w-4 h-4" />
        </button>
        <button type="button" onClick={addYoutubeVideo} className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-red-400" title="Add YouTube Video">
          <YoutubeIcon className="w-4 h-4" />
        </button>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Floating Bubble Menu for highlighting text */}
      {editor && (
        <BubbleMenu editor={editor} className="bg-slate-800 shadow-xl border border-slate-700 rounded-lg overflow-hidden flex shadow-black/50">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors ${editor.isActive('bold') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            Bold
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors border-l border-slate-700 ${editor.isActive('italic') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            Italic
          </button>
          <button type="button" onClick={setLink} className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors border-l border-slate-700 ${editor.isActive('link') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            Link
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 px-2 hover:bg-slate-700 transition-colors border-l border-slate-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 px-2 hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 px-2 hover:bg-slate-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-700 text-white' : 'text-slate-300'}`}>
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </BubbleMenu>
      )}

      {/* Editor Content Area */}
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>

      {/* Drag hint */}
      <div className="px-6 pb-3 text-xs text-slate-600 flex items-center gap-2">
        <ImageIcon className="w-3 h-3" />
        Paste, drag & drop, or upload images directly into the editor
      </div>
    </div>
  );
}
