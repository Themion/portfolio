import type { DataSourceObjectResponse } from "@notionhq/client";
import { z } from "astro/zod";
import { reference } from "astro:content";

import { notionClient } from "./client";

type PropertyConfig = DataSourceObjectResponse['properties'][string];

// `Property` is a flat union with no name→type mapping, so `page.properties[name]` always widens
// to the whole union. The data source schema has that mapping, so this generates real per-property
// types for Astro's `createSchema()` hook to splice in:
// https://docs.astro.build/en/reference/content-loader-reference/#createschema
const generateEntryTypes = (properties: Record<string, PropertyConfig>, references: Record<string, string>) => {
  const propertyFields = Object.entries(properties)
    .map(([name, config]) => {
      const property = `Extract<Property, { type: ${JSON.stringify(config.type)} }>`;
      const referencedCollection = references[name];

      // Mirrors `buildPropertiesSchema`'s runtime tagging, so the type matches what callers get.
      if (config.type !== 'relation' || !referencedCollection) {
        return `    ${JSON.stringify(name)}: ${property};`;
      }

      return `    ${JSON.stringify(name)}: Omit<${property}, 'relation'> & { relation: import('astro:content').ReferenceDataEntry<${JSON.stringify(referencedCollection)}>[] };`;
    })
    .join('\n');

  return `
import type { Property, Page } from '~/contents/types';

export type Entry = Omit<Page, 'properties'> & {
  properties: {
${propertyFields}
  };
};
`;
};

// Notion's relation property only carries a bare page id, with no `collection` field — `reference()`
// adds that. Unlisted properties (and everything outside `properties`) pass through via `z.looseObject`.
const buildPropertiesSchema = (properties: Record<string, PropertyConfig>, references: Record<string, string>) => {
  const relationFields = Object.fromEntries(
    Object.entries(references)
      .filter(([name]) => properties[name]?.type === 'relation')
      .map(([name, collectionName]) => [
        name,
        z.looseObject({
          relation: z.array(
            z.object({ id: z.string() }).transform(({ id }) => id).pipe(reference(collectionName)),
          ),
        }),
      ]),
  );

  return z.looseObject(relationFields);
};

const fetchDataSourceSchema = async (dataSourceId: string, references: Record<string, string>) => {
  const dataSource = await notionClient.dataSources.retrieve({ data_source_id: dataSourceId });

  if (!('properties' in dataSource)) {
    throw new Error(`Data source ${dataSourceId} came back partial — its property schema isn't available.`);
  }

  return {
    // No real runtime validation beyond resolving relations — `types` below is what narrows statically.
    schema: z.looseObject({ properties: buildPropertiesSchema(dataSource.properties, references) }),
    types: generateEntryTypes(dataSource.properties, references),
  };
};

const dataSourceSchemas = new Map<string, ReturnType<typeof fetchDataSourceSchema>>();

export const createDataSourceSchema = (dataSourceId: string, references: Record<string, string> = {}) => {
  const cached = dataSourceSchemas.get(dataSourceId);
  if (cached) return cached;

  const schema = fetchDataSourceSchema(dataSourceId, references);
  dataSourceSchemas.set(dataSourceId, schema);
  return schema;
};
