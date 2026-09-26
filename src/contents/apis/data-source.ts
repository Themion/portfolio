import type { QueryKey } from "@tanstack/query-core";
import type { AstroIntegrationLogger } from "astro";

import type { Filter } from "~/contents/types";

import { getQueryClient, notionClient } from "../client";
import { withChildren } from "./block";
import { getCommonInfiniteQueryOptions } from "./common";

const getDataSourceQueryKey = (dataSourceId: string, filter?: Filter) =>
  ["data-source", dataSourceId, filter] satisfies QueryKey;

const getDataSourceQueryOptions = (data_source_id: string, filter?: Filter) =>
  getCommonInfiniteQueryOptions({
    queryKey: getDataSourceQueryKey(data_source_id, filter),
    queryFn: ({ pageParam }) =>
      notionClient.dataSources.query({
        data_source_id,
        start_cursor: pageParam,
        filter,
      }),
  });

export const getDataSource = (dataSourceId: string, filter?: Filter) => {
  const queryOptions = getDataSourceQueryOptions(dataSourceId, filter);

  return async (logger: AstroIntegrationLogger) => {
    const queryClient = getQueryClient(logger);
    const techStackMapper = withChildren(logger);

    const rawDataSource = await queryClient.infiniteQuery(queryOptions);
    return await Promise.all(rawDataSource.map(techStackMapper));
  };
};
