import type { ListBlockChildrenResponse } from "@notionhq/client";

import { notionClient, queryClient } from "./client";
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

export const getBlockQuery = async (blockId: string) => {
  return await queryClient.infiniteQuery(getBlockQueryOptions(blockId));
};

export const withChildren = async <T extends Block>(block: T): Promise<WithChildren<T>> => {
  if (block.has_children === false) {
    return Object.assign(structuredClone(block), { children: [] });
  } 

  const rawChildren = await getBlockQuery(block.id);
  const children = await Promise.all(rawChildren.map(withChildren));

  return Object.assign(structuredClone(block), { children })
};
