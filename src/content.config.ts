import type { AstroIntegrationLogger } from 'astro';
import type { Loader } from 'astro/loaders';
import { defineCollection } from 'astro:content';

import { getDataSource } from '~/contents';

const createLoader = <T extends { id: string }>(
  name: string,
  getEntries: (logger: AstroIntegrationLogger) => Promise<T[]>,
): Loader => ({
  name,
  load: async (context) => {
    const entries = await getEntries(context.logger);

    context.store.clear();
    for (const raw of entries) {
      const data = await context.parseData({ id: raw.id, data: raw });
      context.store.set({ id: raw.id, data });
    }
  },
});

const company = defineCollection({
  loader: createLoader('company', getDataSource(import.meta.env.NOTION_COMPANY_DATASOURCE)),
});

const techStack = defineCollection({
  loader: createLoader('techStack', getDataSource(import.meta.env.NOTION_TECH_STACK_DATASOURCE)),
});

export const collections = { company, techStack };
