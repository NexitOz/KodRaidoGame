# Agent Handoff

Task: Art Pack 03 Card 01 — verify and visually review the candidate (`docs/CLAUDE_CURRENT_TASK.md`)
Date: 2026-08-27
Branch: `main` (handoff metadata only)
Candidate branch: `assets/acolyte-of-the-white-rune-candidate` @ `1652efaa1bc47771a08246bb9b498d9b737b7092`
Base: `main` @ `00638f9d57eb1154b6bfabd1d357d40f6e4baf1e`
PR: none
Status: **CANDIDATE REJECTED at step 1 — the committed file is truncated.** The visual review was not
performed. No promotion, no seed change, no sync, no merge, no `/admin/art-review` change.

## Verdict

Step 1 of the task is "independently fetch and verify the committed candidate bytes." That check
**fails**. The blob committed to the candidate branch is **15,042 bytes while its own RIFF header
declares 214,378** — 7.0% of the file arrived. It does not decode.

Per the standing rule, a mismatch means the candidate is rejected, not repaired. Nothing was
substituted, reconstructed, re-encoded or patched.

The independent verification was worth running: the generator's handoff report states the committed
file is 214,378 bytes with SHA-256 `cb766584…`. Those are the values of its **local** file. They are
not the values of what actually landed in git.

## The four integrity checks

| Check                                | Expected           | Actual                              | Result   |
| ------------------------------------ | ------------------ | ----------------------------------- | -------- |
| Container fourcc (bytes 12–16)       | `VP8 `             | `VP8 `                              | PASS     |
| Decoded dimensions                   | 1024 × 1536        | 1024 × 1536                         | PASS     |
| **RIFF-declared total == byte size** | 214,378 == 214,378 | **declared 214,378, actual 15,042** | **FAIL** |
| **SHA-256**                          | `cb766584…`        | `7822d32a…`                         | **FAIL** |

A fifth, independent check — full decode — also fails:
`OSError: could not create decoder object`.

Note that `file(1)` happily reports "RIFF (little-endian) data, Web/P image, VP8 encoding,
1024x1536". The header is intact, so header-only inspection passes a file that is unusable. That is
precisely why the declared-size and SHA checks exist.

## The truncation is baked into the commit

Checked deliberately, so the loss is not misattributed to the generator's export or to my fetch:

- `git cat-file -s 0f1859452cbde2b5262244c38b1114992a9d1269` → **15042**
- `git cat-file -p <blob> | wc -c` → **15042**
- GitHub's API reports blob `0f18594…` as `"size": 15042`
- the commit's own diffstat records `art-source/acolyte-of-the-white-rune.webp | Bin 0 -> 15042 bytes`

The wrong bytes were written when the commit was created. Nothing downstream — fetch, checkout, my
handling — could have caused it.

## The source note is honest, and the art itself is fine

`docs/art-sources/2026-08-27-purification-card-01-master-prompt.md` records byte size `214378`,
RIFF-declared total `214378`, SHA-256 `cb766584…`.

The surviving RIFF header in the committed file declares **exactly 214,378**. A truncated file keeps
its original header, so this independently corroborates that the export really was 214,378 bytes and
that the source note's values were read off a real, complete file.

**Generation succeeded. Only the transport failed.** The correct master exists on the generator's
machine. It does not need regenerating — it needs re-transporting.

## This is the second ~15 KB truncation on this project

| Card                                 | Committed size | Header                  | Outcome  |
| ------------------------------------ | -------------- | ----------------------- | -------- |
| SHADOW Card 04, candidate v1         | 14,999 bytes   | no magic at any offset  | rejected |
| PURIFICATION Card 01, this candidate | 15,042 bytes   | valid, declares 214,378 | rejected |

Two independent uploads landing within 43 bytes of each other at ~15 KB is not random corruption. It
points at a repeatable size cap in whatever path writes the blob. Card 04 was recovered by
re-uploading through a different path (`…-candidate-v2`), which is why the fix below changes the
route rather than retrying the same one.

## Recommended fix, in order

1. **Do not regenerate the art.** Only the bytes in git are wrong.
2. **Commit the file with the git CLI from local disk** — not a web-UI upload, not an API
   create-file call, not a base64 payload. Those are the routes that have truncated at ~15 KB twice.
3. **Verify before pushing, on the machine holding the real file:**

   ```sh
   sha256sum art-source/acolyte-of-the-white-rune.webp   # expect cb766584…
   git add art-source/acolyte-of-the-white-rune.webp
   git commit -m "art(source): Card 01 master candidate (re-transport)"
   git cat-file -s HEAD:art-source/acolyte-of-the-white-rune.webp   # MUST print 214378
   ```

   That last command is the whole safeguard — it reads the size back out of the object git actually
   stored, rather than off the local file. Run before either truncation, it would have caught both.

4. Push to a **fresh branch** `assets/acolyte-of-the-white-rune-candidate-v2`, mirroring the Card 04
   recovery. Leave the broken branch in place as evidence; do not force-push over it.
5. Claude Code re-runs verification and, on PASS, continues to the surface review.

## What was NOT done, and why

Steps 2–6 of the task — registering `acolyte-of-the-white-rune` in `/admin/art-review`, staging the
candidate at `apps/web/public/art-review-candidates/`, reviewing `CardView` 3:4,
`CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `CreatureSlot`, desktop `/admin/art-review` and
390 px mobile, and walking §15 — were **not** performed.

They cannot be. There is no decodable image to render; every surface would show a broken-image
placeholder. Editing `/admin/art-review` to point at an unusable file would add a code change with
no review value, so no application code was touched.

**No visual judgement of the artwork has been made.** Whether the art satisfies the brief — light
armor, three-quarter framing, gold budget, crop safety, thumbnail legibility — remains **unknown and
unassessed**. It is not implied by this rejection, which is purely about bytes.

## Note on generation provenance, carried forward

The generator's report flags honestly that the refinement prompt used was not a byte-for-byte copy
of §13/§14. That does not change this rejection, but it does mean the §15 checklist must be walked
strictly against the real file when a valid candidate arrives, rather than assuming compliance from
the prompt text. Recorded here so it is not lost when the v2 candidate is reviewed.

## Working-tree note

The session container was re-provisioned partway through this task: the local checkout came back on
`claude/execute-specification-tasks-jytvjm` at an old commit with no reflog of this session's work.
No commits were lost — everything had already been pushed and was verified present on `origin/main`.
The tree was reset to `origin/main` before continuing, and `origin/main` had meanwhile advanced to
`00638f9`, so the task and state files were re-read fresh before acting.

## Changed files

- `docs/agent-reports/2026-08-27-art-pack-03-card-01-candidate-rejected.md` — this report
- `docs/CLAUDE_CURRENT_TASK.md` — rejection recorded, re-transport instructions added
- `docs/AGENT_STATE.md` — updated last, per protocol rule C

No artwork was committed, altered, repaired or substituted. No candidate branch was merged or
force-pushed. No application code was changed.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`, Prisma schema and migrations, gameplay/balance/card
text/effects/rarity/cost/stats/faction, `artworkUrl` and `rightsStatus` for every card, all files
under `apps/web/public/art/cards/`, `/admin/art-review` code, Battlefield UI,
`apps/game-server/scripts/sync-production-card-art.ts`,
`.github/workflows/production-card-art-sync.yml`, Railway/Vercel configuration, the production
database, and all Art Pack 01 and Art Pack 02 approved assets.

## Recommended next action

Re-transport the existing 214,378-byte master to
`assets/acolyte-of-the-white-rune-candidate-v2` via the git CLI, confirming
`git cat-file -s HEAD:art-source/acolyte-of-the-white-rune.webp` prints `214378` **before** pushing.
Claude Code resumes verification and the visual review from there.
