"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  RedoIcon,
  TextBoldIcon,
  TextItalicIcon,
  UndoIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TiptapEditorProps = {
  content: unknown;
  onChange: (content: unknown, text: string) => void;
};

type ToolbarButtonProps = {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  label,
  isActive,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={isActive ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
          />
        }
        >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: content as never,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "tiptap-editor mx-auto min-h-[520px] w-full max-w-3xl px-6 py-8 focus:outline-none sm:px-10",
      },
    },
    onUpdate({ editor: activeEditor }) {
      onChange(activeEditor.getJSON(), activeEditor.getText());
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b bg-muted/25 px-3">
        <ToolbarButton
          label="Bold"
          isActive={editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <AppIcon icon={TextBoldIcon} data-icon="inline-start" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          isActive={editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <AppIcon icon={TextItalicIcon} data-icon="inline-start" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          isActive={editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <AppIcon icon={LeftToRightListBulletIcon} data-icon="inline-start" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          isActive={editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <AppIcon icon={LeftToRightListNumberIcon} data-icon="inline-start" />
        </ToolbarButton>
        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            label="Undo"
            disabled={!editor?.can().undo()}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <AppIcon icon={UndoIcon} data-icon="inline-start" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!editor?.can().redo()}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <AppIcon icon={RedoIcon} data-icon="inline-start" />
          </ToolbarButton>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="min-h-0 flex-1 overflow-auto bg-background"
      />
    </div>
  );
}
