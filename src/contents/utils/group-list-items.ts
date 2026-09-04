import type { Block } from '~/contents/components/notion/block/types';

type ListGroupHelperType<Suffix extends string, T extends Block['type'] = Block['type']> =
  T extends `${infer U}_list_item` ? `${U}${Suffix}` : never;

type ListGroupType<T extends Block['type'] = Block['type']> = ListGroupHelperType<'_list', T>;
type ListGroupItemType<T extends Block['type'] = Block['type']> = ListGroupHelperType<'_list_item', T>;

// Keyed by every `_list_item` type in `Block['type']` (not `Partial`), so adding a new one to
// `Block` forces a mapping to be added here too, instead of silently falling through as ungrouped.
type ListItemGroupType = {
  [T in ListGroupItemType]: ListGroupType<T>;
};

const LIST_ITEM_GROUP_TYPE: ListItemGroupType = {
  bulleted_list_item: 'bulleted_list',
  numbered_list_item: 'numbered_list',
};

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
  let openGroup: ListGroup | undefined;

  for (const block of input) {
    // `ListItemGroupType` only has keys for `_list_item` types, so widen the lookup back to
    // `Block['type']` here — a non-matching key simply looks up as `undefined`, same as `Partial`.
    const groupType = (LIST_ITEM_GROUP_TYPE as Partial<Record<Block['type'], ListGroupType>>)[block.type];

    if (groupType && openGroup?.type === groupType) {
      openGroup.children.push(block);
      continue;
    }

    openGroup = groupType ? { type: groupType, id: `${block.id}-group`, has_children: true, children: [block] } : undefined;
    grouped.push((openGroup ?? block) as Block);
  }

  return grouped;
};
