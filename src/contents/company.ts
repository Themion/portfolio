import { withChildren } from "./block";
import { notionClient, queryClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

export const getCompaniesQueryKey = () => ['company'];

export const getCompaniesQueryOptions = getCommonInfiniteQueryOptions({
  queryKey: getCompaniesQueryKey(),
  queryFn: ({ pageParam }) => notionClient.dataSources.query({
    data_source_id: import.meta.env.NOTION_COMPANY_DATASOURCE,
    start_cursor: pageParam,
  }),
});

export const getCompaniesQuery = async () => {
  const rawCompanies = await queryClient.infiniteQuery(getCompaniesQueryOptions);
  return await Promise.all(rawCompanies.map(withChildren));
};
