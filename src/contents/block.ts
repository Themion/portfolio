import { notionClient, queryClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

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
