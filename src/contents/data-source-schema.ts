import type { DataSourceObjectResponse } from "@notionhq/client";
import { z } from "astro/zod";

import { notionClient } from "./client";
import type { Page } from "./data-source";

type PropertyConfig = DataSourceObjectResponse['properties'][string];

// A page's `properties` type (`Property`, from `@notionhq/client`) is a flat union over every
// possible Notion property type — since that type has no idea which property *name* maps to which
// property *type* for a given database, every property read out of `page.data.properties[name]`
// widens to that whole union instead of narrowing to what it actually is. The data source's
// *schema* does carry that name → type mapping, so this fetches it (once per id, cached below) and
// turns it into real per-property TypeScript source for Astro's content-layer `createSchema()`
// hook, which splices a loader's own generated type declarations into the collection's entry type:
// https://docs.astro.build/en/reference/content-loader-reference/#createschema
const generateEntryTypes = (properties: Record<string, PropertyConfig>) => {
  const propertyFields = Object.entries(properties)
    .map(([name, config]) => `    ${JSON.stringify(name)}: Extract<Property, { type: ${JSON.stringify(config.type)} }>;`)
    .join('\n');

  return `
import type { Property } from '~/contents/components';
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
    // The loader already hands `parseData` an already-typed `Page`, so there's no meaningful
    // runtime validation to add — `types` (below) is what actually narrows the static type.
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
