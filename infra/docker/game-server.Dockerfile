# syntax=docker/dockerfile:1
FROM node:20-slim AS base
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/game-engine/package.json packages/game-engine/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY apps/game-server/package.json apps/game-server/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run build -w @kod-raido/shared -w @kod-raido/game-engine
RUN npm run prisma:generate -w apps/game-server
RUN npm run build -w apps/game-server

FROM node:20-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/apps/game-server ./apps/game-server
WORKDIR /repo/apps/game-server
EXPOSE 4000
CMD ["node", "dist/main.js"]
