"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api-client";
import type { Note, NotesResponse } from "@/lib/types";

export const notesQueryKey = ["notes"] as const;

export function useNotes() {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: ({ signal }) =>
      apiRequest<NotesResponse>("/api/notes", {
        signal,
      }),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (note: Pick<Note, "title" | "content" | "text">) =>
      apiRequest<{ note: Note }>("/api/notes", {
        method: "POST",
        body: note,
      }),
    onSuccess: (result) => {
      queryClient.setQueryData<NotesResponse>(notesQueryKey, (current) =>
        current
          ? {
              ...current,
              notes: [result.note, ...current.notes],
            }
          : current
      );
      void queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noteId,
      ...payload
    }: Partial<Pick<Note, "title" | "content" | "text">> & {
      noteId: string;
    }) =>
      apiRequest<{ note: Note }>(`/api/notes/${noteId}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) =>
      apiRequest<{ ok: true }>(`/api/notes/${noteId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notesQueryKey });
    },
  });
}
