# AGENT STATE

Canonical cross-agent handoff pointer for `NexitOz/KodRaidoGame`.

## Bridge status

- **Cross-agent bridge:** ACTIVE
- **Permanent rules:** `CLAUDE.md`
- **Protocol:** read this file first, then `docs/CLAUDE_CURRENT_TASK.md`; update this file last after each completed task and verify it from GitHub

## Current project state

- **Phase:** Art Pack 03 — PURIFICATION
- **Status:** Card 02 **BLOCKED — WeTransfer denied by egress policy. Root cause now identified: the policy is a GitHub-only allowlist, so NO third-party relay can work. Fix is a GitHub web UI upload.**
- **Current target:** `seal-of-the-curse` / «Печать Проклятия»
- **Current task:** `docs/CLAUDE_CURRENT_TASK.md`
- **Current task commit:** `82a9352c0a4f98c99b75b8f184ab45c2e8253286`
- **Latest handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-wetransfer-transport-blocked.md`
- **Prior handoff:** `docs/agent-reports/2026-08-27-art-pack-03-card-02-github-release-transport-blocked.md`
- **Branch:** `main`
- **Open blocker:** the accepted master has still never reached the repository. **Owner action required — upload it via the GitHub web UI, exactly as Card 01 was uploaded. See "Transport attempt 4" below.**

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

Master-art brief:

`docs/art-review/seal-of-the-curse-master-art-brief.md`

Locked concept:

- Curse = binding/restraint, not corruption
- rigid white/silver rune clamp locks hostile weapon hand to guard/hilt
- no visible caster
- cinematic realistic / semi-realistic premium CCG
- no SHADOW/VEIL corruption palette or spell-blast language

The owner accepted the generated image visually on 2026-08-27. Do not regenerate or alter it during transport recovery.

## Canonical accepted master integrity

Exact required values:

- dimensions: `1024 × 1536`
- byte size: `326508`
- RIFF total: `326508`
- FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

ChatGPT re-verified the local master after transport work:

- local size: `326508`
- local SHA-256: exact canonical hash above
- RIFF total: `326508`
- FourCC: `VP8 `
- dimensions: `1024 × 1536`
- full decode: PASS

Google Drive raw upload also stored the file as `image/webp` with provider-reported size exactly `326508` bytes, confirming byte-preserving upload behavior.

## Transport history

### Broken evidence — DO NOT USE

Old branch:

`assets/seal-of-the-curse-candidate`

Old commit:

`6f0e00fca98b7452c4c1f987165cf3157753dccb`

That committed file is only 27 bytes and remains rejected evidence.

### firestorage route

The exact master was uploaded successfully to firestorage, but Claude Code cannot reach `firestorage.ai:443` because of session egress policy (`CONNECT 403`). Do not retry that route.

### GitHub Release route

Not usable from current agent tooling because neither side had release-asset write capability plus the master in the same environment.

### Dropbox route

Rejected after a control test showed long text payload truncation. Do not use Dropbox text-chunk transport for master art.

### Google Drive route

Raw binary upload succeeded and provider metadata reports exact `326508` bytes, but the current personal-Gmail connector cannot create an anonymous `anyone with link` permission for Claude Code.

### WeTransfer route — DENIED (transport attempt 4)

`https://we.tl/t-vzhG3rXsXM3TQ7Jr` could not be reached. Both `we.tl:443` and `wetransfer.com:443`
were rejected at CONNECT with 403. Do not retry this route.

## Transport attempt 4 — ROOT CAUSE FOUND: the egress policy is a GitHub-only allowlist

The four relay failures are not four separate problems. They are one problem, measured directly:

**Denied:** `we.tl`, `wetransfer.com`, `firestorage.ai`, `dropbox.com`, `drive.google.com`,
`transfer.sh`, `file.io`, `0x0.st`, `gist.githubusercontent.com`.

**Reachable:** `github.com`, `api.github.com`, `raw.githubusercontent.com`,
`objects.githubusercontent.com`, `codeload.github.com`, `uploads.github.com` (plus the npm / PyPI /
crates / Go registries, which bypass the proxy entirely).

Every general-purpose file-sharing host is blocked; only GitHub infrastructure is allowed.
**Therefore no third-party relay will ever work from a Claude Code session on this environment, and
a fifth relay would fail for the same reason as the first four.**

### THE FIX — the route that already worked in this repository

The master does not need a relay. It needs to be **in the GitHub repository**, because GitHub is
reachable. Card 01's master arrived intact exactly that way:

```
commit 69e176e41bf2263a7185bd17e4deb5ce822e6f83
  author    NexitOz <85886242+NexitOz@users.noreply.github.com>
  committer GitHub <noreply@github.com>
  message   "Add files via upload"

git cat-file -s 69e176e:art-source/acolyte-of-the-white-rune.webp  ->  214378   (exact, first try)
```

`committer GitHub <noreply@github.com>` + `Add files via upload` is the **GitHub web UI
drag-and-drop**. It sends the file as multipart binary, never base64 inside JSON — which is the exact
mechanism that truncated the Contents-API attempts to 14,999 / 15,042 / 27 bytes.

Owner action, roughly thirty seconds:

1. Open `https://github.com/NexitOz/KodRaidoGame` signed in.
2. **Add file → Upload files**, selecting "Create a new branch for this commit", named
   `assets/seal-of-the-curse-candidate-v2`.
3. Drop in `seal-of-the-curse.webp` at path `art-source/seal-of-the-curse.webp`.
4. Commit, then tell Claude Code the branch exists.

Equally byte-exact: commit and push with a git CLI from any machine holding the master, verifying
`git cat-file -s HEAD:art-source/seal-of-the-curse.webp` == `326508` **before** pushing.

Claude Code then fetches the branch, runs the full canonical integrity gate, and — only on a complete
PASS — performs the visual QA.

## Current task

Execute `docs/CLAUDE_CURRENT_TASK.md` @ `82a9352c0a4f98c99b75b8f184ab45c2e8253286`.

Required sequence:

**Step 1 is blocked and its transport must change** — WeTransfer is denied, and per the root-cause
finding above no third-party relay can work. Steps 3–5 collapse accordingly: once the owner uploads
the file to `assets/seal-of-the-curse-candidate-v2` via the GitHub web UI, the branch already exists
and Claude Code verifies the fetched bytes instead of creating and pushing them.

1. ~~Download exact WebP from WeTransfer.~~ **BLOCKED** — obtain the branch via GitHub web UI upload.
2. Verify all canonical integrity values against the fetched branch bytes.
3. ~~Create the branch~~ — created by the owner's upload; verify it came from fresh `main`.
4. ~~Commit exact binary with normal git CLI.~~ — done by the upload.
5. Verify remote-fetched bytes (`git cat-file -s` == `326508`, SHA-256 == canonical).
6. Run full real visual QA on raw 2:3, CardView 3:4, CardDetailDrawer 4:5, HandCardPreview 7:9, admin desktop, 390px, 92px, and grayscale.
7. EVENT does not use `CreatureSlot`.
8. Walk the full Card 02 master-art brief including y≈260–1280 safe zone and Common < Rare < Legendary comparison.
9. Write durable handoff.
10. Update this file last and fetch it back to verify.

Final status must be exactly:

- **READY FOR OWNER VISUAL APPROVAL**, or
- **REJECTED / BLOCKED**

No promotion, seed/Prisma/gameplay change, production artwork path, sync/workflow change, Railway/Vercel/production DB access, workflow dispatch, candidate merge, or Card 03 work is authorized.

## Art transport policy — REVISED, replaces the storage-relay rule

The previous policy ("upload the exact file to a machine-readable storage relay such as
firestorage.ai") is **withdrawn**. It cannot work: this environment's egress policy allows GitHub
infrastructure only, so every such relay is denied at CONNECT. Following that rule cost four round
trips.

**Standing rule for all future master art, Cards 03 and 04 included:**

1. The party holding the master puts it **into the GitHub repository** on a candidate branch —
   GitHub web UI **Add file → Upload files**, or a git CLI push. Both send binary, not base64.
2. Never transport master artwork through the GitHub Contents API, base64-in-JSON tooling, chat
   attachments, or text chunking. Every one of those has truncated a master on this project
   (14,999 / 15,042 / 27 bytes).
3. Claude Code fetches the branch and verifies size + SHA-256 + RIFF total + FourCC + dimensions +
   full decode **before** any staging, QA or promotion.
4. `git cat-file -s HEAD:<path>` is checked before any push. It has caught three truncations.

## Art Pack 03 remaining cards

- Card 01 `acolyte-of-the-white-rune` — COMPLETE END TO END, live in production
- Card 02 `seal-of-the-curse` — brief complete; master **still not in the repository**; awaiting GitHub web UI upload to `assets/seal-of-the-curse-candidate-v2`
- Card 03 `warden-of-the-barrier` — not started
- Card 04 `rune-of-curse-breaking` — not started
