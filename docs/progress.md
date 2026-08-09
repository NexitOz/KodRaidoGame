# Progress: Код Райдо: Резонанс

Отслеживание реализации по фазам из технического задания.

## Phase 0 — Foundation ✅ Done

- [x] npm workspaces monorepo: `apps/*`, `packages/*`
- [x] Общий `tsconfig.base.json`, ESLint preset, Prettier
- [x] `packages/shared`: типы карт/юзера/колоды/резонанса, zod-схемы, deck-константы
- [x] `packages/game-engine`: deck validation + полный детерминированный игровой движок (Phase 2)
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
- Resonance Tier на всех картах сейчас статичный placeholder (`0`), реальные `metric_snapshots` /
  `resonance_snapshots` таблицы, ManualProvider/CSV импорт и пересчёт появятся в Phase 5.
- `/resonance` — статическая страница с легендой Tier 0–5, без живых данных.
- `GET /api/resonance`, `GET /api/resonance/trending`, `/api/admin/*` — не реализованы, это
  Phase 5 и админка.

## Phase 2 — Game engine ✅ Done

Живёт целиком в `@kod-raido/game-engine`, без UI-зависимостей, всё в чистом TypeScript.

- [x] Детерминированный RNG (seed-based `createRng`/`shuffle`) — одинаковый seed даёт одинаковый
      матч, что и требовалось для future replay/anti-cheat
- [x] `createMatch`: раздача колод, шафл, стартовая рука 3, второй игрок получает
      компенсационную карту (4-я карта в руке), честный coin-flip кто ходит первым
- [x] Ходы: энергия 1→10 (общий счётчик хода, растёт каждый полуход), полное восстановление в
      начале хода, добор карты с хода 2, поле максимум 5 существ
- [x] Бой: одновременный урон атакующий/защитник, атака Проводника, "усталость" при пустой
      колоде (нарастающий урон), проверка победы (HP Проводника 0)
- [x] Effect DSL интерпретатор — все 12 эффектов из ТЗ (DAMAGE, HEAL, BUFF, DEBUFF, DRAW, SHIELD,
      SUMMON, DESTROY, COST_MODIFIER, SILENCE, GAIN_ENERGY, ADD_STATUS) и все триггеры
      (ON_PLAY, ON_DEATH, ON_ATTACK, ON_DAMAGE, TURN_START, TURN_END, ON_TRACK_PLAYED)
- [x] Условия эффектов: RESONANCE_TIER_AT_LEAST, HAS_TAG_ON_BOARD, IS_FIRST_CARD_THIS_TURN,
      ONCE_PER_TURN (универсальный механизм "первый раз за ход", не завязан на конкретную карту),
      TARGET_HAS_TAG
- [x] Статусы: SHIELD, IMPULSE, HIDDEN, CURSE, SILENCED — реализованы как reusable примитивы
      движка, а не спецкейсы под конкретные карты
- [x] Reactive-триггеры от Рун (постоянные эффекты): "первый персонаж/Shadow/Celestial за ход"
      реализовано через `broadcastToRunes` + `ONCE_PER_TURN`/одноразовый `COST_MODIFIER`
- [x] PvE-бот (`chooseBotAction`): EASY (случайный легальный ход), NORMAL (lethal → выгодный
      трейд → лучшая по стоимости карта → атака Проводника → конец хода), HARD (то же + берёт
      невыгодный по здоровью трейд, если снимает более крупную угрозу)
- [x] `applyAction` — чистая функция (не мутирует входной state), возвращает новый MatchState +
      список событий, как того требует раздел 18 ТЗ
- [x] 68 unit-тестов: RNG-детерминизм, раздача, энергия/добор/усталость, бой (щит/impulse/hidden/
      деатрраттл), все 12 эффектов и все условия по отдельности, легальность действий, PvE-бот на
      всех сложностях, и полный симулированный матч бот-vs-бот до победителя на 8 разных seed'ах
      (детерминированно, без зависаний, без нелегальных ходов)

### Осознанные упрощения Phase 2

- Эффекты с выбором одного из нескольких вариантов ("выберите: A, B или C") упрощены до одного
  фиксированного эффекта — UI для выбора варианта у карты нет, добавится вместе с экраном матча
  (Phase 3). Затронута только "Код Райдо: Пробуждение" (теперь просто "Доберите 2 карты").
- Коррат, Полый Король: способность переработана из неоднозначного "получает +1/+1 когда враг
  погибает в ваш ход" в чистый deathrattle ("при гибели наносит 3 урона Проводнику противника") —
  однозначно реализуемо через триггер ON_DEATH, не требует спецкейса.
- Дополнение №3 (40 карт по вселенным-референсам) по-прежнему не реализовано как seed-данные:
  движок для них готов (DSL их полностью покрывает), но сначала нужен экран матча (Phase 3),
  чтобы их можно было реально сыграть и протестировать руками.

## Phase 3 — PvE ⏳ Not started

- [ ] Экран матча в `apps/web` (поле, рука, drag/tap, лог событий) поверх готового движка
- [ ] `game-server`: эндпоинт создания PvE-матча, хранение MatchState (Redis), проксирование
      действий через `applyAction`
- [ ] Полный PvE-матч против бота, награды (XP/валюта/карты), история матчей
- [ ] Реализовать 40 карт из Дополнения №3 как seed-данные (после проверки rightsStatus,
      dev-only режим для карт с anime/donghua референсами) — можно делать параллельно, так как
      движок их уже поддерживает

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
