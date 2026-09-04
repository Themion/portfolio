import type { BlockObjectResponse } from '@notionhq/client';

import type { AstroComponent } from '~/types';

// `@notionhq/client`'s response types are flat — the API returns children separately from
// their parent, so nesting them onto `.children` is an app-level augmentation on top of it.
export type Block = BlockObjectResponse & ({ has_children: false } | { has_children: true; children: Block[] });

export interface NotionBlockProps<T extends Block['type'] = Block['type']> {
  block: Extract<Block, { type: T }>;
  components: NotionBlockComponents;
}

export type NotionBlockComponentMap = {
  [K in Block['type']]: AstroComponent<NotionBlockProps<K>>;
};

// A block package doesn't need to ship a component for every Notion block type at once.
export type NotionBlockComponents = Partial<NotionBlockComponentMap>;
