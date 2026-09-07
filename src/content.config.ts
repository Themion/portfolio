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
const project = createCollection({
  name: 'project',
  dataSourceId: import.meta.env.NOTION_PROJECTS_DATASOURCE,
  references: {
    "기술 스택": 'techStack'
  }
})

export const collections = { company, techStack, project };
