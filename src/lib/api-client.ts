/** 型付き fetch ラッパー */

export class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail?: string,
  ) {
    super(title)
    this.name = 'ApiError'
  }
}

type ApiResponse<T> = {
  data: T
  meta: { generatedAt: string; cacheHit: boolean }
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(path, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value)
      }
    }
  }

  const res = await fetch(url.toString(), { signal })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(
      res.status,
      body.title ?? `HTTP ${res.status}`,
      body.detail,
    )
  }

  const json = (await res.json()) as ApiResponse<T>
  return json.data
}
