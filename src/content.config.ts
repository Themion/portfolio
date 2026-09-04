import type { Loader } from 'astro/loaders';
import { defineCollection } from 'astro:content';

import { createDataSourceSchema, getDataSource } from '~/contents';

const createCollection = (
  name: string,
  dataSourceId: string,
) => {
  return defineCollection({
    loader: {
      name,
      load: async (context) => {
        const entries = await getDataSource(dataSourceId)(context.logger);

        context.store.clear();
        for (const raw of entries) {
          const data = await context.parseData({ id: raw.id, data: raw });
          context.store.set({ id: raw.id, data });
        }
      },
      createSchema: () => createDataSourceSchema(dataSourceId),
    } satisfies Loader,
  })
}

const company = createCollection('company', import.meta.env.NOTION_COMPANY_DATASOURCE);
const techStack = createCollection('techStack', import.meta.env.NOTION_TECH_STACK_DATASOURCE);

export const collections = { company, techStack };
