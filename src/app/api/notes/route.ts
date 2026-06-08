import { headers } from "next/headers";

import { ensureUserOrganization } from "@/lib/organizations";
import {
  ensureNotesIndexes,
  getEmptyNoteContent,
  getNotesCollection,
  serializeNote,
  type NoteDocument,
} from "@/lib/notes";
import { requireApiSession } from "@/lib/session";
import { noteCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = await headers();
  const organization = await ensureUserOrganization(session, requestHeaders);
  await ensureNotesIndexes();

  const notes = await getNotesCollection();
  const results = await notes
    .find({
      userId: session.user.id,
      organizationId: organization.id,
    })
    .sort({ updatedAt: -1 })
    .toArray();

  return Response.json({
    notes: results.map(serializeNote),
    organization,
  });
}

export async function POST(request: Request) {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = noteCreateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid note payload" },
      { status: 400 }
    );
  }

  const requestHeaders = await headers();
  const organization = await ensureUserOrganization(session, requestHeaders);
  await ensureNotesIndexes();

  const now = new Date();
  const note: NoteDocument = {
    id: crypto.randomUUID(),
    userId: session.user.id,
    organizationId: organization.id,
    title: parsed.data.title,
    content: parsed.data.content ?? getEmptyNoteContent(),
    text: parsed.data.text,
    createdAt: now,
    updatedAt: now,
  };

  const notes = await getNotesCollection();
  await notes.insertOne(note);

  return Response.json({ note: serializeNote(note) }, { status: 201 });
}
