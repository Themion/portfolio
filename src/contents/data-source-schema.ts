import type { DataSourceObjectResponse } from "@notionhq/client";
import { z } from "astro/zod";

import type { Page } from "~/contents/types"

import { notionClient } from "./client";

type PropertyConfig = DataSourceObjectResponse['properties'][string];

// `Property` is a flat union with no name→type mapping, so `page.properties[name]` always widens
// to the whole union. The data source schema has that mapping, so this generates real per-property
// types for Astro's `createSchema()` hook to splice in:
// https://docs.astro.build/en/reference/content-loader-reference/#createschema
const generateEntryTypes = (properties: Record<string, PropertyConfig>) => {
  const propertyFields = Object.entries(properties)
    .map(([name, config]) => `    ${JSON.stringify(name)}: Extract<Property, { type: ${JSON.stringify(config.type)} }>;`)
    .join('\n');

  return `
import type { Property } from '~/contents/types';
import type { Page } from '~/contents';

export type Entry = Omit<Page, 'properties'> & {
  properties: {
${propertyFields}
  };
};
`;
};

const fetchDataSourceSchema = async (dataSourceId: string) => {
  const dataSource = await notionClient.dataSources.retrieve({ data_source_id: dataSourceId });

  if (!('properties' in dataSource)) {
    throw new Error(`Data source ${dataSourceId} came back partial — its property schema isn't available.`);
  }

  return {
    // No real runtime validation needed — `types` below is what narrows statically.
    schema: z.custom<Page>(),
    types: generateEntryTypes(dataSource.properties),
  };
};

const dataSourceSchemas = new Map<string, ReturnType<typeof fetchDataSourceSchema>>();

export const createDataSourceSchema = (dataSourceId: string) => {
  const cached = dataSourceSchemas.get(dataSourceId);
  if (cached) return cached;

  const schema = fetchDataSourceSchema(dataSourceId);
  dataSourceSchemas.set(dataSourceId, schema);
  return schema;
};
