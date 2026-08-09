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
COPY apps/web/package.json apps/web/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY --from=deps /repo/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_API_URL=http://localhost:4000/api
RUN npm run build -w @kod-raido/shared -w @kod-raido/game-engine -w @kod-raido/ui
RUN npm run build -w apps/web

FROM node:20-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/apps/web ./apps/web
WORKDIR /repo/apps/web
EXPOSE 3000
CMD ["npm", "run", "start"]
