import { randomUUID } from 'node:crypto';

import type { Block, ListGroupBlock, ListGroupItemType, ListGroupType } from '~/contents/types';

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

export const groupListItems = (input: Block[]): Block[] => {
  const grouped: Block[] = [];

  for (const block of input) {
    if (!isListItemType(block.type)) {
      grouped.push(block);
      continue;
    }

    const groupType = LIST_ITEM_GROUP_TYPE[block.type];
    const lastGroup = grouped.at(-1);

    // `Block`'s union is too large/recursive for TS to narrow `lastGroup` here, and
    // `isListItemType` only narrowed `block.type`, not `block` — so both are asserted.
    if (lastGroup?.type === groupType) {
      (lastGroup as ListGroupBlock<ListGroupItemType>).children.push(
        block as Extract<Block, { type: ListGroupItemType }>,
      );
    } else {
      grouped.push({ type: groupType, id: randomUUID(), has_children: true, children: [block] } as Block);
    }
  }

  return grouped;
};
