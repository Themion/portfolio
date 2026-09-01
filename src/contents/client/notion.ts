import { Client } from "@notionhq/client";

export const notionClient = new Client({
  auth: import.meta.env.NOTION_TOKEN,
  notionVersion: '2026-03-11'
});
