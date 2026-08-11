# Visual Polish 1.0 / Premium CCG Feel

Чисто визуальная/UX-фаза поверх First Player Experience 1.0 (`main` @ `93a0f7e`). **Никаких
изменений игровых правил, баланса карт, новых карт, сезонов/battle pass/магазина/экономики,
стороннего IP** — только визуальный язык поверх существующего контента и архитектуры.

## Art Direction

Dark Premium CCG + анимационно-кинематографичная энергия + Mystic Technology + рунический язык
Код Райдо. Палитра: почти-чёрный/графит/холодный серый/туманно-белый как база, глубокий
малиново-красный (`raido.red`/`redGlow`) как акцент (никогда не заливка), очень сдержанное золото
(`raido.gold`, только LEGENDARY), фиолетовый (`raido.violet`) только для EPIC, циан
(`raido.cyan`) только для Track Zone/музыкального контекста. Фон никогда не плоский чёрный:
`body` в `globals.css` использует слоистые radial-градиенты + едва заметный шумовой паттерн
(`repeating-linear-gradient`, opacity 0.015) + `background-attachment: fixed`.

## Design Tokens (`packages/config/tailwind-preset.js`)

Централизованы: цвета факций (`colors.faction.*`), доп. rarity-цвета (`violet`, `cyan`), радиусы
(`rounded-card`, `rounded-panel`), тени (`shadow-raido`, `shadow-epic`, `shadow-legendary`,
`shadow-panel`), фоновые слои (`bg-raido-vignette`, `bg-rune-noise`) и новые keyframes
(`rune-idle`, `ring-expand`, `dying-collapse`, `raido-sweep`, `panel-in`, `rise-select`). Все новые
компоненты читают эти токены вместо разбросанных inline hex-значений.

## Kod Raido Visual Language (`packages/ui`)

Три переиспользуемых компонента вместо форка карточных/панельных рендереров:

- **`RuneDivider`** — тонкая линия с рунической засечкой по центру, заменяет `<hr>` в Collection,
  Card Detail, Deck Select, Home.
- **`PremiumPanel`** — общая тёмная панель (`tone="default"` — графит+тонкая рамка+`shadow-panel`;
  `tone="raido"` — чёрно-металлический градиент+`shadow-raido` для "hero"-моментов).
- **`ResonanceRing`** — концентрические кольца, интенсивность растёт с Tier (0-2 тихо, 3+
  заметнее), используется и в `ResonancePulse` (Battlefield), и в `CardDetailDrawer` (cinematic
  mode) — один визуальный язык для сигнатурной механики везде, где она появляется.

## Rarity Language (`packages/ui/src/rarity.ts`)

Статичная рамка (`RARITY_FRAME_CLASS`) отделена от анимированного glow-слоя
(`RARITY_GLOW_CLASS`), который рендерится как отдельный `pointer-events-none` оверлей поверх
рамки в `CardView`. Так пульс/шиммер никогда не приглушает opacity самой артворки/текста.

- COMMON — матовая рамка, без анимации.
- RARE — холодный синий edge-glow, статично (без анимации — "почти без частиц").
- EPIC — сдержанный фиолетовый (`raido.violet`), `animate-shimmer-epic`.
- LEGENDARY — тёплое золото, `animate-pulse-legendary`.
- **RAIDO** — отдельный сигнатурный класс, НЕ "Legendary но красный": чёрно-металлический
  градиент (`from-raido-graphite to-raido-black`) + красная рамка + `shadow-raido` (внешний+inset
  glow) + собственная медленная `animate-rune-idle` пульсация + угловой рунический символ (ᚱ) в
  `CardView`. Отдельная более редкая обработка в `CardDetailDrawer` (RAIDO-only рамка + shadow).

## Faction Visual Identity (`packages/ui/src/factions.ts`)

`FACTION_ACCENT` — акцентный цвет + один символ-глиф на фракцию (не полный редизайн UI):
факционный бейдж на артворке карты (`CardView`), акцентный цвет типа/редкости под именем карты,
акцент в Deck Select. Цвета выбраны по духу фракции (дым/пепел для Shadow, белый рунический свет
для Purification, тёплый янтарь для Bond, чёрно-фиолетовая вуаль для Veil, серо-синий туман для
Mystery, циан звёздной энергии для Cosmic).

## Card Frame 2.0 + Depth

Иерархия сохранена (cost/name/art/type/rarity/ability/attack/health/faction/Resonance), но
добавлены: факционный бейдж, угловой RAIDO-символ, glow-оверлей отдельным слоем. Depth/hover:
лёгкий `-translate-y-1` + артворк `scale-[1.04]` на `group-hover`, `active:scale-[0.98]` на тап.
Respect `prefers-reduced-motion` через существующий `globals.css`-блок (плюс новые keyframes
добавлены в тот же guard) и Low Data Mode (`.card-tilt-layer` скрывается полностью).

## Battlefield 2.0

**Структура `MatchBoard` не менялась.** Добавлен только фоновый слой: `bg-raido-vignette` +
half-screen light-shift, тёплый снизу (`raido-red` градиент) когда ход игрока, холодный сверху
(`sky` градиент) когда ход соперника — читается мгновенно, не требует текста.

- **CreatureSlot**: targetable = расширяющееся кольцо (`animate-ring-expand`, зелёное) вместо
  сплошной красной "ошибки"; ready-to-attack = мягкий pulse-полоска у основания слота
  (`animate-ready-glow` на отдельном узком элементе), а не мигающая рамка целиком; selected =
  подъём + красная рамка+ring; только что призванное существо (`summonedThisTurn`) один раз
  проигрывает `animate-card-in` при монтировании (стабильный `instanceId`-key не даёт анимации
  повторяться на следующих ре-рендерах).
- **ConductorPanel**: панель на `PremiumPanel`-подобной градиентной подложке, `shadow-panel`; урон
  по Проводнику даёт дополнительное красное `ring-expand`-вспышку поверх обычного shake — заметно
  сильнее, чем обычный юнит.
- **EnergyPips**: доступные пипсы получили `drop-shadow` (внутренний свет).
- **ResonancePulse**: заменён на `ResonanceRing` + `ResonanceBadge`, при триггере — короткая
  надпись "Резонанс N" с `animate-float-up`, никакого блокирующего баннера.
- **RuneZone**: постоянный тихий `animate-rune-idle` на каждом руническом токене + stagger-задержка
  при триггере (имитация быстрой последовательной активации).
- **TrackZone**: перекрашен в циан (`raido-cyan`) вместо красного — визуально отличим от RuneZone
  (красный) по требованию спеки.
- **TurnOverlay**: короткий баннер (без изменений по длительности), добавлена тонкая
  resonance-линия под текстом, разный цвет рамки для "мой ход"/"ход соперника".
- **ResultModal**: заголовки в верхнем регистре ("ПОБЕДА"/"ПОРАЖЕНИЕ"), победа получает
  золотую рамку+`shadow-legendary`, поражение остаётся premium-серым (не "штрафным красным").

## Collection 2.0 / Deck Select / Home

- Collection: staggered `animate-card-in` (задержка по индексу, cap 24), улучшенный empty-state,
  `RuneDivider` между фильтрами и сеткой.
- `CardDetailDrawer` — cinematic-режим: `ResonanceRing` за артворком, rarity-рамка на самой
  артворке, лёгкий tilt на hover (desktop), RAIDO получает отдельную более насыщенную рамку.
- Deck Select (`/play`) теперь показывает доминирующую фракцию колоды (эвристика по большинству
  карт, не хранится в модели), 3 карты-превью и мини energy-curve вместо голого списка имён.
- Home: hero-секция на `bg-raido-radial` + шумовом слое, обновлённый хук
  ("Музыка рождает Резонанс. Резонанс меняет карты."), CTA "Играть"/"Коллекция".

## Iconography (`packages/ui/src/components/Icon.tsx`)

Новый минимальный геометрический SVG icon-set (`home/play/collection/decks/resonance/settings/
sword/heart/shield/close/info/rune/skull`) заменяет emoji в навигации (`BottomNav`, `TopBar`) и
карточной статистике атака/здоровье (`CardView`, `CreatureSlot`, `ConductorPanel`,
`CardDetailDrawer`, `HandCardPreview`). **Известное упрощение**: статусные иконки в
`CreatureSlot` (`STATUS_ICON`: 🛡⚡👁☠🔇) и аватар-плейсхолдеры игроков/бота (🧑/🤖/⚔, задаются
вызывающей страницей через строковый `icon` prop) оставлены как есть — расширение iconset на них
не уложилось в объём этой фазы и не является структурным изменением.

## Sound Hooks (переиспользован Phase 7 `sfx.ts`)

Добавлены cue-типы `card-select`, `rune-trigger`, `track-play`, `resonance-trigger`,
`raido-reveal` (расширение `SfxCue`, синтезированные тона, без внешних сэмплов). Подключены:
`card-select` — при выборе карты в руке (`HandFan`); `rune-trigger` — на `RUNE_ACTIVATED` в
`match-sfx.ts` (приоритет выше `card-play`); `raido-reveal` — при открытии RAIDO-карты в
`CardDetailDrawer`. `track-play`/`resonance-trigger` определены и доступны, но пока не подключены
к отдельному триггеру — `RUNE_ACTIVATED` уже покрывает "что-то резонансное произошло" смысл в
текущей архитектуре (Resonance реализован через условия внутри эффектов рун/карт, отдельного
"Resonance" события в движке нет). Все cue продолжают уважать `sfxVolume`/Low Data Mode как
раньше — изменений в `playSfx()`-гейтинге не было.

## Low Data Mode / Performance

Все новые декоративные loop-анимации (`rune-idle`, `raido-sweep`) добавлены в существующий
`[data-low-data='true']` CSS-гейт в `globals.css`. Новые чисто декоративные слои
(`.bg-noise-layer`, `.card-tilt-layer`) получили `display: none` в Low Data Mode — полностью
убираются, а не просто теряют анимацию. Все новые анимации построены на `transform`/`opacity`/
`box-shadow` (никакого нового `backdrop-filter` или множественных одновременных blur-слоёв).
`prefers-reduced-motion`-блок расширен на все новые keyframes.

## Accessibility

Rarity по-прежнему не кодируется только цветом (форма рамки + текстовый лейбл `RARITY_LABEL`
остаются). Targetable/selected/ready состояния сохраняют текстовые `aria-label`
(`CreatureSlot`/`ConductorPanel` без изменений в этой части). Фокус-кольца (`focus-visible:ring-2`)
не тронуты. Bottom nav получил `aria-current="page"` на активном пункте.

## Тесты

Полный регресс: lint + typecheck + unit-тесты по всем workspace + production build `apps/web` +
`apps/game-server` — все зелёные (см. `docs/progress.md` за точные числа на момент PR).
Существующий Playwright-набор (`apps/web/e2e/tutorial-fpx.spec.ts`) прогнан без изменений в самих
тестах — эта фаза сознательно не меняла ни один `data-tutorial-target`-атрибут и ни один текст,
на который ссылаются существующие Playwright-локаторы.

## Осознанные упрощения

- **Card play animation по типу** реализован не для всех 4 типов в равной глубине: CHARACTER
  (impact-pulse при монтировании через `summonedThisTurn`) и TRACK (существующий reveal+waveform,
  перекрашен) полностью соответствуют спеке; RUNE получил улучшенный idle+trigger pulse, но не
  отдельную "hand→center→settle" анимацию прибытия карточки в зону; EVENT не получил отдельного
  center-flash-dissolve прохода — эти два случая используют только уже существующую generic
  feedback-инфраструктуру (`useCombatFeedback`), а не новую покарточную-типа анимацию, чтобы не
  трогать таймин движка/событийный поток в рамках чисто визуальной фазы.
- **Dying-slot collapse** (`animate-dying-collapse` keyframe добавлен в токены, но не подключён):
  движок убирает погибший юнит из `board` до отрисовки следующего кадра, поэтому корректная
  покадровая collapse-анимация слота потребовала бы задерживать удаление юнита на клиенте
  (доп. локальное состояние поверх уже работающего death-toast механизма) — оставлено как есть
  (короткий row-level toast), чтобы не рисковать регрессией в уже проверенной механике смерти
  юнита ради чисто косметического улучшения.
- **Faction visual identity** — акцент, не полный редизайн: фракции различаются в рамке
  карты/бейдже/deck-select, но НЕ перекрашивают общий UI (сознательно, по явному требованию спеки
  раздела 7).
- **Visual regression snapshots** не создавались (раздел 41 явно опционален) — вместо этого
  Playwright screenshots (раздел 38) сделаны вручную через `page.screenshot()`.
