# Код Райдо: Резонанс / RAIDO: RESONANCE

Браузерная коллекционная карточная PvP-игра по вселенной музыкального проекта «Код Райдо».
Монорепозиторий на TypeScript: Next.js фронтенд, NestJS игровой сервер, BullMQ воркер и общие
пакеты (типы, игровой движок, UI-кит).

Статус: **Phase 0 (Foundation) + Phase 1 (Collection) + Phase 2 (Game engine)** реализованы. См.
[`docs/progress.md`](./docs/progress.md) за подробным трекингом фаз и
[`docs/cards.md`](./docs/cards.md) за списком стартовых карт.

## Структура монорепозитория

```text
/apps
  /web           Next.js mobile-first фронтенд (App Router, Tailwind, Zustand, TanStack Query)
  /game-server   NestJS API: auth, cards, tracks, me/collection, me/decks
  /worker        BullMQ воркер (скелет очереди пересчёта Resonance)
/packages
  /game-engine   Чистая игровая логика (валидация колод; MatchState/Effect DSL — Phase 2)
  /shared        Общие TypeScript-типы и zod-схемы (Card, Deck, Resonance, ...)
  /ui            Общие React-компоненты (CardView, Badge, ResonanceBadge, Button)
  /config        Общие ESLint/Tailwind/tsconfig пресеты
/infra           Dockerfile-ы для каждого приложения
/docs            Прогресс и игровой контент
```

## Технологии

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand, TanStack Query
- **Backend:** NestJS 10, Prisma, PostgreSQL, Redis, JWT + refresh-token rotation, Argon2
- **Jobs:** BullMQ + ioredis
- **Tooling:** npm workspaces, ESLint, Prettier, Vitest
- **Infra:** Docker Compose (Postgres, Redis, game-server, worker, web)

## Быстрый старт (Docker Compose)

```bash
cp apps/game-server/.env.example apps/game-server/.env
cp apps/web/.env.example apps/web/.env
docker compose up --build
```

Миграции применяются автоматически при старте контейнера `game-server`. Один раз выполните сид:

```bash
docker compose exec game-server npm run seed
```

- Web: http://localhost:3000
- API: http://localhost:4000/api
- Демо-аккаунт после сида: `demo@kodraido.io` / `demo12345`

## Локальная разработка без Docker

Требуется Node.js 20+, локальный PostgreSQL и Redis (или запустите их через
`docker compose up postgres redis`).

```bash
npm install

cp apps/game-server/.env.example apps/game-server/.env
cp apps/web/.env.example apps/web/.env
cp apps/worker/.env.example apps/worker/.env
# отредактируйте DATABASE_URL/REDIS_URL при необходимости

npm run prisma:generate
npm run prisma:migrate     # создаёт схему в локальной БД
npm run seed                # 24 карты, демо-пользователь, 2 стартовые колоды

npm run dev:server          # NestJS API на :4000
npm run dev:web              # Next.js на :3000
npm run dev:worker           # BullMQ worker
```

## Основные команды

| Команда             | Описание                          |
| ------------------- | --------------------------------- |
| `npm run lint`      | ESLint по всем workspaces         |
| `npm run typecheck` | `tsc --noEmit` по всем workspaces |
| `npm run test`      | Vitest по всем workspaces         |
| `npm run build`     | Сборка всех пакетов и приложений  |
| `npm run seed`      | Заполнение БД стартовым контентом |

## Деплой (Vercel / Replit / Railway)

Чтобы получить публичную ссылку на живой визуал (не только локально), см.
[`docs/deployment.md`](./docs/deployment.md) — пошаговый гайд: бэкенд на Railway (game-server +
Postgres + Redis), фронтенд на Vercel и/или Replit.

## Что реализовано (Phase 0 + Phase 1)

- npm workspaces монорепо, общий TypeScript/ESLint/Prettier конфиг
- Email/password аутентификация: регистрация, логин, refresh-ротация, logout
  (httpOnly refresh cookie + короткоживущий JWT access token)
- Data model: `users`, `cards`, `tracks`, `media_assets`, `collections`, `decks`, `deck_cards`
- Публичные `GET /api/cards`, `GET /api/cards/:id`, `GET /api/tracks`
- Приватные `GET /api/me`, `GET /api/me/collection`, CRUD `GET/POST/PUT/DELETE /api/me/decks`
- Валидация колоды (30 карт, лимит копий 2 / 1 для Legendary и Raido, права, владение) —
  общая логика в `@kod-raido/game-engine`, используется и на клиенте, и на сервере
- 24 стартовые placeholder-карты (12 персонажей, 4 трека, 4 события, 4 руны) + 2 готовые колоды
  (`Shadow Aggro`, `Resonance Midrange`)
- `/collection` — фильтры по типу, поиск, детальный drawer карты с Resonance-плейсхолдером
- `/decks` — конструктор колод: добавление/удаление карт с учётом владения и лимитов редкости,
  кривая стоимости, синергия тегов, live-валидация
- Тёмный премиальный UI «Код Райдо» (чёрный/графит/белый/красный, рунные акценты), mobile-first
- Docker Compose: Postgres, Redis, game-server, worker, web
- **Детерминированный игровой движок** (`@kod-raido/game-engine`, без UI-зависимостей): ходы,
  энергия 1→10, добор, бой, усталость, полный интерпретатор Effect DSL (12 эффектов, все триггеры
  из раздела 19 ТЗ), статусы SHIELD/IMPULSE/HIDDEN/SILENCED, реактивные Руны, PvE-бот трёх
  сложностей — 68 unit-тестов, включая полный симулированный матч бот-vs-бот до победителя
- Unit-тесты по всему монорепо: resonance scoring, deck validation, auth service, decks service,
  API client, весь игровой движок (84 теста суммарно)

## Что осталось (следующие фазы)

См. подробности в [`docs/progress.md`](./docs/progress.md). Коротко:

- **Phase 3:** экран матча в web-приложении поверх готового движка, полноценный PvE-матч с
  наградами и историей, seed-данные для 40 карт Дополнения №3
- **Phase 4:** онлайн PvP, matchmaking, authoritative WebSocket game-server, reconnect
- **Phase 5:** Resonance snapshots, ManualProvider/CSV импорт метрик, пересчёт Tier, страница
  «Пульс Райдо» с реальными трендами
- **Phase 6:** внешние провайдеры метрик (TikTok/YouTube/VK) — только через официальные API
- **Phase 7:** аудио-система, анимации, сезоны, косметика
- Дополнение №3 (40 карт по вселенным-референсам) — после Phase 2 и проверки `rightsStatus`
