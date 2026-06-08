export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type JsonBody = Record<string, unknown> | unknown[];

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: Omit<RequestInit, "body"> & { body?: JsonBody }
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      payload?.message ?? "Request failed. Please try again.",
      response.status
    );
  }

  return payload as T;
}
