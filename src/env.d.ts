interface ImportMetaEnv {
  readonly NOTION_TOKEN: string;
  readonly NOTION_COMPANY_DATASOURCE: string;
  readonly NOTION_TECHNICAL_DECISIONS_DATASOURCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
