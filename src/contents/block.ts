import type { ListBlockChildrenResponse } from "@notionhq/client";
import type { AstroIntegrationLogger } from "astro";

import { getQueryClient, notionClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

interface Block {
  id: string;
  has_children?: boolean;
}

type WithChildren<T> = T & {
  children: ListBlockChildrenResponse['results'];
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

  return async <T extends Block>(block: T): Promise<WithChildren<T>> => {
    if (block.has_children === false) {
      return Object.assign(structuredClone(block), { children: [] });
    }
  
    const rawChildren = await getChildrenByBlockId(block.id);
    const children = await Promise.all(rawChildren.map((withChildren(logger))));
  
    return Object.assign(structuredClone(block), { children })
  };
  
}