import { describe, expect, it } from 'vitest';

import {
  parseProjectTokenResponse,
  resolveDatabaseRoute,
  verifyProductionMetadata,
} from './railway-production-scope';

const projectTokenPayload = {
  data: { projectToken: { projectId: 'project-1', environmentId: 'environment-production' } },
};
const project = {
  id: 'project-1',
  name: 'KodRaidoGame',
  environments: [{ id: 'environment-production', name: 'production' }],
  services: [
    { id: 'service-game-server', name: 'game-server' },
    { id: 'service-postgres', name: 'Postgres' },
  ],
};
const privateUrl = 'postgresql://user:password@postgres.railway.internal:5432/railway';
const publicUrl = 'postgresql://user:password@public.proxy.example:12345/railway';

describe('Railway production scope', () => {
  it('parses the documented projectToken projectId/environmentId shape', () => {
    expect(parseProjectTokenResponse(projectTokenPayload)).toEqual({
      projectId: 'project-1',
      environmentId: 'environment-production',
    });
  });

  it('fails when projectId is missing', () => {
    expect(() =>
      parseProjectTokenResponse({ data: { projectToken: { environmentId: 'environment-production' } } }),
    ).toThrow('projectToken.projectId is missing');
  });

  it('fails when environmentId is missing', () => {
    expect(() => parseProjectTokenResponse({ data: { projectToken: { projectId: 'project-1' } } })).toThrow(
      'projectToken.environmentId is missing',
    );
  });

  it('fails when the token environment ID is not the production environment ID', () => {
    expect(() =>
      verifyProductionMetadata({ projectId: 'project-1', environmentId: 'environment-other' }, project),
    ).toThrow('Project Token environment is not the unique production environment');
  });

  it('accepts a private game-server route with the matching DB service public URL', () => {
    const result = resolveDatabaseRoute(
      'environment-production',
      { DATABASE_URL: privateUrl },
      [
        {
          id: 'service-postgres',
          name: 'Postgres',
          environmentId: 'environment-production',
          variables: { DATABASE_URL: privateUrl, DATABASE_PUBLIC_URL: publicUrl },
        },
      ],
    );
    expect(result).toMatchObject({ route: 'RAILWAY_PRIVATE', databaseUrl: publicUrl });
  });

  it('fails when a private route has no DB-service public URL', () => {
    expect(() =>
      resolveDatabaseRoute(
        'environment-production',
        { DATABASE_URL: privateUrl },
        [
          {
            id: 'service-postgres',
            name: 'Postgres',
            environmentId: 'environment-production',
            variables: { DATABASE_URL: privateUrl },
          },
        ],
      ),
    ).toThrow('database service DATABASE_PUBLIC_URL is missing');
  });

  it('accepts an already-public game-server database URL', () => {
    const result = resolveDatabaseRoute(
      'environment-production',
      { DATABASE_URL: publicUrl },
      [
        {
          id: 'service-postgres',
          name: 'Postgres',
          environmentId: 'environment-production',
          variables: { DATABASE_URL: privateUrl, DATABASE_PUBLIC_URL: publicUrl },
        },
      ],
    );
    expect(result).toMatchObject({ route: 'PUBLIC', databaseUrl: publicUrl });
  });

  it('fails when game-server does not match the verified DB service', () => {
    expect(() =>
      resolveDatabaseRoute(
        'environment-production',
        { DATABASE_URL: 'postgresql://user:password@other.example:5432/railway' },
        [
          {
            id: 'service-postgres',
            name: 'Postgres',
            environmentId: 'environment-production',
            variables: { DATABASE_URL: privateUrl, DATABASE_PUBLIC_URL: publicUrl },
          },
        ],
      ),
    ).toThrow('game-server DATABASE_URL does not identify exactly one PostgreSQL service');
  });

  it('fails when the database service belongs to another environment', () => {
    expect(() =>
      resolveDatabaseRoute(
        'environment-production',
        { DATABASE_URL: privateUrl },
        [
          {
            id: 'service-postgres',
            name: 'Postgres',
            environmentId: 'environment-staging',
            variables: { DATABASE_URL: privateUrl, DATABASE_PUBLIC_URL: publicUrl },
          },
        ],
      ),
    ).toThrow('A database service candidate belongs to another environment');
  });
});
