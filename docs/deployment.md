# Деплой: живая ссылка на визуал

Цель — получить публичный URL, на котором видно реальный интерфейс «Код Райдо: Резонанс»:
логин, коллекцию, конструктор колод.

## Архитектура

Один бэкенд, один (или два) фронтенда:

```
Railway: game-server (API) + worker + Postgres + Redis
              ▲
              │  NEXT_PUBLIC_API_URL (https://.../api)
      ┌───────┴────────┐
      │                 │
  Vercel            Replit
  apps/web          apps/web
  (Next.js)         (Next.js)
```

**Почему бэкенд не дублируется на Replit:** `game-server` требует PostgreSQL и Redis как
постоянные сервисы. Railway даёт их одной кнопкой ("+ New → Database"). Гонять то же самое
внутри Replit менее надёжно, а два независимых бэкенда с разными базами данных означают два
разных состояния коллекции/аккаунтов — плохой UX. Поэтому оба фронтенда (если разворачиваете
оба) указывают на один и тот же Railway-бэкенд через `NEXT_PUBLIC_API_URL`.

Если нужен только один фронтенд — разворачивайте либо Vercel, либо Replit, шаг с бэкендом
одинаковый в обоих случаях.

---

## Шаг 1. Бэкенд на Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → выбрать
   `NexitOz/KodRaidoGame`.
2. Railway создаст один сервис из репозитория — переименуйте его в `game-server` и в
   **Settings → Build**:
   - **Builder**: Dockerfile
   - **Dockerfile Path**: `infra/docker/game-server.Dockerfile`
   - **Root Directory**: `/` (оставить корень репозитория — Dockerfile сам берёт контекст сборки)
3. **+ New → Database → Add PostgreSQL** и **+ New → Database → Add Redis** в тот же проект.
4. В сервисе `game-server` → **Variables** добавьте:

   | Переменная          | Значение                                                                                                    |
   | ------------------- | ----------------------------------------------------------------------------------------------------------- |
   | `DATABASE_URL`      | `${{Postgres.DATABASE_URL}}` (Railway подставит автоматически, начните печатать `${{` — появится подсказка) |
   | `REDIS_URL`         | `${{Redis.REDIS_URL}}`                                                                                      |
   | `JWT_ACCESS_SECRET` | сгенерируйте случайную строку (например `openssl rand -hex 32`)                                             |
   | `WEB_ORIGIN`        | пока `http://localhost:3000` — вернётесь и добавите сюда URL с Vercel/Replit через запятую после шага 2     |
   | `NODE_ENV`          | `production`                                                                                                |
   | `PORT`              | Railway передаёт `PORT` автоматически, отдельно можно не задавать                                           |
   | `ADMIN_API_KEY`     | случайная строка — секрет для `POST /api/admin/metrics/import` (заголовок `x-admin-key`)                    |

5. Deploy. При первом старте контейнер сам выполняет `prisma migrate deploy` (миграции создают
   таблицы) — ничего вручную запускать не нужно.
6. Засеять стартовый контент (40 канонических карт Content Pack 01 + 23 архивных legacy-карты,
   demo-аккаунт, 6 стартовых колод) — один раз через Railway CLI или встроенный в дашборде **Shell**:
   ```bash
   npm run seed -w apps/game-server
   ```
7. Скопируйте публичный домен сервиса (Settings → Networking → **Generate Domain**), например
   `https://game-server-production-xxxx.up.railway.app`. Это и есть бэкенд-URL — API будет по
   адресу `<этот домен>/api`.
8. Добавьте ещё один сервис `worker` из того же репозитория с Dockerfile Path
   `infra/docker/worker.Dockerfile` и переменными `REDIS_URL` (тот же, что у `game-server`) и
   `DATABASE_URL` (тот же Postgres) — с Phase 5 он реально пересчитывает Resonance-очки по
   `metric_snapshots` и пишет `resonance_snapshots`, без него импорт метрик через
   `/api/admin/metrics/import` просто копится в очереди и никогда не применяется.

---

## Шаг 2. Фронтенд на Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → импортировать
   `NexitOz/KodRaidoGame`.
2. На экране настройки **не меняйте Root Directory** (оставьте корень репозитория) — в репе уже
   лежит `vercel.json`, который сам указывает Vercel собрать сначала пакеты (`shared`,
   `game-engine`, `ui`), а затем `apps/web`, и откуда брать `.next`.
3. **Environment Variables** → добавьте:

   | Переменная            | Значение                            |
   | --------------------- | ----------------------------------- |
   | `NEXT_PUBLIC_API_URL` | `https://<ваш-домен-с-railway>/api` |

4. **Deploy**. Через пару минут Vercel даст ссылку вида `https://kod-raido-game.vercel.app`.
5. Вернитесь в Railway → `game-server` → `WEB_ORIGIN` и добавьте этот адрес через запятую:
   ```
   WEB_ORIGIN=http://localhost:3000,https://kod-raido-game.vercel.app
   ```
   Без этого шага браузер будет блокировать запросы с фронтенда на бэкенд (CORS) и логин не
   сработает — это единственный шаг, который легко забыть.

---

## Шаг 3 (опционально). Фронтенд на Replit

1. [replit.com](https://replit.com) → **Create App** (или **Import from GitHub**) → указать
   `NexitOz/KodRaidoGame`. В репозитории уже лежит `.replit` с командами сборки/запуска для
   `apps/web`.
2. **Secrets** (значок замка) → добавить:

   | Секрет                | Значение                                   |
   | --------------------- | ------------------------------------------ |
   | `NEXT_PUBLIC_API_URL` | тот же `https://<ваш-домен-с-railway>/api` |

3. Нажать **Deploy** (Autoscale). Replit даст свой домен вида `https://kod-raido-game.<user>.repl.co`
   или `*.replit.app`.
4. Добавить и этот домен в `WEB_ORIGIN` на Railway через запятую (как в шаге 2.5).

---

## Проверка

Откройте фронтенд-URL → `/login` → войдите демо-аккаунтом `demo@kodraido.io` / `demo12345` →
должна открыться `/collection` с 40 канонических карточек (Content Pack 01 — см.
`docs/content-pack-01.md`, legacy-карты архивированы и не видны игроку) и `/decks` с 6 готовыми
стартовыми колодами (`Shadow Aggro`, `Bond Sustain`, `Mystery Control`, `Cosmic Ramp`, `Veil Tempo`,
`Purification Control`, все 30/30).

## Частые проблемы

- **Коллекция/логин не грузятся, в консоли браузера ошибка CORS** — в `WEB_ORIGIN` на Railway
  нет домена фронтенда. Добавьте его через запятую и передеплойте `game-server`.
- **Логин "успешен", но при обновлении страницы сессия слетает** — refresh-cookie не долетает
  между доменами. Убедитесь, что `NODE_ENV=production` выставлен на Railway (это включает
  `SameSite=None; Secure` для cookie — без этого браузер отбрасывает cookie между разными
  доменами) и что фронтенд открыт по `https://`, не `http://`.
- **Карточки/колоды пустые сразу после первого деплоя** — сид ещё не запускали, см. шаг 1.6.
- **Vercel build падает на `Cannot find module '@kod-raido/shared'`** — обычно значит Root
  Directory был вручную выставлен на `apps/web` в настройках проекта; верните его в корень
  репозитория, чтобы работал `vercel.json`.
