"use client";

import {
  Add01Icon,
  Delete02Icon,
  FileNotFoundIcon,
  MoreHorizontalIcon,
  NoteAddIcon,
  NoteIcon,
  SaveIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { TiptapEditor } from "@/components/notes/tiptap-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AppIcon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useUpdateNote,
} from "@/hooks/use-notes";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";

const emptyContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function NotesWorkspace() {
  const notesQuery = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const notes = useMemo(() => notesQuery.data?.notes ?? [], [notesQuery.data]);
  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return notes;
    }

    return notes.filter((note) =>
      `${note.title} ${note.text}`.toLowerCase().includes(query)
    );
  }, [notes, search]);
  const activeNote = useMemo(
    () => notes.find((note) => note.id === activeId) ?? notes[0],
    [activeId, notes]
  );

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const query = search.trim();
    if (!query) return;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      if (typeof window !== "undefined" && window.pendo) {
        pendo.track("notes_searched", {
          query,
          results_count: filteredNotes.length,
          total_notes_count: notes.length,
        });
      }
    }, 500);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search, filteredNotes.length, notes.length]);

  async function handleCreateNote() {
    const result = await createNote.mutateAsync({
      title: "Untitled note",
      content: emptyContent,
      text: "",
    });
    setActiveId(result.note.id);
    if (typeof window !== "undefined" && window.pendo) {
      pendo.track("note_created", {
        note_id: result.note.id,
        default_title: "Untitled note",
      });
    }
    toast.success("Note created");
  }

  async function handleDeleteNote(note: Note) {
    await deleteNote.mutateAsync(note.id);
    const nextNote = notes.find((item) => item.id !== note.id);
    setActiveId(nextNote?.id ?? null);
    if (typeof window !== "undefined" && window.pendo) {
      pendo.track("note_deleted", {
        note_id: note.id,
        remaining_notes_count: notes.length - 1,
      });
    }
    toast.success("Note deleted");
  }

  if (notesQuery.isPending) {
    return (
      <div className="grid w-full gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <Skeleton className="h-[calc(100vh-2.5rem)] rounded-lg" />
        <Skeleton className="h-[calc(100vh-2.5rem)] rounded-lg" />
      </div>
    );
  }

  if (notesQuery.isError) {
    return (
      <Empty className="min-h-[calc(100vh-7rem)] border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AppIcon icon={FileNotFoundIcon} />
          </EmptyMedia>
          <EmptyTitle>Unable to load notes</EmptyTitle>
          <EmptyDescription>{notesQuery.error.message}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => notesQuery.refetch()}>Retry</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid w-full gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="flex min-h-[20rem] flex-col overflow-hidden rounded-lg border bg-card/95 shadow-[0_24px_80px_-72px_rgba(15,23,42,0.75)] xl:h-[calc(100vh-2.5rem)]">
        <div className="flex shrink-0 items-start gap-3 border-b px-4 py-4">
          <div className="min-w-0 flex-1">
            <div className="font-editorial text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
              Library
            </div>
            <div className="mt-1 flex items-center gap-2">
              <div className="truncate text-lg font-medium">Notes</div>
              <Badge variant="secondary" className="font-editorial">
                {notes.length}
              </Badge>
            </div>
          </div>
          <Button
            size="icon"
            aria-label="Create note"
            onClick={handleCreateNote}
            disabled={createNote.isPending}
          >
            {createNote.isPending ? (
              <Spinner />
            ) : (
              <AppIcon icon={Add01Icon} />
            )}
          </Button>
        </div>
        <div className="border-b p-3">
          <div className="flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 text-muted-foreground">
            <AppIcon icon={Search01Icon} size={17} />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
              className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-2">
          {filteredNotes.length ? (
            <div className="flex flex-col gap-1.5">
              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setActiveId(note.id)}
                  className={cn(
                    "group relative flex min-h-20 w-full flex-col gap-1.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/70",
                    activeNote?.id === note.id &&
                      "bg-primary/5 text-foreground ring-1 ring-primary/15"
                  )}
                >
                  <span className="line-clamp-1 font-medium leading-5">
                    {note.title}
                  </span>
                  <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {note.text || "No body text"}
                  </span>
                  <span className="font-editorial text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {formatUpdatedAt(note.updatedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <Empty className="h-full border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AppIcon icon={NoteAddIcon} />
                </EmptyMedia>
                <EmptyTitle>No notes yet</EmptyTitle>
                <EmptyDescription>
                  Start with a clean document and save as you go.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={handleCreateNote} disabled={createNote.isPending}>
                  {createNote.isPending ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <AppIcon icon={Add01Icon} data-icon="inline-start" />
                  )}
                  New note
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </aside>

      <section className="flex min-h-[calc(100vh-2.5rem)] min-w-0 flex-col overflow-hidden rounded-lg border bg-card/95 shadow-[0_24px_80px_-72px_rgba(15,23,42,0.75)]">
        {activeNote ? (
          <NoteEditorPanel
            key={activeNote.id}
            note={activeNote}
            isSaving={updateNote.isPending}
            isDeleting={deleteNote.isPending}
            onSave={async (payload) => {
              await updateNote.mutateAsync(payload);
              if (typeof window !== "undefined" && window.pendo) {
                pendo.track("note_saved", {
                  note_id: payload.noteId,
                  title_length: payload.title.length,
                  content_length: JSON.stringify(payload.content).length,
                  text_length: payload.text.length,
                });
              }
              toast.success("Note saved");
            }}
            onDelete={handleDeleteNote}
          />
        ) : (
          <Empty className="min-h-full border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AppIcon icon={NoteIcon} />
              </EmptyMedia>
              <EmptyTitle>Select a note</EmptyTitle>
              <EmptyDescription>Your editor will appear here.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>
    </div>
  );
}

function NoteEditorPanel({
  note,
  isSaving,
  isDeleting,
  onSave,
  onDelete,
}: {
  note: Note;
  isSaving: boolean;
  isDeleting: boolean;
  onSave: (payload: {
    noteId: string;
    title: string;
    content: unknown;
    text: string;
  }) => Promise<void>;
  onDelete: (note: Note) => Promise<void>;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState<unknown>(note.content ?? emptyContent);
  const [text, setText] = useState(note.text);
  const [isDirty, setIsDirty] = useState(false);

  async function handleSaveNote() {
    await onSave({
      noteId: note.id,
      title,
      content,
      text,
    });
    setIsDirty(false);
  }

  return (
    <>
      <div className="flex shrink-0 items-center gap-3 border-b px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-editorial text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
            Document
          </div>
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setIsDirty(true);
            }}
            aria-label="Note title"
            className="h-10 border-0 px-0 text-2xl font-medium tracking-tight shadow-none focus-visible:ring-0"
          />
        </div>
        <Badge variant={isDirty ? "default" : "secondary"} className="font-editorial">
          {isDirty ? "Draft" : "Saved"}
        </Badge>
        <Button
          onClick={handleSaveNote}
          disabled={!isDirty || isSaving || !title.trim()}
          size="lg"
        >
          {isSaving ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <AppIcon icon={SaveIcon} data-icon="inline-start" />
          )}
          Save
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open note actions"
              />
            }
          >
            <AppIcon icon={MoreHorizontalIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(note)}
                disabled={isDeleting}
              >
                <AppIcon icon={Delete02Icon} data-icon="inline-start" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <TiptapEditor
        content={content}
        onChange={(nextContent, nextText) => {
          setContent(nextContent);
          setText(nextText);
          setIsDirty(true);
        }}
      />
    </>
  );
}
