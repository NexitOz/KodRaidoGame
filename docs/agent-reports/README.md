# Agent reports

Fallback storage for Claude Code handoff reports. The full protocol lives in
[`/CLAUDE.md`](../../CLAUDE.md) under **Agent Handoff Protocol**.

## Where a report belongs

**A Pull Request comment is the preferred location.** If the work has a PR, the report goes there
as a comment headed `## AGENT HANDOFF — FINAL REPORT` — it sits next to the diff it describes, and
a reviewer finds it without knowing to look anywhere else.

**This directory is the fallback, only for substantial work with no PR** — a spike, an
investigation, a config change made directly, anything where there is no PR to comment on.

Do not do both. One report, one canonical location.

## Naming

```
docs/agent-reports/YYYY-MM-DD-<task-slug>.md
```

Date is the completion date. Slug is short, lowercase, hyphenated — e.g.
`2026-08-24-redis-session-spike.md`.

Start from [`TEMPLATE.md`](./TEMPLATE.md).

## Why these exist

Chat transcripts are not durable: they scroll, truncate, and are unreadable to the next agent or
reviewer. These reports are the agent-to-agent handoff record and the way to reconstruct later
_what_ was changed, _why_, and _what was verified_ — long after the session that did the work is
gone.

Keep reports factual and specific: exact SHAs, exact file paths, exact workflow run IDs, and an
honest account of anything that failed or was left undone.

## Not for QA artifacts

Never commit screenshot matrices or other large binaries here. Those belong in GitHub Actions
artifacts (see `.github/workflows/battlefield-visual-qa.yml`); reference them by artifact name and
run URL instead.
