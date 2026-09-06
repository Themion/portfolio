import type { Loader } from 'astro/loaders';
import { defineCollection } from 'astro:content';

import { getDataSource } from './data-source';
import { createDataSourceSchema } from './data-source-schema';

export interface CreateCollectionParams {
  name: string;
  dataSourceId: string;
}

export const createCollection = ({
  name,
  dataSourceId,
}: CreateCollectionParams) => {
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
