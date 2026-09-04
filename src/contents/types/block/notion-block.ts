import type { BlockObjectResponse } from "@notionhq/client";

import type { Block } from "./types";

// `@notionhq/client`'s response types are flat — the API returns children separately from
// their parent, so nesting them onto `.children` is an app-level augmentation on top of it.
export type NotionBlock = BlockObjectResponse &
  ({ has_children: false } | { has_children: true; children: Block[] });
