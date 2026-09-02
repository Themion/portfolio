import { withChildren } from "./block";
import { notionClient, queryClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

export const getTechStacksQueryKey = () => ['techStack'];

export const getTechStacksQueryOptions = getCommonInfiniteQueryOptions({
  queryKey: getTechStacksQueryKey(),
  queryFn: ({ pageParam }) => notionClient.dataSources.query({
    data_source_id: import.meta.env.NOTION_TECH_STACK_DATASOURCE,
    start_cursor: pageParam,
  }),
})

export const getTechStacksQuery = async () => {
  const rawTechStacks = await queryClient.infiniteQuery(getTechStacksQueryOptions);
  return await Promise.all(rawTechStacks.map(withChildren));
};
