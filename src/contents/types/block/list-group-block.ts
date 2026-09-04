import type { Block } from "./types";

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
