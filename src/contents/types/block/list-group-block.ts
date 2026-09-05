import type { Block } from "./types";

export type ListGroupItemType<T extends Block["type"] = Block["type"]> =
  T extends `${string}_list_item` ? T : never;

export type ListGroupType<T extends ListGroupItemType = ListGroupItemType> =
  T extends `${infer U}_list_item` ? `${U}_list` : never;

// Notion returns list items as flat siblings with no list-level block — `NotionBlocks` groups
// each run into this synthetic wrapper to render one `<ul>`/`<ol>` instead of one per item.
export interface ListGroupBlock<Type extends ListGroupItemType> {
  type: ListGroupType<Type>;
  id: string;
  has_children: true;
  children: Extract<Block, { type: Type }>[];
}
