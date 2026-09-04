import { APIErrorCode, isNotionClientError, type NotionClientError } from '@notionhq/client';
import { QueryClient } from '@tanstack/query-core';
import type { AstroIntegrationLogger } from 'astro';

const DEFAULT_RETRY_DELAY_MS = 30_000;
const DEFAULT_RATE_LIMIT_RETRY_SECONDS = 60;

// Notion's error type doesn't type `headers`, but responses use the standard fetch `Headers` object.
const getRetryAfterSeconds = (headers: unknown) => {
  if (!(headers instanceof Headers)) return null;
  const retryAfter = headers.get('retry-after');
  return retryAfter === null ? null : parseInt(retryAfter, 10);
};

// null means "don't retry"; otherwise the number of ms to wait before retrying.
const getNotionRetryDelayMs = (error: NotionClientError): number | null => {
  switch (error.name) {
    case 'APIResponseError':
      switch (error.code) {
        case APIErrorCode.RateLimited:
          return (getRetryAfterSeconds(error.headers) ?? DEFAULT_RATE_LIMIT_RETRY_SECONDS) * 1000;
        case APIErrorCode.InternalServerError:
        case APIErrorCode.ServiceUnavailable:
          return DEFAULT_RETRY_DELAY_MS;
        default:
          return null;
      }
    case 'RequestTimeoutError':
      return DEFAULT_RETRY_DELAY_MS;
    default:
      return null;
  }
};

let queryClient: QueryClient | null = null;

// Lazily created once and shared by every collection loader (company, tech-stack, ...), so they
// all funnel through the same retry/backoff state instead of each spinning up their own client.
// The logger of whichever loader runs first "wins" the underlying client, so it's re-forked under
// a neutral 'notion' label rather than that collection's own label. Loaders run concurrently via
// `Promise.all`, but since this is synchronous with no `await`, there's no race on `queryClient`.
export const getQueryClient = (logger: AstroIntegrationLogger): QueryClient => {
  if (queryClient) return queryClient;

  const notionLogger = logger.fork('notion');

  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (_failureCount, error) => {
          if (!isNotionClientError(error)) {
            notionLogger.error(`Unknown error has thrown! ${String(error)}`);
            return false;
          }

          const delayMs = getNotionRetryDelayMs(error);
          if (delayMs === null) {
            notionLogger.error(String(error));
            return false;
          }

          notionLogger.warn(`Notion API error (${error.name}). retrying after ${delayMs / 1000} seconds...`);
          return true;
        },
        retryDelay: (_failureCount, error) => {
          if (!isNotionClientError(error)) return 0;
          return getNotionRetryDelayMs(error) ?? 0;
        }
      }
    }
  });

  return queryClient;
};
