import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches cards from the configured API URL with credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: 'card-1' }],
    });
    vi.stubGlobal('fetch', fetchMock);

    const cards = await api.getCards();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/cards'),
      expect.objectContaining({ credentials: 'include' }),
    );
    expect(cards).toEqual([{ id: 'card-1' }]);
  });

  it('throws ApiError with the server message on a non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ message: 'Invalid credentials.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.login({ email: 'a@b.com', password: 'x' })).rejects.toMatchObject({
      status: 401,
      message: 'Invalid credentials.',
    });
    await expect(api.login({ email: 'a@b.com', password: 'x' })).rejects.toBeInstanceOf(ApiError);
  });

  it('posts a PvE match creation request with the deck and difficulty', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ matchId: 'match-1' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await api.createPveMatch('token', 'deck-1', 'NORMAL');

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/matches/pve'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ deckId: 'deck-1', difficulty: 'NORMAL' }),
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });
});
