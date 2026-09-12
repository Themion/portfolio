import { type CollectionEntry, type DataEntryMap, getCollection } from "astro:content";

export const getSortedCollections = async <T extends keyof DataEntryMap>(
  collection: T,
  getOrder: (entry: CollectionEntry<T>) => number,
) => {
  const entries = await getCollection(collection);
  return entries.toSorted((a, b) => getOrder(a) - getOrder(b));
};
