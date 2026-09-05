import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { outDir, publicDir } from 'astro:config/server';

// Downloaded files land in their own subdirectory of `publicDir`/`outDir`, rather than loose at
// the root, so it's a single, stable path (`public/files/`) to gitignore instead of one entry
// per randomly-named file.
const FILES_DIR_NAME = 'files';

// Keyed by source URL, so re-rendering the same page (e.g. on every dev-server request) reuses
// the file it already downloaded instead of fetching and saving a fresh copy — and orphaning the
// previous one — every time.
const downloads = new Map<string, Promise<string>>();

const downloadFileUncached = async (url: string) => {
  // Keep the source file's extension so the saved file is servable/openable as what it actually
  // is (browsers and OSes both lean on it, since there's no Content-Type to infer from on disk).
  const extension = extname(new URL(url).pathname);
  const fileName = `${randomUUID()}${extension}`;
  // Callers of `downloadFile` render as part of `astro build`'s static route generation, which
  // runs after `astro build` already copied `publicDir` into `outDir` — writing to `publicDir`
  // during a build produces files that never make it into the shipped output. `outDir` doesn't
  // exist in dev (no build has run), so use `publicDir` there instead, which the dev server
  // serves directly. Either way the caller gets back the site-relative URL, not this path.
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
  // A failed download shouldn't be cached — a later call should get to retry it.
  download.catch(() => downloads.delete(url));
  downloads.set(url, download);
  return download;
};
