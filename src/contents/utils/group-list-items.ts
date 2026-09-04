import type { Block } from '~/contents/components/notion/block/types';

type ListGroupType = 'bulleted_list' | 'numbered_list';

const LIST_ITEM_GROUP_TYPE: Partial<Record<Block['type'], ListGroupType>> = {
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
    const groupType = LIST_ITEM_GROUP_TYPE[block.type];

    if (groupType && openGroup?.type === groupType) {
      openGroup.children.push(block);
      continue;
    }

    openGroup = groupType ? { type: groupType, id: `${block.id}-group`, has_children: true, children: [block] } : undefined;
    grouped.push((openGroup ?? block) as Block);
  }

  return grouped;
};
