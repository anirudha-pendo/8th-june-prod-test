"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api-client";
import type { SettingsResponse } from "@/lib/types";

export const settingsQueryKey = ["settings"] as const;

export function useSettings() {
  return useQuery({
    queryKey: settingsQueryKey,
    queryFn: ({ signal }) =>
      apiRequest<SettingsResponse>("/api/settings", {
        signal,
      }),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name?: string;
      image?: string;
      organizationName?: string;
    }) =>
      apiRequest<SettingsResponse>("/api/settings", {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsQueryKey });
      void queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
