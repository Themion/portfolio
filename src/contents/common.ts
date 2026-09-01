import type { NotionClientError, QueryDataSourceResponse } from "@notionhq/client";
import { type InfiniteQueryExecuteOptions } from "@tanstack/query-core";

import type { NotionAPIPage } from "~/types";

export type InfiniteNotionQueryOptions<TQueryKey extends string[] = string[]> = InfiniteQueryExecuteOptions<
  QueryDataSourceResponse,
  NotionClientError,
  NotionAPIPage[],
  TQueryKey,
  string | null
>

export const commonInfiniteQueryOptions = {
  pages: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.next_cursor,
  select: (data) => data.pages.flatMap((page) => page.results),
} satisfies Partial<InfiniteNotionQueryOptions>;
