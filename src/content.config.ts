import { createCollection } from "~/contents/apis";

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

const task = createCollection({
  name: "task",
  dataSourceId: import.meta.env.NOTION_TASK_DATASOURCE,
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
    "주요 기술 작업": "task",
    배경: "background",
    결과: "result",
  },
  filter: {
    and: [
      {
        property: "활성화",
        checkbox: {
          equals: true,
        },
      },
    ],
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
  task,
  education,
  techStackType,
  background,
  result,
};
