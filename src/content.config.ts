import { defineCollection } from 'astro:content';

import { getCompaniesQuery } from '~/contents';

import { getTechStacksQuery } from './contents/tech-stack';

const company = defineCollection({
  loader: getCompaniesQuery,
});

const techStack = defineCollection({
  loader: getTechStacksQuery
})

export const collections = { company, techStack };
