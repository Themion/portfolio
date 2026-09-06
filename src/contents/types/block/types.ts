import type { PageObjectResponse } from "@notionhq/client";

import type { AstroComponent } from "~/types";

import type { ListGroupBlock } from "./list-group-block";
import type { NotionBlock } from "./notion-block";

export type Block =
  NotionBlock | ListGroupBlock<"bulleted_list_item"> | ListGroupBlock<"numbered_list_item">;

export interface NotionBlockProps<T extends Block["type"] = Block["type"]> {
  block: Extract<Block, { type: T }>;
  components: NotionBlockComponents;
}

export type NotionBlockComponentMap = {
  [K in Block["type"]]: AstroComponent<NotionBlockProps<K>>;
};

export type NotionBlockComponents = Partial<NotionBlockComponentMap>;

export type Page = PageObjectResponse & { children: Block[] };
