# Progress: Код Райдо: Резонанс

Отслеживание реализации по фазам из технического задания.

## Phase 0 — Foundation ✅ Done

- [x] npm workspaces monorepo: `apps/*`, `packages/*`
- [x] Общий `tsconfig.base.json`, ESLint preset, Prettier
- [x] `packages/shared`: типы карт/юзера/колоды/резонанса, zod-схемы, deck-константы
- [x] `packages/game-engine`: скелет (deck validation реализована; MatchState/applyAction —
      заглушка на Phase 2)
- [x] `packages/ui`: CardView, Badge, ResonanceBadge, Button
- [x] `packages/config`: eslint-preset, tailwind-preset, tsconfig base
- [x] PostgreSQL + Prisma схема: `users`, `cards`, `tracks`, `media_assets`, `collections`,
      `decks`, `deck_cards`, `refresh_tokens`
- [x] Redis (используется воркером)
- [x] Email/password auth: register/login/refresh/logout, argon2, JWT + refresh rotation в
      httpOnly cookie
- [x] Docker Compose: postgres, redis, game-server, worker, web
- [x] CI (GitHub Actions): lint, typecheck, test, build

## Phase 1 — Collection ✅ Done

- [x] `GET /api/cards`, `GET /api/cards/:id`, `GET /api/tracks` (публичные)
- [x] `GET /api/me`, `GET /api/me/collection`, CRUD `/api/me/decks` (приватные, JWT-guard)
- [x] Seed: 24 placeholder-карты (12 персонажей, 4 трека, 4 события, 4 руны) + demo-пользователь
      со стартовой коллекцией и двумя готовыми колодами (`Shadow Aggro`, `Resonance Midrange`)
- [x] `/collection`: фильтры по типу, поиск, сетка карт, detail drawer с Resonance-плейсхолдером
- [x] `/decks`: конструктор колод — добавление/удаление с учётом владения и лимитов редкости,
      кривая стоимости, синергия тегов, live-валидация (30 карт, max 2/1 копии)
- [x] Тёмный премиальный UI «Код Райдо», mobile-first, bottom nav
- [x] Unit-тесты: `@kod-raido/shared` (resonance scoring), `@kod-raido/game-engine`
      (deck validation), `game-server` (auth service, decks service), `web` (api client)

### Осознанные упрощения Phase 0/1

- 24 стартовые карты — собственные placeholder-персонажи вселенной «Код Райдо», а не карты из
  Дополнения №3 (Solo Leveling / D.Gray-man / Fruits Basket / Eminence in Shadow / Lord of
  Mysteries / Swallowed Star). Дополнение №3 явно помечено как design-reference с
  `rightsStatus`-проверкой и запланировано "после завершения базового game engine" — то есть
  после Phase 2.
- `effectJson` на картах уже хранит структуры в формате Effect DSL (раздел 19 ТЗ), но движок их
  пока не исполняет — это Phase 2.
- Resonance Tier на всех картах сейчас статичный placeholder (`0`), реальные `metric_snapshots` /
  `resonance_snapshots` таблицы, ManualProvider/CSV импорт и пересчёт появятся в Phase 5.
- `/resonance` — статическая страница с легендой Tier 0–5, без живых данных.
- `GET /api/resonance`, `GET /api/resonance/trending`, `/api/admin/*` — не реализованы, это
  Phase 5 и админка.

## Phase 2 — Game engine ⏳ Not started

- [ ] Ходы, энергия (1→10), добор, поле (max 5 существ)
- [ ] Атаки, урон, смерть, усталость при пустой колоде
- [ ] Effect DSL интерпретатор (10–15 базовых эффектов: DAMAGE, HEAL, BUFF, DEBUFF, DRAW, SHIELD,
      SUMMON, DESTROY, COST_MODIFIER, SILENCE, GAIN_ENERGY, ADD_STATUS)
- [ ] Статусы: SHIELD, IMPULSE, HIDDEN, CURSE
- [ ] PvE-бот (Easy/Normal/Hard)
- [ ] Полный playable-матч, детерминированные тесты (RNG seed)
- [ ] Реализовать 40 карт из Дополнения №3 как seed-данные (после проверки rightsStatus,
      dev-only режим для карт с anime/donghua референсами)

## Phase 3 — PvE ⏳ Not started

- [ ] Полный PvE-матч против бота, награды, история матчей

## Phase 4 — Online PvP ⏳ Not started

- [ ] Matchmaking (`POST /api/matchmaking/join|leave`)
- [ ] Authoritative WebSocket game-server (Socket.IO), event log, state diff
- [ ] Reconnect (60s, Redis match state)
- [ ] Ranked skeleton (MMR, ранги Iron→Raido)

## Phase 5 — Resonance ⏳ Not started

- [ ] `metric_snapshots`, `resonance_snapshots` таблицы и recalculation job (BullMQ)
- [ ] ManualProvider + CSV import (`POST /api/admin/metrics/import`)
- [ ] Resonance scoring (rolling 7d/24h/30d, формула из раздела 5.4 ТЗ), Tier 0–5
- [ ] Boost snapshot, фиксируемый при старте матча
- [ ] `GET /api/resonance`, `GET /api/resonance/trending`, страница `/resonance` с реальными
      данными и графиком 7d

## Phase 6 — External providers ⏳ Not started

- [ ] TikTok/YouTube/VK провайдеры (только официальные API, без scraping)

## Phase 7 — Polish ⏳ Not started

- [ ] Web Audio/Howler, Music/SFX/Voice sliders, Low Data Mode
- [ ] Анимации редкостей (Raido/Legendary/Epic), сезоны, косметика, аналитика
