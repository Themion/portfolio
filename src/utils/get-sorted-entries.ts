import { type CollectionEntry, type CollectionKey, getEntries } from "astro:content";

export const getSortedEntries = async <C extends CollectionKey>(
  relation: Parameters<typeof getEntries<C>>[0],
  getOrder: (entry: CollectionEntry<C>) => number,
): Promise<CollectionEntry<C>[]> => {
  const entries = await getEntries(relation);
  return entries.toSorted((a, b) => getOrder(a) - getOrder(b));
};
