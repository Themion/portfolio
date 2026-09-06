import type { AstroIntegrationLogger } from "astro";

import { withChildren } from "./block";
import { getQueryClient, notionClient } from "./client";
import { getCommonInfiniteQueryOptions } from "./common";

const getDataSourceQueryKey = (dataSourceId: string) => ['data-source', dataSourceId];

const getDataSourceQueryOptions = (data_source_id: string) => getCommonInfiniteQueryOptions({
  queryKey: getDataSourceQueryKey(data_source_id),
  queryFn: ({ pageParam }) => notionClient.dataSources.query({
    data_source_id,
    start_cursor: pageParam,
  }),
})

export const getDataSource = (dataSourceId: string) => {
  const queryOptions = getDataSourceQueryOptions(dataSourceId);

  return async (logger: AstroIntegrationLogger) => {
    const queryClient = getQueryClient(logger);
    const techStackMapper = withChildren(logger);

    const rawDataSource = await queryClient.infiniteQuery(queryOptions);
    return await Promise.all(rawDataSource.map(techStackMapper));
  };
}
