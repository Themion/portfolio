import { notionClient, queryClient } from "./client";
import { commonInfiniteQueryOptions, type InfiniteNotionQueryOptions } from "./common";

export const getTechStacksQueryKey = () => ['techStack'];

export const getTechStacksQueryOptions: InfiniteNotionQueryOptions = {
  ...commonInfiniteQueryOptions,
  queryKey: getTechStacksQueryKey(),
  queryFn: ({ pageParam }) => notionClient.dataSources.query({
    data_source_id: import.meta.env.NOTION_TECH_STACK_DATASOURCE,
    start_cursor: pageParam,
  }),
}

export const getTechStacksQuery = async () => {
  return await queryClient.infiniteQuery(getTechStacksQueryOptions);
};
