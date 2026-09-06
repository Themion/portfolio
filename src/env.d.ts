interface ImportMetaEnv {
  NOTION_TOKENL: string;
  NOTION_EDUCATIONS_DATASOURCEL: string;
  NOTION_TECH_STACK_DATASOURCEL: string;
  NOTION_PROJECTS_DATASOURCEL: string;
  NOTION_COMPANY_DATASOURCEL: string;
  NOTION_TECHNICAL_DECISIONS_DATASOURCEL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
