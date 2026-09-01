import type { Client } from "@notionhq/client";

export type NotionAPIPage = Awaited<ReturnType<Client['dataSources']['query']>>['results'][number];
