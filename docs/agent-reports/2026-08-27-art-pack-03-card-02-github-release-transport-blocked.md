# Agent Handoff

Task: Art Pack 03 Card 02 — GitHub-native transport (draft Release asset) → candidate-v2 → visual QA
(`docs/CLAUDE_CURRENT_TASK.md` @ `2a08ffc`, redirected by owner instruction to a GitHub Release)
Date: 2026-08-27
Branch: `main` (handoff metadata only)
Base SHA: `5c040f5`
PR: none

## FINAL STATUS: REJECTED / BLOCKED

Blocked before Step 1 could produce any bytes. **No artwork was downloaded, verified, committed or
reviewed, and no visual judgement of the artwork has been made.**

The instruction was to stop rather than improvise if a Release asset could not be created from this
environment. Two independent blockers apply, and the first is decisive on its own.

## Blocker 1 — the master does not exist in this environment (decisive)

The instruction "upload the exact approved master to the release" presupposes that this session holds
`seal-of-the-curse.webp`. **It does not, and never has.**

The earlier recommendation in
`docs/agent-reports/2026-08-27-art-pack-03-card-02-firestorage-transport-blocked.md` assigned the
upload to ChatGPT for exactly this reason — its step 1 reads "ChatGPT uploads
`seal-of-the-curse.webp` as a release asset". The receiving agent was only ever the **download** side
of that hop.

Verified by exhaustive filesystem search:

| Search                                               | Result                                                                                          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| any path matching `*seal-of-the-curse*`              | one hit only — `docs/art-review/seal-of-the-curse-master-art-brief.md` (the brief, not the art) |
| any file of exactly `326508` bytes, whole filesystem | **none**                                                                                        |
| every `.webp` outside `node_modules`                 | Card 01's master (214,378) and prior battlefield/card art only — no Card 02 master              |

The only Card-02-related binaries anywhere are the two truncated fragments from earlier failed
transports (15,042 bytes in scratchpad; 27 bytes on the rejected candidate branch). Both are broken
evidence and were not touched.

**This blocker is not a tooling problem.** Granting release-write access would not resolve it: there
would still be nothing to put in the release.

## Blocker 2 — no release-write capability in this session (independent)

Even to create an empty draft release, this environment has no mechanism:

- The GitHub MCP server exposes exactly three release tools, **all read-only**: `list_releases`,
  `get_latest_release`, `get_release_by_tag`.
- There is **no** `create_release` and **no** `upload_release_asset` tool.
- The session has no `gh` CLI and no `hub` CLI; the environment brief directs all GitHub interaction
  through the MCP server.

So the draft-release container could not be created here regardless of whether the bytes existed.

## What was NOT done

- No release was created (could not be);
- nothing was uploaded (nothing to upload);
- no asset was downloaded or integrity-checked;
- `assets/seal-of-the-curse-candidate-v2` was **not** created — there was nothing to commit;
- nothing was staged at `apps/web/public/art-review-candidates/seal-of-the-curse.webp`;
- `seal-of-the-curse` was **not** registered in `/admin/art-review`; no application code changed, so
  no lint/typecheck/test/build run was required;
- none of the eight required surfaces were reviewed; the 92 px hierarchy comparison against Common
  `acolyte-of-the-white-rune` and Legendary `high-warden-of-the-white-rune` was not run;
- the brief's automatic-reject list and acceptance checklist were not walked.

Every visual gate in the task remains **unanswered** — whether the attack reads as physically sealed,
focal hierarchy, dark-by-material vs SHADOW lighting, faction neutrality, geometry coherence, clamp
solidity, forbidden corruption language, RARE hierarchy, grayscale separation, crop safety, and the
y≈260–1280 working safe zone.

## Constraints honoured

- **firestorage was not used** and not contacted in this task.
- **`assets/seal-of-the-curse-candidate` was not used**, not read as a source, not repaired, not
  reused. It remains untouched as evidence.
- No workaround was invented. No alternate host, mirror, tunnel, proxy change or TLS relaxation was
  attempted.
- No artwork was substituted, regenerated, re-encoded or repaired.

## The half of the hop that does work

The download side is confirmed reachable and needs no policy change, so this transport is still the
right answer — it just needs its upload performed by whoever holds the master.

`api.github.com` (200), `objects.githubusercontent.com` (404 — host fine),
`raw.githubusercontent.com` (301), `github.com` (400) and `codeload.github.com` (400) all resolve and
respond. Only `firestorage.ai` is denied at the proxy.

Release assets upload as **binary multipart POST** to `uploads.github.com` rather than base64 inside
a JSON body — which is the mechanism that truncated the three previous attempts — so the route
avoids that failure mode by construction.

## Recommended next action

**The upload must be performed by the party that holds the master** (ChatGPT, or the owner from the
machine where the accepted image lives). Either of these unblocks the task:

### Option A — draft Release asset

1. ChatGPT or the owner creates a draft release on `NexitOz/KodRaidoGame` and uploads
   `seal-of-the-curse.webp` as an asset.
2. Reports the asset id or download URL, plus the size and SHA-256 as measured on that machine.
3. This session downloads it with `Accept: application/octet-stream`, runs the full integrity gate,
   and proceeds with candidate-v2 exactly as `docs/CLAUDE_CURRENT_TASK.md` specifies.

### Option B — direct git CLI commit (has always worked on this project)

From the machine holding the master, commit it to `assets/seal-of-the-curse-candidate-v2` and push,
checking **before** the push that:

```
git cat-file -s HEAD:art-source/seal-of-the-curse.webp   # must print 326508
```

This session then fetches the branch, re-verifies the bytes from the remote, and runs the visual QA.

### Either way — settle the size discrepancy first

The 27-byte fragment's surviving RIFF header declared **313,964** bytes against the canonical
**326,508**. Firestorage independently reported 326,508 for the uploaded object, which supports the
canonical figure — but a single `wc -c` and `sha256sum` on the real local master would settle it. If
the canonical values are stale, a perfectly good file would fail the integrity gate.

## Changed files

- `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-release-transport-blocked.md` — this report
- `docs/CLAUDE_CURRENT_TASK.md` — blocker banner updated
- `docs/AGENT_STATE.md` — updated last, per protocol rule C

No artwork was committed, altered, repaired or substituted. No branch was created, merged or
force-pushed. No application code was changed.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`, Prisma schema and migrations, gameplay / balance / card data,
`apps/web/public/art/cards/`, every card's production `artworkUrl` and `rightsStatus`,
`/admin/art-review` code, Battlefield gameplay and layout, production sync scripts and workflows,
Railway / Vercel / production DB. No workflow was dispatched. Card 03 was not started. Neither
candidate branch was merged or modified.
