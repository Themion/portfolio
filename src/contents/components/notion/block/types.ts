import type { BlockObjectResponse } from "@notionhq/client";

import type { AstroComponent } from "~/types";

export type ListGroupItemType<T extends Block["type"] = Block["type"]> =
  T extends `${string}_list_item` ? T : never;

export type ListGroupType<T extends ListGroupItemType = ListGroupItemType> =
  T extends `${infer U}_list_item` ? `${U}_list` : never;

// Notion returns consecutive `bulleted_list_item`/`numbered_list_item` blocks as flat siblings,
// with no list-level block of its own. `NotionBlocks` groups each run into one of these synthetic
// wrapper blocks so it can render a single `<ul>`/`<ol>` instead of one per item.
export interface ListGroupBlock<Type extends ListGroupItemType> {
  type: ListGroupType<Type>;
  id: string;
  has_children: true;
  children: Extract<Block, { type: Type }>[];
}

// A block package doesn't need to ship a component for every Notion block type at once.
export type NotionBlockComponents = Partial<NotionBlockComponentMap>;

// `@notionhq/client`'s response types are flat — the API returns children separately from
// their parent, so nesting them onto `.children` is an app-level augmentation on top of it.
type NotionBlock = BlockObjectResponse &
  ({ has_children: false } | { has_children: true; children: Block[] });

export type Block =
  NotionBlock | ListGroupBlock<"bulleted_list_item"> | ListGroupBlock<"numbered_list_item">;

export interface NotionBlockProps<T extends Block["type"] = Block["type"]> {
  block: Extract<Block, { type: T }>;
  components: NotionBlockComponents;
}

export type NotionBlockComponentMap = {
  [K in Block["type"]]: AstroComponent<NotionBlockProps<K>>;
};
