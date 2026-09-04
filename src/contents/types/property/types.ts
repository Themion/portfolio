import type { PageObjectResponse } from '@notionhq/client';

import type { AstroComponent } from '~/types';

export type Property = PageObjectResponse['properties'][string];

export interface NotionPropertyProps<T extends Property['type'] = Property['type']> {
  property: Extract<Property, { type: T }>;
  components: NotionPropertyComponents;
}

export type NotionPropertyComponentMap = {
  [K in Property['type']]: AstroComponent<NotionPropertyProps<K>>;
};

export type NotionPropertyComponents = Partial<NotionPropertyComponentMap>;
