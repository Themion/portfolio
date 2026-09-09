import { createCollection } from '~/contents';

const company = createCollection({
  name: 'company',
  dataSourceId: import.meta.env.NOTION_COMPANY_DATASOURCE,
  references: {
    '연결 프로젝트': 'project',
  }
});

const techStack = createCollection({
  name: 'techStack',
  dataSourceId: import.meta.env.NOTION_TECH_STACK_DATASOURCE
});

const decision = createCollection({
  name: 'decision',
  dataSourceId: import.meta.env.NOTION_TECHNICAL_DECISIONS_DATASOURCE,
});

const project = createCollection({
  name: 'project',
  dataSourceId: import.meta.env.NOTION_PROJECTS_DATASOURCE,
  references: {
    "기술 스택": 'techStack',
    "기술적 의사결정": 'decision'
  }
});

const education = createCollection({
  name: 'education',
  dataSourceId: import.meta.env.NOTION_EDUCATIONS_DATASOURCE,
});

export const collections = { company, techStack, project, decision, education };
