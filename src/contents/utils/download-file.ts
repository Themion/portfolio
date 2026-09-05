import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { outDir, publicDir } from 'astro:config/server';

const FILES_DIR_NAME = 'files';

const downloads = new Map<string, Promise<string>>();

const downloadFileUncached = async (url: string) => {
  const extension = extname(new URL(url).pathname);
  const fileName = `${randomUUID()}${extension}`;
  // Renders during astro build's page generation, which runs after publicDir is copied into
  // outDir — write straight to outDir there, or publicDir in dev (no outDir yet).
  const targetDir = import.meta.env.DEV ? publicDir : outDir;
  const filesDirPath = resolve(fileURLToPath(targetDir), FILES_DIR_NAME);
  const filePath = resolve(filesDirPath, fileName);

  await mkdir(filesDirPath, { recursive: true });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await writeFile(filePath, Buffer.from(arrayBuffer));

  return `${import.meta.env.BASE_URL}/${FILES_DIR_NAME}/${fileName}`;
};

export const downloadFile = (url: string) => {
  const cached = downloads.get(url);
  if (cached) return cached;

  const download = downloadFileUncached(url);
  // A failed download shouldn't be cached, so a later call can retry.
  download.catch(() => downloads.delete(url));
  downloads.set(url, download);
  return download;
};
