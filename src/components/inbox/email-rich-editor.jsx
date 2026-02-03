'use client';

/**
 * TipTap Rich Text Editor for Email Composer
 * Features: Bold, Italic, Underline, Lists, Links, Images, Text Align
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Code,
  Undo,
  Redo,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

// Toolbar button component
function ToolbarButton({ icon: Icon, label, active, onClick, disabled }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', active && 'bg-accent text-accent-foreground')}
            onClick={onClick}
            disabled={disabled}
          >
            <Icon className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Link popover for inserting links
function LinkPopover({ editor }) {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const setLink = useCallback(() => {
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setUrl('');
    setOpen(false);
  }, [editor, url]);

  const handleOpen = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href;
      setUrl(previousUrl || '');
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn('h-7 w-7', editor.isActive('link') && 'bg-accent text-accent-foreground')}
        >
          <Link2 className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium">Insert Link</p>
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={setLink}>
              {editor.isActive('link') ? 'Update' : 'Insert'}
            </Button>
            {editor.isActive('link') && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  editor.chain().focus().unsetLink().run();
                  setOpen(false);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Image popover for inserting images
function ImagePopover({ editor }) {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const addImage = useCallback(() => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setUrl('');
    setOpen(false);
  }, [editor, url]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
          <ImageIcon className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-2">
          <p className="text-sm font-medium">Insert Image</p>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
          />
          <Button size="sm" onClick={addImage}>
            Insert
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Main Editor Component
export function EmailRichEditor({
  content = '',
  onChange,
  placeholder = 'Write your message...',
  className,
  editorClassName,
  showToolbar = true,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[150px] px-3 py-2',
          'prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-blockquote:my-2',
          editorClassName
        ),
      },
    },
  });

  // Update content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-0.5 px-2 py-1 border-b flex-wrap">
          {/* Undo/Redo */}
          <ToolbarButton
            icon={Undo}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarButton
            icon={Redo}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
          <div className="w-px h-4 bg-border mx-1" />

          {/* Text formatting */}
          <ToolbarButton
            icon={Bold}
            label="Bold (Ctrl+B)"
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon={Italic}
            label="Italic (Ctrl+I)"
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <ToolbarButton
            icon={UnderlineIcon}
            label="Underline (Ctrl+U)"
            active={editor.isActive('underline')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          />
          <div className="w-px h-4 bg-border mx-1" />

          {/* Lists */}
          <ToolbarButton
            icon={List}
            label="Bullet list"
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon={ListOrdered}
            label="Numbered list"
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <div className="w-px h-4 bg-border mx-1" />

          {/* Block elements */}
          <ToolbarButton
            icon={Quote}
            label="Quote"
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
          <ToolbarButton
            icon={Code}
            label="Code"
            active={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()}
          />
          <div className="w-px h-4 bg-border mx-1" />

          {/* Alignment */}
          <ToolbarButton
            icon={AlignLeft}
            label="Align left"
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          />
          <ToolbarButton
            icon={AlignCenter}
            label="Align center"
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          />
          <ToolbarButton
            icon={AlignRight}
            label="Align right"
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          />
          <div className="w-px h-4 bg-border mx-1" />

          {/* Links and Images */}
          <LinkPopover editor={editor} />
          <ImagePopover editor={editor} />
        </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export default EmailRichEditor;
