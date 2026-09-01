import { notionClient, queryClient } from "./client";
import { commonInfiniteQueryOptions, type InfiniteNotionQueryOptions } from "./common";

export const getCompaniesQueryKey = () => ['company'];

export const getCompaniesQueryOptions: InfiniteNotionQueryOptions = {
  ...commonInfiniteQueryOptions,
  queryKey: getCompaniesQueryKey(),
  queryFn: ({ pageParam }) => notionClient.dataSources.query({
    data_source_id: import.meta.env.NOTION_COMPANY_DATASOURCE,
    start_cursor: pageParam,
  }),
}

export const getCompaniesQuery = async () => {
  return await queryClient.infiniteQuery(getCompaniesQueryOptions);
};
