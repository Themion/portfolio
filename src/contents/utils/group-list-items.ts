import { randomUUID } from 'node:crypto';

import type { Block, ListGroupItemType, ListGroupType } from '~/contents/components/notion/block/types';

// Keyed by every `_list_item` type in `Block['type']` (not `Partial`), so adding a new one to
// `Block` forces a mapping to be added here too, instead of silently falling through as ungrouped.
type ListItemGroupType = {
  [T in ListGroupItemType]: ListGroupType<T>;
};

const LIST_ITEM_GROUP_TYPE: ListItemGroupType = {
  bulleted_list_item: 'bulleted_list',
  numbered_list_item: 'numbered_list',
};

// `type in object` alone doesn't narrow `type`'s own union down to `object`'s keys, so a named
// predicate is needed to actually get `keyof ListItemGroupType` back out of the check.
const isListItemType = (type: Block['type']): type is keyof ListItemGroupType => type in LIST_ITEM_GROUP_TYPE;

// `bulleted_list`'s and `numbered_list`'s `children` are each typed narrower than `Block[]` (only
// their own item type), so their union can't accept an arbitrary `Block` via `.push()`. This
// widened shape is only for mutating an already-confirmed group in place.
interface ListGroup {
  type: ListGroupType;
  id: string;
  has_children: true;
  children: Block[];
}

// Notion returns consecutive `bulleted_list_item`/`numbered_list_item` blocks as flat siblings.
// Group each run into a synthetic `bulleted_list`/`numbered_list` block so it renders as one
// `<ul>`/`<ol>` instead of one per item.
export const groupListItems = (input: Block[]): Block[] => {
  const grouped: Block[] = [];

  for (const block of input) {
    if (!isListItemType(block.type)) {
      grouped.push(block);
      continue;
    }

    const groupType = LIST_ITEM_GROUP_TYPE[block.type];
    const lastGroup = grouped.at(-1);

    // `Block` is a large, recursively-typed union, so TypeScript can't narrow `lastGroup` to the
    // group variant from this comparison alone — assert it once the check has confirmed it.
    if (lastGroup?.type === groupType) {
      (lastGroup as ListGroup).children.push(block);
      continue;
    }

    grouped.push({ type: groupType, id: randomUUID(), has_children: true, children: [block] } as Block);
  }

  return grouped;
};
