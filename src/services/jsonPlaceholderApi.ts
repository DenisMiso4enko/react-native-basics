import type { JsonPlaceholderPost } from '../types/jsonPlaceholder';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

function assertOk(res: Response): void {
  if (!res.ok) {
    throw new Error(`Сервер ответил ${res.status}`);
  }
}

/** Ключи запросов — единое место, чтобы список и детали согласовывали кэш/invalidate. */
export const jsonPlaceholderQueryKeys = {
  /** Бесконечная прокрутка: размер страницы в ключе, чтобы кэши не смешивались. */
  postsInfinite: (pageSize: number) =>
    ['jsonPlaceholder', 'posts', 'infinite', pageSize] as const,
  post: (id: number) => ['jsonPlaceholder', 'post', id] as const,
};

/** Страница списка: JSONPlaceholder понимает `_start` + `_limit`. */
export async function fetchJsonPlaceholderPostsPage(params: {
  signal: AbortSignal;
  start: number;
  limit: number;
}): Promise<JsonPlaceholderPost[]> {
  const { signal, start, limit } = params;
  const url = `${BASE_URL}/posts?_start=${start}&_limit=${limit}`;
  const res = await fetch(url, { signal });
  assertOk(res);
  return (await res.json()) as JsonPlaceholderPost[];
}

export async function fetchJsonPlaceholderPost(
  id: number,
  signal: AbortSignal,
): Promise<JsonPlaceholderPost> {
  const res = await fetch(`${BASE_URL}/posts/${id}`, { signal });
  assertOk(res);
  return (await res.json()) as JsonPlaceholderPost;
}
