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

// A property package doesn't need to ship a component for every Notion property type at once.
export type NotionPropertyComponents = Partial<NotionPropertyComponentMap>;
