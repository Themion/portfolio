import type { AstroIntegrationLogger } from "astro";

import type { Block } from "~/contents/components";

import { getQueryClient, notionClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

// Loose on purpose — shared by page and block objects, which only have `id`/`has_children` in common.
interface Identifiable {
  id: string;
  has_children?: boolean;
}

type WithChildren<T> = T & {
  children: Block[];
}

export const getBlockQueryKey = (block_id: string) => ['block-children', block_id];

export const getBlockQueryOptions = (block_id: string) => getCommonInfiniteQueryOptions({
  queryKey: getBlockQueryKey(block_id),
  queryFn: ({ pageParam }) => notionClient.blocks.children.list({
    block_id,
    start_cursor: pageParam,
  }),
})

export const getBlockQuery = (logger: AstroIntegrationLogger) => {
  const queryClient = getQueryClient(logger);

  return async (blockId: string) => {
    return await queryClient.infiniteQuery(getBlockQueryOptions(blockId));
  };
}

export const withChildren = (logger: AstroIntegrationLogger) => {
  const getChildrenByBlockId = getBlockQuery(logger);

  return async <T extends Identifiable>(block: T): Promise<WithChildren<T>> => {
    if (block.has_children === false) {
      return Object.assign(structuredClone(block), { children: [] });
    }

    const rawChildren = await getChildrenByBlockId(block.id);
    const children = await Promise.all(rawChildren.map((withChildren(logger))));

    // Assumes the integration never gets back a permission-restricted (partial) block.
    return Object.assign(structuredClone(block), { children }) as WithChildren<T>;
  };
}
  