interface ImportMetaEnv {
  readonly NOTION_TOKEN: string;
  readonly NOTION_COMPANY_DATASOURCE: string;
  readonly NOTION_TECH_STACK_DATASOURCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
