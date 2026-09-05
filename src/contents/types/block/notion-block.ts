import type { BlockObjectResponse } from "@notionhq/client";

import type { Block } from "./types";

// The API returns children separately from their parent; this adds them as `.children` directly.
export type NotionBlock = BlockObjectResponse &
  ({ has_children: false } | { has_children: true; children: Block[] });
