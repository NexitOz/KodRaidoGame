# syntax=docker/dockerfile:1
FROM node:20-slim AS base
WORKDIR /repo
RUN corepack enable

FROM base AS deps
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY apps/worker/package.json apps/worker/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
RUN npm run build -w @kod-raido/shared
RUN npm run build -w apps/worker

FROM node:20-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/apps/worker ./apps/worker
WORKDIR /repo/apps/worker
CMD ["node", "dist/index.js"]
