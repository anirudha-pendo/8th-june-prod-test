import "server-only";

import type { Collection } from "mongodb";

import { getDb } from "@/lib/mongodb";
import type { Note } from "@/lib/types";

export type NoteDocument = {
  id: string;
  userId: string;
  organizationId: string;
  title: string;
  content: unknown;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

const emptyContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

let indexesPromise: Promise<void> | undefined;

export function getEmptyNoteContent() {
  return emptyContent;
}

export async function getNotesCollection(): Promise<Collection<NoteDocument>> {
  const db = await getDb();

  return db.collection<NoteDocument>("notes");
}

export async function ensureNotesIndexes() {
  if (!indexesPromise) {
    indexesPromise = getNotesCollection().then(async (notes) => {
      await Promise.all([
        notes.createIndex({ userId: 1, organizationId: 1, updatedAt: -1 }),
        notes.createIndex({ userId: 1, id: 1 }, { unique: true }),
      ]);
    });
  }

  return indexesPromise;
}

export function serializeNote(note: NoteDocument): Note {
  return {
    id: note.id,
    userId: note.userId,
    organizationId: note.organizationId,
    title: note.title,
    content: note.content,
    text: note.text,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}
