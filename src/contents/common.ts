import type { NotionClientError } from "@notionhq/client";
import { type InfiniteQueryExecuteOptions } from "@tanstack/query-core";

interface NotionInfiniteResponse<T> {
  next_cursor: string | null;
  results: T[];
}

export type InfiniteNotionQueryOptions<T> = InfiniteQueryExecuteOptions<
  NotionInfiniteResponse<T>,
  NotionClientError,
  T[],
  string[],
  string | null
>

export const getCommonInfiniteQueryOptions = <T>(
  queryOptions: Omit<InfiniteNotionQueryOptions<T>, 'initialPageParam'>,
) => ({
  pages: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.next_cursor,
  select: (data) => data.pages.flatMap((page) => page.results),
  ...queryOptions,
} satisfies InfiniteNotionQueryOptions<T>);
