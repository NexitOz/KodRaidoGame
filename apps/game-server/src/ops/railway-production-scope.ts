/* eslint-disable no-console -- This operational gate emits a small machine-checked safety report. */
import { spawnSync } from 'node:child_process';

const RAILWAY_API_URL = 'https://backboard.railway.com/graphql/v2';
const EXPECTED_PROJECT_NAME = 'KodRaidoGame';
const EXPECTED_ENVIRONMENT_NAME = 'production';
const EXPECTED_GAME_SERVER_NAME = 'game-server';

type ProjectTokenScope = { projectId: string; environmentId: string };
type RailwayService = { id: string; name: string };
type RailwayEnvironment = { id: string; name: string };
type RailwayProject = {
  id: string;
  name: string;
  environments: RailwayEnvironment[];
  services: RailwayService[];
};
type ServiceVariables = Record<string, string>;
type DatabaseCandidate = RailwayService & {
  environmentId: string;
  variables: ServiceVariables;
};
type DatabaseRoute = {
  databaseService: DatabaseCandidate;
  databaseUrl: string;
  route: 'PUBLIC' | 'RAILWAY_PRIVATE';
};

const PROJECT_TOKEN_QUERY = `
  query {
    projectToken {
      projectId
      environmentId
    }
  }
`;

const PROJECT_METADATA_QUERY = `
  query ProductionProject($projectId: String!) {
    project(id: $projectId) {
      id
      name
      environments { edges { node { id name } } }
      services { edges { node { id name } } }
    }
  }
`;

const VARIABLES_QUERY = `
  query RenderedVariables($projectId: String!, $environmentId: String!, $serviceId: String!) {
    variables(projectId: $projectId, environmentId: $environmentId, serviceId: $serviceId)
  }
`;

function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`${label} is missing`);
  return value;
}

export function parseProjectTokenResponse(payload: unknown): ProjectTokenScope {
  const root = payload as { data?: { projectToken?: { projectId?: unknown; environmentId?: unknown } } };
  const token = root?.data?.projectToken;
  return {
    projectId: requireString(token?.projectId, 'projectToken.projectId'),
    environmentId: requireString(token?.environmentId, 'projectToken.environmentId'),
  };
}

function edgesToNodes<T>(connection: unknown): T[] {
  const edges = (connection as { edges?: Array<{ node?: T }> })?.edges;
  if (!Array.isArray(edges)) return [];
  return edges.flatMap((edge) => (edge?.node ? [edge.node] : []));
}

export function parseProjectMetadata(payload: unknown): RailwayProject {
  const root = payload as {
    data?: {
      project?: {
        id?: unknown;
        name?: unknown;
        environments?: unknown;
        services?: unknown;
      };
    };
  };
  const project = root?.data?.project;
  if (!project) throw new Error('Railway project metadata is missing');
  return {
    id: requireString(project.id, 'project.id'),
    name: requireString(project.name, 'project.name'),
    environments: edgesToNodes<RailwayEnvironment>(project.environments),
    services: edgesToNodes<RailwayService>(project.services),
  };
}

export function verifyProductionMetadata(
  token: ProjectTokenScope,
  project: RailwayProject,
): { environment: RailwayEnvironment; gameServer: RailwayService } {
  if (project.id !== token.projectId || project.name !== EXPECTED_PROJECT_NAME) {
    throw new Error('Railway project identity mismatch');
  }
  const matchingEnvironments = project.environments.filter((environment) => environment.id === token.environmentId);
  if (matchingEnvironments.length !== 1 || matchingEnvironments[0]?.name !== EXPECTED_ENVIRONMENT_NAME) {
    throw new Error('Project Token environment is not the unique production environment');
  }
  const gameServers = project.services.filter((service) => service.name === EXPECTED_GAME_SERVER_NAME);
  if (gameServers.length !== 1) throw new Error('Expected exactly one game-server service in the verified project');
  return { environment: matchingEnvironments[0]!, gameServer: gameServers[0]! };
}

function parseVariables(value: unknown): ServiceVariables {
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value) as unknown;
    } catch {
      throw new Error('Rendered Railway variables are not valid JSON');
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Rendered Railway variables are not an object');
  }
  const variables: ServiceVariables = {};
  for (const [key, variable] of Object.entries(parsed)) {
    if (typeof variable === 'string') variables[key] = variable;
  }
  return variables;
}

function parsePostgresUrl(value: string | undefined, label: string): URL {
  if (!value) throw new Error(`${label} is missing`);
  const parsed = new URL(value);
  if (parsed.protocol !== 'postgres:' && parsed.protocol !== 'postgresql:') {
    throw new Error(`${label} is not a PostgreSQL URL`);
  }
  return parsed;
}

function isRailwayPrivate(parsed: URL): boolean {
  const hostname = parsed.hostname.toLowerCase();
  return hostname.endsWith('.railway.internal') || hostname.endsWith('.internal');
}

export function resolveDatabaseRoute(
  environmentId: string,
  gameServerVariables: ServiceVariables,
  candidates: DatabaseCandidate[],
): DatabaseRoute {
  const gameServerDatabaseUrl = requireString(gameServerVariables.DATABASE_URL, 'game-server DATABASE_URL');
  const gameServerParsed = parsePostgresUrl(gameServerDatabaseUrl, 'game-server DATABASE_URL');
  const scopedCandidates = candidates.filter((candidate) => candidate.environmentId === environmentId);
  if (scopedCandidates.length !== candidates.length) {
    throw new Error('A database service candidate belongs to another environment');
  }

  const matches = scopedCandidates.filter((candidate) => {
    const privateUrl = candidate.variables.DATABASE_URL;
    const publicUrl = candidate.variables.DATABASE_PUBLIC_URL;
    return gameServerDatabaseUrl === privateUrl || gameServerDatabaseUrl === publicUrl;
  });
  if (matches.length !== 1) {
    throw new Error('game-server DATABASE_URL does not identify exactly one PostgreSQL service');
  }

  const databaseService = matches[0]!;
  parsePostgresUrl(databaseService.variables.DATABASE_URL, 'database service DATABASE_URL');
  if (isRailwayPrivate(gameServerParsed)) {
    const publicUrl = requireString(databaseService.variables.DATABASE_PUBLIC_URL, 'database service DATABASE_PUBLIC_URL');
    const publicParsed = parsePostgresUrl(publicUrl, 'database service DATABASE_PUBLIC_URL');
    if (isRailwayPrivate(publicParsed)) throw new Error('database service DATABASE_PUBLIC_URL is private');
    return { databaseService, databaseUrl: publicUrl, route: 'RAILWAY_PRIVATE' };
  }

  return { databaseService, databaseUrl: gameServerDatabaseUrl, route: 'PUBLIC' };
}

async function railwayRequest<T>(token: string, query: string, variables?: Record<string, string>): Promise<T> {
  const response = await fetch(RAILWAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Project-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`Railway Public API request failed with status ${response.status}`);
  const payload = (await response.json()) as { errors?: unknown[] };
  if (payload.errors?.length) throw new Error('Railway Public API returned GraphQL errors');
  return payload as T;
}

async function renderedVariables(
  token: string,
  projectId: string,
  environmentId: string,
  serviceId: string,
): Promise<ServiceVariables> {
  const payload = await railwayRequest<{ data?: { variables?: unknown } }>(token, VARIABLES_QUERY, {
    projectId,
    environmentId,
    serviceId,
  });
  return parseVariables(payload.data?.variables);
}

async function resolveProductionScope(): Promise<{
  token: string;
  tokenScope: ProjectTokenScope;
  environment: RailwayEnvironment;
  gameServer: RailwayService;
  databaseRoute: DatabaseRoute;
}> {
  const token = requireString(process.env.RAILWAY_TOKEN, 'RAILWAY_TOKEN');
  const tokenPayload = await railwayRequest<unknown>(token, PROJECT_TOKEN_QUERY);
  const tokenScope = parseProjectTokenResponse(tokenPayload);
  const metadataPayload = await railwayRequest<unknown>(token, PROJECT_METADATA_QUERY, {
    projectId: tokenScope.projectId,
  });
  const project = parseProjectMetadata(metadataPayload);
  const { environment, gameServer } = verifyProductionMetadata(tokenScope, project);
  const gameServerVariables = await renderedVariables(token, project.id, environment.id, gameServer.id);

  const candidates: DatabaseCandidate[] = [];
  for (const service of project.services.filter((candidate) => candidate.id !== gameServer.id)) {
    const variables = await renderedVariables(token, project.id, environment.id, service.id);
    if (variables.DATABASE_URL || variables.DATABASE_PUBLIC_URL) {
      candidates.push({ ...service, environmentId: environment.id, variables });
    }
  }
  const databaseRoute = resolveDatabaseRoute(environment.id, gameServerVariables, candidates);

  return { token, tokenScope, environment, gameServer, databaseRoute };
}

async function main(): Promise<void> {
  const separator = process.argv.indexOf('--');
  if (separator < 0 || !process.argv[separator + 1]) throw new Error('A child command is required after --');
  const childCommand = process.argv[separator + 1]!;
  const scope = await resolveProductionScope();

  console.log('TOKEN_PROJECT_ID_VERIFIED=YES');
  console.log('TOKEN_ENVIRONMENT_ID_VERIFIED=YES');
  console.log(`PROJECT_NAME=${EXPECTED_PROJECT_NAME}`);
  console.log(`ENVIRONMENT_NAME=${scope.environment.name}`);
  console.log(`GAME_SERVER_SERVICE_NAME=${scope.gameServer.name}`);
  console.log(`DATABASE_SERVICE_NAME=${scope.databaseRoute.databaseService.name}`);
  console.log('GAME_SERVER_DB_LINK_VERIFIED=YES');
  console.log(`DATABASE_ROUTE=${scope.databaseRoute.route}`);
  console.log('PRODUCTION_SCOPE_VERIFIED=YES');

  const childEnv: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: scope.databaseRoute.databaseUrl };
  delete childEnv.DATABASE_PUBLIC_URL;
  delete childEnv.RAILWAY_TOKEN;
  const child = spawnSync(childCommand, process.argv.slice(separator + 2), {
    env: childEnv,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (child.error) throw child.error;
  const urls = [
    scope.databaseRoute.databaseUrl,
    scope.databaseRoute.databaseService.variables.DATABASE_URL,
    scope.databaseRoute.databaseService.variables.DATABASE_PUBLIC_URL,
  ].filter((value): value is string => Boolean(value));
  const sensitiveValues = new Set<string>(urls);
  for (const value of urls) {
    const parsed = new URL(value);
    for (const sensitive of [parsed.hostname, parsed.username, parsed.password, parsed.port, parsed.pathname.slice(1)]) {
      if (sensitive) sensitiveValues.add(sensitive);
    }
  }
  const redact = (text: string | undefined) => {
    let safe = text ?? '';
    for (const sensitive of [...sensitiveValues].sort((left, right) => right.length - left.length)) {
      safe = safe.replaceAll(sensitive, '[REDACTED]');
    }
    return safe;
  };
  process.stdout.write(redact(child.stdout));
  process.stderr.write(redact(child.stderr));
  process.exitCode = child.status ?? 1;
}

if (process.env.VITEST !== 'true') {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
