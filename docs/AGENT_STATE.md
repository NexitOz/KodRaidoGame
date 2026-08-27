# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **BLOCKED — no working transport; the accepted master has never reached this session or the repository**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `2a08ffc4fc744b98ecbce06a3dff4ea0c1cb955e`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-release-transport-blocked.md`
- **Prior handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-firestorage-transport-blocked.md`
- **Branch:** `main`
- **Open blocker:** the accepted `seal-of-the-curse` master has never reached this session or the repository. **The remaining step cannot be performed by Claude Code — the upload must come from whoever holds the master. See "Transport attempt 3" below.**

## Card 01 — COMPLETE END TO END

`acolyte-of-the-white-rune` / «Послушник Белой Руны» is FINAL APPROVED and live in production.

- integration source: `92cc662fb5a43963c934c6c5f0aa4f1d0e8269e9`
- production sync run: `33091769787`
- final source of truth: `11/11`
- `SYNC-11-CARD-ART-PRODUCTION`: **CONSUMED**

No production operation is currently authorized.

## Card 02 — canonical facts

- slug: `seal-of-the-curse`
- name: «Печать Проклятия»
- faction: PURIFICATION
- type: EVENT
- rarity: RARE
- cost: 2
- effect: apply Curse to a chosen enemy; a cursed enemy cannot attack
- Resonance: visual only

## Card 02 — brief and owner decisions

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse reads as **binding/restraint**, not corruption;
- hero object is a rigid white/silver rune clamp locking the hostile weapon hand to the guard/hilt;
- no visible caster required;
- cinematic realistic / semi-realistic premium CCG house style;
- no SHADOW/VEIL corruption palette or spell-blast language.

The owner explicitly accepted generated Candidate 01 visually on 2026-08-27. The accepted image itself must not be regenerated or altered during transport recovery.

## Broken transport evidence — DO NOT USE

Old branch:

`assets/seal-of-the-curse-candidate`

Old candidate commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

That committed WebP is only 27 bytes and is permanently rejected as a transport artifact. Leave it as evidence; do not repair or reuse it.

No visual QA was performed against the broken file.

## Canonical accepted master integrity

Expected exact values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

Any mismatch is **REJECTED / BLOCKED**. Do not repair, re-encode, resize, regenerate, or substitute.

## Transport attempt 2 — firestorage: BLOCKED by egress policy

The accepted master was uploaded by ChatGPT to `https://firestorage.ai/ja/f/UbtC6RJp2_Ok`
(firestorage independently reported 326,508 bytes, `image/webp`, retained through 2026-09-10).

**Claude Code cannot reach that host.** The agent proxy denies it:

```
curl: (56) CONNECT tunnel failed, response 403
host: firestorage.ai:443
detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
```

This is an organization egress-policy denial for this session. The proxy documentation requires such
failures be reported rather than retried or routed around, so no alternate route, mirror or setting
change was attempted.

**Confirmed by a second attempt on owner instruction (2026-08-27 19:47:49Z).** The identical
`connect_rejected` was logged again for `firestorage.ai:443`, eight minutes after the first. Two
rejections on the same host establish a standing denial rather than a transient upstream fault. The
same check confirmed the master had not appeared anywhere else reachable in the meantime: **no
release exists on the repository at all**, no issue or PR carries the asset, no new branch contains
it, and no 326,508-byte blob exists in any ref or on local disk.

**Nothing was downloaded, so this is not another truncation and implies nothing about the artwork.**
No candidate-v2 branch was created, nothing was staged, `/admin/art-review` was untouched, and **no
visual judgement of the artwork has been made.**

Verified there is no usable copy anywhere reachable: `transport/seal-of-the-curse-v2` carries no
artwork (it is just commit `181ba28`), no 326,508-byte blob exists in any ref, and no such file
exists on local disk.

### Reachable hosts — probed, not assumed

Only firestorage is denied. `api.github.com` (200), `raw.githubusercontent.com` (301),
`objects.githubusercontent.com` (404), `github.com` (400) and `codeload.github.com` (400) all
resolve and respond — a real HTTP status means the request reached the host.

### Recommended: GitHub Release asset

Release assets upload as **binary multipart POST** to `uploads.github.com` rather than base64 inside
a JSON body — which is exactly the mechanism that truncated the previous three attempts. So this
route avoids the failure mode by construction, needs no policy change, and its download side is
reachable from here.

1. ChatGPT uploads `seal-of-the-curse.webp` as a release asset on `NexitOz/KodRaidoGame`.
2. It reports the asset id / download URL plus canonical size and SHA-256.
3. Claude Code downloads with `Accept: application/octet-stream`, verifies canonical integrity, and
   proceeds with candidate-v2 exactly as the current task specifies.

Alternatives: allowlist `firestorage.ai` in the environment's network policy, or commit the master
directly with the git CLI from whatever machine holds it.

### Still worth reconciling

The 27-byte fragment's RIFF header declared **313,964** bytes against the canonical **326,508**.
Firestorage's independently reported 326,508 supports the canonical figure, but one `wc -c` +
`sha256sum` on the real local master would settle it before the next attempt — otherwise a correct
file could fail the gate on stale expected values.

## Transport attempt 3 — GitHub Release: CANNOT BE PERFORMED BY CLAUDE CODE

The owner redirected the transport to a GitHub-native draft Release, with Claude Code asked to
upload the master itself. **That cannot be done from this session**, for two independent reasons.

**1. The master does not exist in this environment — decisive.** A full filesystem search finds no
`seal-of-the-curse.webp` anywhere (only the brief markdown) and no file of 326,508 bytes anywhere.
The only Card 02 binaries present are the two truncated fragments. The Release recommendation always
had ChatGPT performing the upload; the receiving agent is only ever the **download** side of that
hop.

**2. This session has no release-write capability — independent.** The GitHub MCP server exposes only
`list_releases`, `get_latest_release` and `get_release_by_tag`, all read-only. There is no
`create_release`, no `upload_release_asset`, and no `gh` CLI.

Blocker 1 stands alone: granting release-write access would not help, because there would still be
nothing to upload.

Per the owner's instruction, **no workaround was invented**. firestorage was not contacted in this
attempt, and `assets/seal-of-the-curse-candidate` was not read, reused or repaired.

### What must happen next — owner / ChatGPT action

The **download** half is confirmed reachable and needs no policy change, so this transport is still
the right design. It needs its upload performed by the party holding the master:

- **Option A — draft Release asset.** ChatGPT or the owner creates a draft release on
  `NexitOz/KodRaidoGame`, uploads `seal-of-the-curse.webp`, and reports the asset id or download URL
  plus the size and SHA-256 measured on that machine. Claude Code then downloads with
  `Accept: application/octet-stream`, runs the integrity gate, and proceeds with candidate-v2.
- **Option B — direct git CLI commit.** From the machine holding the master, commit it to
  `assets/seal-of-the-curse-candidate-v2` and push, verifying
  `git cat-file -s HEAD:art-source/seal-of-the-curse.webp` == `326508` **before** pushing. Claude
  Code then fetches, re-verifies the remote bytes, and runs the visual QA.

## Current task — BLOCKED at Step 1

`docs/CLAUDE_CURRENT_TASK.md` @ `2a08ffc4fc744b98ecbce06a3dff4ea0c1cb955e` stands unchanged and runs
as written **once the master is reachable**. Its Step 1 download is what failed.

Only after integrity and remote re-verification pass, perform real surface QA on:

- raw 2:3 master
- `CardView` 3:4
- `CardDetailDrawer` 4:5
- `HandCardPreview` 7:9
- `/admin/art-review` desktop
- `/admin/art-review` 390px
- 92px thumbnail
- 92px grayscale/value-only

EVENT does not use `CreatureSlot`.

Compare Common Acolyte < Rare Event < Legendary High Warden at 92px and walk every reject/acceptance item in the Card 02 master-art brief.

Final status must be exactly:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**.

No promotion, seed/Prisma/gameplay change, production artwork path, sync/workflow change, Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work is authorized.

## Art transport policy — permanent operational rule

For generated art masters, the user must not be used as a manual file courier.

Preferred pipeline:

1. ChatGPT creates/normalizes the master locally.
2. ChatGPT uploads the exact file to a machine-readable storage relay such as firestorage.ai.
3. Receiving agent downloads to local disk.
4. Receiving agent verifies byte size + SHA-256 + format/decode before git.
5. Receiving agent commits with normal git CLI.
6. Receiving agent re-fetches and re-verifies committed bytes before QA/promotion.

Do not use connected GitHub text/binary content tooling to transport generated master artwork bytes when a file-native relay is available.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — brief complete; accepted master **still not in the repository** (candidate 01 truncated to 27 bytes; firestorage relay blocked by egress policy)
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
