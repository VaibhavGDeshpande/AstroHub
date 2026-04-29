"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, List, ListOrdered, Quote, Youtube as YoutubeIcon } from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
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

        let hasImage = false;
        for (const item of items) {
          if (item.type.indexOf('image') === 0) {
            hasImage = true;
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              uploadImage(file).then((url) => {
                if (url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              });
            }
          }
        }
        return hasImage; // Stop default paste if we handled an image
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

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
      {/* Fixed Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-2 flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('bold') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('italic') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-slate-800 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-slate-800 mx-1"></div>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('bulletList') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('orderedList') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('blockquote') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-slate-800 mx-1"></div>

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-slate-800 transition-colors ${editor.isActive('link') ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400"
          title="Add Image URL (You can also paste images directly)"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addYoutubeVideo}
          className="p-2 rounded hover:bg-slate-800 transition-colors text-slate-400 hover:text-red-400"
          title="Add YouTube Video"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Bubble Menu for highlighting text */}
      {editor && (
        <BubbleMenu editor={editor} className="bg-slate-800 shadow-xl border border-slate-700 rounded-lg overflow-hidden flex shadow-black/50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors ${editor.isActive('bold') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors border-l border-slate-700 ${editor.isActive('italic') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-2 px-3 text-sm font-medium hover:bg-slate-700 transition-colors border-l border-slate-700 ${editor.isActive('link') ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
          >
            Link
          </button>
        </BubbleMenu>
      )}

      {/* Editor Content Area */}
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
