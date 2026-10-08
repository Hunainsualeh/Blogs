export type ApiResult<T = Record<string, unknown>> = {
  ok: boolean;
  error?: string;
  errors?: Record<string, string>;
  data?: T;
};

export async function adminRequest<T = Record<string, unknown>>(method: "POST" | "PUT" | "PATCH" | "DELETE", url: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string; errors?: Record<string, string> } & T;
    return { ok: payload.ok, error: payload.error, errors: payload.errors, data: payload };
  } catch {
    return { ok: false, error: "The server could not be reached. Please try again." };
  }
}
