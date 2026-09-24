import { createCollection } from "~/contents";

const company = createCollection({
  name: "company",
  dataSourceId: import.meta.env.NOTION_COMPANY_DATASOURCE,
  references: {
    "연결 프로젝트": "project",
  },
});

const techStack = createCollection({
  name: "techStack",
  dataSourceId: import.meta.env.NOTION_TECH_STACK_DATASOURCE,
});

const techStackType = createCollection({
  name: "techStackType",
  dataSourceId: import.meta.env.NOTION_TECH_STACK_TYPE_DATASOURCE,
  references: {
    "사용 기술": "techStack",
  },
});

const decision = createCollection({
  name: "decision",
  dataSourceId: import.meta.env.NOTION_TECHNICAL_DECISIONS_DATASOURCE,
});

const background = createCollection({
  name: "background",
  dataSourceId: import.meta.env.NOTION_PROJECT_BACKGROUND_DATASOURCE,
});

const result = createCollection({
  name: "result",
  dataSourceId: import.meta.env.NOTION_PROJECT_RESULT_DATASOURCE,
});

const project = createCollection({
  name: "project",
  dataSourceId: import.meta.env.NOTION_PROJECTS_DATASOURCE,
  references: {
    "기술 스택": "techStack",
    "기술적 의사결정": "decision",
    배경: "background",
    결과: "result",
  },
});

const education = createCollection({
  name: "education",
  dataSourceId: import.meta.env.NOTION_EDUCATIONS_DATASOURCE,
});

export const collections = {
  company,
  techStack,
  project,
  decision,
  education,
  techStackType,
  background,
  result,
};
