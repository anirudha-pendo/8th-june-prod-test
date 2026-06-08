import { ensureNotesIndexes, getNotesCollection, serializeNote } from "@/lib/notes";
import { requireApiSession } from "@/lib/session";
import { noteUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

type NoteRouteContext = {
  params: Promise<{
    noteId: string;
  }>;
};

export async function PATCH(request: Request, context: NoteRouteContext) {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await context.params;
  const parsed = noteUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid note payload" },
      { status: 400 }
    );
  }

  await ensureNotesIndexes();

  const notes = await getNotesCollection();
  const updated = await notes.findOneAndUpdate(
    {
      id: noteId,
      userId: session.user.id,
    },
    {
      $set: {
        ...parsed.data,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!updated) {
    return Response.json({ message: "Note not found" }, { status: 404 });
  }

  return Response.json({ note: serializeNote(updated) });
}

export async function DELETE(_request: Request, context: NoteRouteContext) {
  const session = await requireApiSession();

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { noteId } = await context.params;
  await ensureNotesIndexes();

  const notes = await getNotesCollection();
  const result = await notes.deleteOne({
    id: noteId,
    userId: session.user.id,
  });

  if (!result.deletedCount) {
    return Response.json({ message: "Note not found" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
