interface ImportMetaEnv {
  NOTION_TOKENL: string;
  NOTION_EDUCATIONS_DATASOURCE: string;
  NOTION_TECH_STACK_DATASOURCE: string;
  NOTION_PROJECTS_DATASOURCE: string;
  NOTION_COMPANY_DATASOURCE: string;
  NOTION_TECHNICAL_DECISIONS_DATASOURCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
