export interface PublicUser {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  softCurrency: number;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
}
