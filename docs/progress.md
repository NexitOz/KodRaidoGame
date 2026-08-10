# Progress: Код Райдо: Резонанс

Отслеживание реализации по фазам из технического задания.

## Статус веток (актуально на момент этого коммита)

Ветка `claude/execute-specification-tasks-jytvjm` синхронизирована с `main`: смержены
production/Docker/OpenSSL-фиксы `game-server.Dockerfile` (два коммита `main`, не пересекались ни
с одним файлом из Phase 5-7 — merge прошёл без конфликтов). Ветка содержит полный набор фаз
0-6 плюс часть Phase 7 (см. ниже) и готова к мержу в `main` одним PR.

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
- Resonance Tier на момент Phase 0/1 был статичным placeholder (`0`) — с Phase 5 карты, у которых
  есть импортированные метрики, получают реальный Tier; карты без данных остаются на `0`, что
  тоже корректно (нет хайпа — нет буста).

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

## Phase 3 — PvE ✅ Done

- [x] Prisma-схема: `Match`/`MatchEvent` модели (`MatchStatus`, `BotDifficulty` enum),
      миграция применена
- [x] `game-server`: `RedisModule` + `MatchStateRepository` — активный `MatchState` живёт в Redis
      (TTL 6ч, чтобы можно было вернуться к забытой вкладке), Postgres хранит только
      персистентную историю матчей (создаётся/обновляется при старте и завершении)
- [x] `MatchesModule` — `POST /api/matches/pve` (валидирует колоду ровно 30 карт, случайно
      выбирает архетип бот-колоды из dev-пресетов, `createMatch`+`beginMatch`), `GET
      /api/matches/:id` (view с редактированной рукой соперника), `POST
      /api/matches/:id/actions` (PLAY_CARD/ATTACK/END_TURN → `applyAction`, затем автоматически
      прогоняет ход бота через `chooseBotAction` до возврата хода игроку или конца матча — в том
      числе и на самом первом ходу, если честный coin-flip отдал первый ход боту), `GET
      /api/me/matches` (история)
- [x] Награды PvE (`PVE_REWARDS`: win/loss XP + мягкая валюта) и пересчёт уровня
      (`computeLevelForXp`) начисляются транзакционно при завершении матча
- [x] 9 unit-тестов `MatchesService` (fake Prisma/Redis): создание матча, валидация 30 карт,
      владение колодой, редактирование руки соперника, авто-ход бота (включая случай "бот ходит
      первым"), нелегальные действия, чужой матч, начисление наград и очистка Redis-состояния,
      история
- [x] Экран матча в `apps/web` (`/play` — выбор готовой колоды и сложности бота; `/play/[matchId]`
      — поле боя, рука с tap-to-play, tap-to-attack через выбор атакующего/цели, кнопка "Завершить
      ход", сворачиваемый журнал событий, модалка результата с наградами)
- [x] Полный прогон вручную через Playwright (реальные dev-серверы + Postgres/Redis): регистрация
      → колода → `/play` → бой до победителя → модалка результата → история в `/me/matches`
- [x] Лендинг и bottom nav ведут на `/play` для авторизованных пользователей

### Осознанные упрощения Phase 3

- Выбор цели у карт с ON_PLAY-эффектом (`ENEMY_CHOSEN`/`ALLY_CHOSEN`) на UI необязателен: игрок
  может либо коснуться существа/Проводника-цели на поле, либо сыграть карту без явной цели кнопкой
  "Сыграть без цели" — в этом случае эффект, которому нужна цель, просто не применится (это
  поведение уже заложено в движке `effects/targets.ts`, не костыль фронтенда).
- Матчи PvP/матчмейкинг не входят в эту фазу — Phase 4.
- Реализовать 40 карт из Дополнения №3 как seed-данные (после проверки rightsStatus,
  dev-only режим для карт с anime/donghua референсами) по-прежнему отложено — движок и экран матча
  их уже полностью поддерживают, это чисто content-задача.

## Phase 4 — Online PvP ✅ Done

- [x] Prisma: `User.mmr` (старт 1000), `Match.player1MmrDelta`/`player2MmrDelta` и
      `player2XpAwarded`/`player2SoftCurrencyAwarded` для несимметричных PvP-наград
- [x] `packages/shared`: `RANK_TIERS`/`rankForMmr` (Iron/Bronze/Silver/Gold/Platinum/Diamond/Raido
      по порогам mmr) и `computeMmrDelta` (Elo, K=32) с 9 unit-тестами; `PVP_REWARDS`
      (win/loss/draw); типизированный WS-контракт `packages/shared/src/types/pvp.ts`
      (`MatchActionInput`, `MatchmakingStatus`, `Match{Join,Action,Found,State,Presence,Error}Payload`)
      — общий и для game-server, и для web, чтобы клиент и сервер не могли разойтись по форме событий
- [x] `MatchStateRepository` обобщён с единственного `humanPlayerId` на список `participantIds` —
      PvE (1 человек) и PvP (2 человека) используют одно и то же хранилище/проверку владения
- [x] `MatchesService`: `createPvpMatch`/`applyPvpAction` (без авто-хода бота — ходят два реальных
      игрока), `forfeitPvpMatch` (техническое поражение при таймауте переподключения),
      `finishPvpMatch` (транзакционно начисляет разный XP/валюту победителю и проигравшему,
      считает MMR-дельту для обоих через `computeMmrDelta`); `listHistory` учитывает роль
      (player1/player2) и подставляет реальный ник соперника вместо "Бот"
- [x] `MatchmakingService`: FIFO-очередь на Redis sorted set (`POST /api/matchmaking/join|leave`,
      `GET /api/matchmaking/status`), `@Interval(2000)` пара́ует двух самых давно ждущих игроков и
      создаёт PvP-матч — осознанно "скелет" без учёта MMR-диапазонов и без координации между
      несколькими инстансами game-server (см. упрощения ниже)
- [x] `MatchGateway` (Socket.IO, namespace `/pvp`): JWT-аутентификация при подключении
      (`handshake.auth.token`), `match:join`/`match:action` от клиента, `match:found`/`match:state`/
      `match:opponent_disconnected`/`match:opponent_reconnected`/`match:error` от сервера,
      редактированный вид состояния рассылается каждому участнику отдельно; при разрыве соединения
      — таймер на 60 секунд, затем автоматическое техническое поражение через `forfeitPvpMatch`
- [x] 16 новых backend-тестов: `MatchmakingService` (валидация колоды, FIFO-пара, нечётный игрок в
      очереди), `MatchesService` PvP (создание, чужой участник, ход не по очереди, полный матч с
      симметричной MMR-дельтой при равном рейтинге, форфейт, история с обеих сторон)
- [x] `apps/web`: `/pvp` (выбор колоды, "Найти матч", живой статус поиска, отмена),
      `/pvp/[matchId]` (тот же интерфейс боя, что и `/play/[matchId]`, но управляемый WebSocket-
      событиями, а не REST-мутациями; баннер "соперник отключился" с обратным отсчётом)
- [x] Общий презентационный компонент `MatchBoard` вынесен из `/play/[matchId]`, чтобы PvE- и
      PvP-экраны не расходились в вёрстке — оба сейчас рендерят один и тот же компонент с разными
      обработчиками действий (REST-мутация против WS-эмита)
- [x] Полный прогон вручную через Playwright с двумя независимыми браузерными контекстами (два
      реальных игрока, два аккаунта, два сокета): регистрация → колода → очередь → матч → бой до
      победителя через реальный UI → модалка результата с MMR-дельтой → история совпадает у обеих
      сторон

### Осознанные упрощения Phase 4

- Матчмейкинг — честный FIFO без учёта MMR-диапазонов ("пара́ует двух самых давно ждущих", а не
  "ищет соперника близко по рейтингу") и без блокировки между несколькими инстансами game-server
  (`@Interval` тик читает-и-удаляет из общей Redis-очереди без распределённой блокировки) — вполне
  достаточно для одного инстанса, что и требовалось словом "скелет" в самой формулировке фазы в ТЗ.
- Ник соперника в PvP не подставляется в сам `MatchStateView` (карта игрового поля показывает
  нейтральное "Соперник") — `PlayerStateView` в движке не хранит username, только `playerId`; в
  списке истории боёв (`/me/matches`) реальный ник уже показывается, потому что там он берётся из
  Prisma-связи `Match.player1`/`player2`, а не из состояния матча.
- CORS у WebSocket-шлюза сейчас permissive (`origin: true`), в отличие от REST API, где список
  разрешённых доменов явно берётся из `WEB_ORIGIN` — единственное, что может сделать неавторизованный
  сокет — это получить `disconnect` сразу после рукопожатия без валидного JWT, так что ужесточение
  до того же allowlist, что и у REST, оставлено как understood follow-up, а не блокер.

## Phase 5 — Resonance ✅ Done

- [x] Prisma: `MetricSnapshot` (сырые метрики по `MediaAsset`) и `ResonanceSnapshot` (история
      score/tier/boost по карте) таблицы, `@@unique([provider, externalId])` на `MediaAsset` для
      идемпотентного апсерта при повторном импорте
- [x] `RESONANCE_QUEUE_NAME`/`ResonanceRecalculateJobData` вынесены в `packages/shared`
      (dependency-free контракт), чтобы продюсер (game-server) и консьюмер (apps/worker) не могли
      разойтись по имени очереди/форме джобы — сам BullMQ-клиент у каждого свой
- [x] `apps/worker`: `recalculateCard`/`recalculateAll` — реальный пересчёт по rolling 7-дневному
      окну (текущие 7д против предыдущих 7д, как и было заложено в Phase 0/1 формулой
      `computeResonanceScore`), с денормализацией результата в `Card.resonanceTier`, чтобы уже
      существующие экраны (коллекция, конструктор колод, рука в матче) увидели новый Tier без
      правок — они и так читают это поле
- [x] `POST /api/admin/metrics/import` — CSV-импорт метрик (ManualProvider по умолчанию,
      апсертит `MediaAsset` по `provider+externalId`, привязывает к треку по `trackSlug`, пишет
      `MetricSnapshot`, ставит джобу пересчёта `ALL` в очередь). Гейт — общий секрет
      `ADMIN_API_KEY` в заголовке `x-admin-key` (fail closed, если переменная не задана) — полноценной
      ролевой системы ещё нет, это осознанно "скелет" под админку из ТЗ
- [x] `GET /api/resonance` (текущий tier/score/boost по всем активным картам), `GET
      /api/resonance/trending` (карты с положительной динамикой между двумя последними
      пересчётами), `GET /api/resonance/:cardId/history` (снапшоты за 7 дней для графика) —
      публичные, без авторизации, как и `/api/cards`
- [x] Boost snapshot фиксируется в `MatchesService.createPveMatch`/`createPvpMatch` в момент
      старта матча (снимок текущих `ResonanceSnapshot` → `BoostSnapshotEntry[]`, передаётся в
      `createMatch` движка и параллельно сохраняется в `Match.boostSnapshotJson`) — сила карты не
      может измениться посреди матча, даже если хайп резко скакнёт
- [x] `@Cron('0 3 * * *')` в game-server ежедневно ставит `ALL`-пересчёт в очередь — не только
      по факту импорта метрик
- [x] `/resonance` в `apps/web` — живые данные вместо статичной легенды: полный список карт по
      убыванию score с Tier-бейджем и `+N% в Ranked`, блок "Растёт прямо сейчас" по
      `/resonance/trending`, разворачиваемая по клику мини-график (inline SVG sparkline,
      без сторонних chart-библиотек) по `/resonance/:cardId/history`
- [x] 33 новых unit-теста: `computeTrendPercent` (shared), `recalculateCard`/`recalculateAll`
      (worker, fake Prisma), CSV-парсер и `AdminMetricsService` (game-server, fake Prisma),
      `ResonanceService` — getAll/getTrending/getHistory/buildBoostSnapshot (game-server, fake
      Prisma)
- [x] Полный прогон вручную (реальные Postgres/Redis/game-server/worker/web): CSV-импорт с двумя
      снапшотами метрик → воркер реально забрал джобу из очереди и посчитал → `GET
      /api/resonance` показал Tier 5/Score 100/+10% для двух карт, привязанных к треку → создан
      PvE-матч, `Match.boostSnapshotJson` в базе содержит именно эти две карты → страница
      `/resonance` в браузере отрисовала список, бейджи и разворачивающийся спарклайн

### Осознанные упрощения Phase 5

- Формула читает раздел 5.4 ТЗ как "rolling 7d" для основного score/tier (текущие 7 дней метрик
  против предыдущих 7) — 24h/30d окна отдельно не реализованы как самостоятельные метрики
  (например отдельный "24h velocity" индикатор), только рекомендации на будущее; "trending"
  сейчас считается как позитивная дельта между двумя последними пересчётами, а не строго
  скользящее 24-часовое окно.
- CSV-парсер намеренно простой (`split(',')`, без экранирования кавычек) — это внутренний
  инструмент под контролируемый формат экспорта, не приём произвольных файлов от пользователей.
- Матчмейкинг из Phase 4 не учитывает Resonance при подборе — это, как и было, отдельная задача.
- Реальные провайдеры (TikTok/YouTube/VK API) реализованы в Phase 6; ручной CSV-импорт
  (`provider: "manual"` по умолчанию) остаётся основным способом первично привязать `MediaAsset`
  к треку — провайдеры лишь обновляют метрики по уже привязанным ассетам.

## Phase 6 — External providers ✅ Done (в пределах доступных креденшелов)

- [x] `apps/worker/src/providers/types.ts` — общий интерфейс `MetricsProvider`
      (`isConfigured()`/`fetchMetrics(externalId)`), не завязан на конкретную платформу
- [x] `youtube.provider.ts` — YouTube Data API v3 (`videos.list?part=statistics`), только по ключу
      (`YOUTUBE_API_KEY`), официальный и полностью рабочий без approval-процесса
- [x] `tiktok.provider.ts` — TikTok Research API v2 (`/v2/research/video/query/`), OAuth-токен
      (`TIKTOK_ACCESS_TOKEN`); честно помечен как требующий одобренного TikTok-приложения — до
      апрува токена просто нет, провайдер сообщает `isConfigured() === false` и опрос его
      пропускает, а не притворяется рабочим
- [x] `vk.provider.ts` — VK API (`video.get`), токен (`VK_ACCESS_TOKEN`), `externalId` в формате
      `{ownerId}_{videoId}`, как того требует сам VK
- [x] `poll-metrics.ts` — `pollProviderMetrics`: по каждому настроенному провайдеру находит уже
      существующие `MediaAsset` с его `provider`-именем (созданные раньше через CSV-импорт или
      предыдущий опрос), тянет свежие метрики, пишет `MetricSnapshot`; ошибка на одном ассете
      (видео удалено, рейт-лимит) не прерывает остальные — просто считается в `failed`
- [x] `apps/worker/src/index.ts` — при старте собирает список провайдеров из `process.env.*`,
      настроенные опрашивает сразу и затем каждые 6 часов (`setInterval`), после успешного опроса
      сразу вызывает `recalculateAll`, чтобы Resonance не ждала до ежедневного 3:00 крона из
      Phase 5; при отсутствии всех ключей просто логирует и не создаёт лишний таймер
- [x] Обработка ошибок опроса обёрнута в try/catch — сбой (недоступна БД, упал провайдер) пишется
      в лог, но не роняет весь процесс воркера (в нём же крутится и обработчик очереди пересчёта
      Resonance — уронить воркер из-за метрик значило бы остановить и его)
- [x] 17 unit-тестов (мокнутый `fetch`, fake Prisma): маппинг ответа каждого провайдера в
      `ProviderMetrics`, обработка "не найдено"/ошибка API, `pollProviderMetrics` — пропуск
      неготовых провайдеров, запись по каждому ассету, устойчивость к частичному сбою,
      изоляция по `provider`
- [x] Ручная сквозная проверка на реальном Postgres: создан `Track`+`MediaAsset(provider=youtube)`,
      `pollProviderMetrics` с мокнутым `fetch` записал настоящий `MetricSnapshot` в базу,
      `recalculateAll` отработал без ошибок поверх него

### Осознанные упрощения Phase 6

- Ни один провайдер не проверялся с боевыми креденшелами — в этой среде их взять неоткуда
  (нужны одобренные приложения на YouTube/TikTok/VK). Форма запроса/ответа реализована по
  официальной документации на момент написания и обёрнута тестами на маппинг данных, но перед
  первым реальным продакшен-опросом стоит свериться с актуальной документацией платформы,
  особенно TikTok Research API — она меняется чаще остальных и требует отдельного approval.
  `isConfigured()` — намеренная защита: без ключа провайдер не пытается сделать вид, что работает.
  YouTube — единственный, у кого "включить" означает буквально "вписать ключ в `.env`".
- `externalId` каждой платформы по-прежнему появляется в `MediaAsset` только через ручной
  CSV-импорт (Phase 5) — Phase 6 берёт на себя обновление метрик по уже привязанным ассетам, а не
  их первичное обнаружение/линковку к трекам; это соответствует формулировке фазы в ТЗ
  ("провайдеры", не "поиск контента").
- Опрос — простой `setInterval` в самом воркере, не отдельная BullMQ repeatable job — воркер и
  так уже единственный процесс, которому нужен прямой доступ к Prisma для записи метрик, и
  добавлять пересылку через очередь ради этого не даёт выгоды.

## Phase 7 — Polish ⏳ In progress

- [x] `apps/web/src/lib/settings-store.ts` — zustand+persist store: `musicVolume`/`sfxVolume`/
      `voiceVolume` (0-100, дефолт 70) и `lowDataMode`, ключ `kod-raido-settings` в localStorage
- [x] `/settings` — три слайдера громкости, кнопка "Проверить звук", переключатель Low Data Mode;
      ссылка на страницу добавлена в `TopBar` (иконка ⚙)
- [x] `apps/web/src/lib/sfx.ts` — Web Audio SFX-движок без внешних аудио-ассетов (лицензированных
      звуков в задаче нет и взять неоткуда): синтезированные тона через `OscillatorNode` +
      `GainNode` envelope, ленивый singleton `AudioContext`, читает `useSettingsStore.getState()`
      напрямую (корректный паттерн для вызова вне рендера), no-op при `lowDataMode`/`sfxVolume=0`.
      Курсы: `card-play`, `attack`, `unit-death`, `turn-end`, `match-win`, `match-loss`
- [x] `match-sfx.ts` — батч событий движка (например весь ход бота) схлопывается в один звук по
      приоритету (`unit-death` > `attack` > `card-play` > `turn-end`), чтобы не звучало пулемётом
- [x] SFX подключены в оба экрана матча (`/play/[matchId]` через `onSuccess` мутации,
      `/pvp/[matchId]` через `socket.on('match:state', ...)`) — победа/поражение отдельным звуком,
      иначе звук по приоритетному событию батча
- [x] Low Data Mode отключает `animate-pulse-rune` (свечение легендарных/RAIDO карт) через
      `[data-low-data='true']` в `globals.css`, синхронизируется `LowDataModeSync` (клиентский
      компонент без вывода, пишет в `document.documentElement.dataset.lowData`)
- [x] По ходу дела исправлена карта `EVENT_LABEL` в `MatchBoard.tsx` — старые ключи
      (`TURN_STARTED`/`TURN_ENDED`/`DRAW`) не совпадали с реальными типами событий движка
      (`TURN_START`/`TURN_END`/`CARD_DRAWN`), из-за чего журнал матча иногда показывал сырой тип
      вместо русской подписи; заодно добавлены недостающие типы событий
- [x] 4 unit-теста на `sfx.ts` (нет AudioContext / lowDataMode / sfxVolume=0 / точный набор
      осцилляторов для `match-win`); полный прогон lint/typecheck/test/build по всем workspace'ам
      зелёный (158 тестов)
- [x] Ручная проверка в реальном браузере (Playwright + Chromium, не jsdom): слайдеры и Low Data
      Mode переживают reload, `dataset.lowData` синхронизируется, кнопка "Проверить звук"
      корректно задизейблена при Low Data Mode; реальный PvE-матч (через API созданы юзер/колода/
      матч, состояние авторизации подставлено в localStorage) — `END_TURN` прошёл, SFX-код
      отработал в настоящем `AudioContext` без единой ошибки в консоли
- [ ] Музыка и голос — сами слайдеры и инфраструктура есть, но проигрывания фоновой музыки/войсовера
      ещё нет (нет лицензированных аудио-ассетов, только синтезированные SFX)
- [x] Анимации редкостей — своя CSS keyframes-анимация на каждую "громкую" редкость (RAIDO —
      уже существовавший `pulse-rune`, LEGENDARY — `pulse-legendary` золотой, EPIC —
      `shimmer-epic` фуксия), COMMON/RARE намеренно остаются статичными (только цвет рамки),
      чтобы анимация действительно читалась как сигнал редкости, а не фоновый шум по всей
      коллекции. Живут в `packages/config/tailwind-preset.js` + `packages/ui/src/rarity.ts`,
      подчиняются тому же `[data-low-data='true']`-правилу, что и старый `pulse-rune`
- [x] Аналитика — `GET /api/admin/analytics/summary` (гейт тем же `AdminKeyGuard`, что и CSV-импорт,
      без нового веб-интерфейса — админ-поверхность и так задумана как API-скелет). Ничего не
      логирует отдельно: считает всё поверх уже существующих `User`/`Match`/`MatchEvent` — раз
      Phase 3/4 и так пишут каждое событие завершённого матча в базу, "самая играемая карта" это
      агрегация по `CARD_PLAYED`-пейлоадам, а не новый трекинг-пайплайн на каждый экран. Отдаёт:
      `totalUsers`/`newUsersLast7Days`, `totalMatches`/`finishedMatches`, разбивку
      `matchesByMode: {pve, pvp}`, `matchesLast7Days`, топ-10 карт по числу розыгрышей с именами
- [x] 6 unit-тестов (fake Prisma) + ручная проверка на реальном Postgres: поднят game-server,
      сыгран настоящий PvE-матч до конца через API (доигрывающий скрипт play-to-finish),
      `GET /api/admin/analytics/summary` с реальным `x-admin-key` вернул корректные
      `finishedMatches: 1`, `matchesByMode: {pve: 1, pvp: 0}` и топ карт с реальными именами;
      без ключа и с неверным ключом — честные 401
- [ ] Сезоны, косметика — не начаты, требуют отдельного скоупа (контент/арт), в ТЗ не было
      конкретики по формату

### Осознанные упрощения Phase 7 (текущий срез)

- Звук синтезируется на лету (осцилляторы), а не проигрывается из файлов — в задаче нет
  лицензированных аудио-ассетов, а генерировать/искать их отдельная задача вне кода.
- Voice-слайдер существует в UI и сторе на будущее, но пока ничего не регулирует — голосовых
  реплик в игре ещё нет.
