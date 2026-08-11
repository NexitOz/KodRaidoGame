import type {
  Card,
  CardResonanceView,
  MatchActionInput,
  MatchActionResponse,
  MatchHistoryEntry,
  MatchmakingStatus,
  MatchStateView,
  ProgressionView,
  ResonanceHistoryPoint,
  TutorialCompleteResponse,
  TutorialProgress,
  TutorialStartResponse,
  UpsertDeckInput,
} from '@kod-raido/shared';
import type { AuthResponse, CollectionEntryDto, DeckDto } from './types';

export type { MatchActionInput } from '@kod-raido/shared';
export type BotDifficulty = 'EASY' | 'NORMAL' | 'HARD';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  accessToken?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { accessToken, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, (body as { message?: string }).message ?? 'Request failed');
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getCards: () => request<Card[]>('/cards'),
  getCard: (id: string) => request<Card>(`/cards/${id}`),
  getTracks: () => request<Array<{ id: string; title: string; coverUrl: string }>>('/tracks'),

  register: (input: { email: string; username: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  refresh: () => request<AuthResponse>('/auth/refresh', { method: 'POST' }),
  logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  getMe: (accessToken: string) => request<AuthResponse['user']>('/me', { accessToken }),
  getCollection: (accessToken: string) =>
    request<CollectionEntryDto[]>('/me/collection', { accessToken }),

  getDecks: (accessToken: string) => request<DeckDto[]>('/me/decks', { accessToken }),
  createDeck: (accessToken: string, input: UpsertDeckInput) =>
    request<DeckDto>('/me/decks', { method: 'POST', body: JSON.stringify(input), accessToken }),
  updateDeck: (accessToken: string, id: string, input: UpsertDeckInput) =>
    request<DeckDto>(`/me/decks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
      accessToken,
    }),
  deleteDeck: (accessToken: string, id: string) =>
    request<{ success: boolean }>(`/me/decks/${id}`, { method: 'DELETE', accessToken }),

  createPveMatch: (accessToken: string, deckId: string, difficulty: BotDifficulty) =>
    request<MatchStateView>('/matches/pve', {
      method: 'POST',
      body: JSON.stringify({ deckId, difficulty }),
      accessToken,
    }),
  getMatch: (accessToken: string, matchId: string) =>
    request<MatchStateView>(`/matches/${matchId}`, { accessToken }),
  sendMatchAction: (accessToken: string, matchId: string, action: MatchActionInput) =>
    request<MatchActionResponse>(`/matches/${matchId}/actions`, {
      method: 'POST',
      body: JSON.stringify(action),
      accessToken,
    }),
  getMatchHistory: (accessToken: string) =>
    request<MatchHistoryEntry[]>('/me/matches', { accessToken }),

  joinMatchmaking: (accessToken: string, deckId: string) =>
    request<{ queued: boolean }>('/matchmaking/join', {
      method: 'POST',
      body: JSON.stringify({ deckId }),
      accessToken,
    }),
  leaveMatchmaking: (accessToken: string) =>
    request<{ queued: boolean }>('/matchmaking/leave', { method: 'POST', accessToken }),
  getMatchmakingStatus: (accessToken: string) =>
    request<MatchmakingStatus>('/matchmaking/status', { accessToken }),

  getResonance: () => request<CardResonanceView[]>('/resonance'),
  getResonanceTrending: () => request<CardResonanceView[]>('/resonance/trending'),
  getResonanceHistory: (cardId: string) =>
    request<ResonanceHistoryPoint[]>(`/resonance/${cardId}/history`),

  getTutorialProgress: (accessToken: string) =>
    request<TutorialProgress>('/me/tutorial', { accessToken }),
  startTutorial: (accessToken: string) =>
    request<TutorialStartResponse>('/me/tutorial/start', { method: 'POST', accessToken }),
  saveTutorialStep: (accessToken: string, step: number) =>
    request<TutorialProgress>('/me/tutorial/progress', {
      method: 'POST',
      body: JSON.stringify({ step }),
      accessToken,
    }),
  completeTutorial: (accessToken: string) =>
    request<TutorialCompleteResponse>('/me/tutorial/complete', { method: 'POST', accessToken }),
  skipTutorial: (accessToken: string) =>
    request<TutorialProgress>('/me/tutorial/skip', { method: 'POST', accessToken }),

  getProgression: (accessToken: string) =>
    request<ProgressionView>('/me/progression', { accessToken }),
};
