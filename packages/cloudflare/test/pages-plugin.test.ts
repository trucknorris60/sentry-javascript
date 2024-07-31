// Note: These tests run the handler in Node.js, which has some differences to the cloudflare workers runtime.
// Although this is not ideal, this is the best we can do until we have a better way to test cloudflare workers.

import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { CloudflareOptions } from '../src/client';

import { sentryPagesPlugin } from '../src/pages-plugin';

const MOCK_OPTIONS: CloudflareOptions = {
  dsn: 'https://public@dsn.ingest.sentry.io/1337',
};

describe('sentryPagesPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('passes through the response from the handler', async () => {
    const response = new Response('test');
    const mockOnRequest = sentryPagesPlugin(MOCK_OPTIONS);

    const result = await mockOnRequest({
      request: new Request('https://example.com'),
      functionPath: 'test',
      waitUntil: vi.fn(),
      passThroughOnException: vi.fn(),
      next: () => Promise.resolve(response),
      env: { ASSETS: { fetch: vi.fn() } },
      params: {},
      data: {},
      pluginArgs: MOCK_OPTIONS,
    });

    expect(result).toBe(response);
  });
});
