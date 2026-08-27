# Agent Handoff

Task: Art Pack 03 Card 02 — verify and visually review accepted candidate
(`docs/CLAUDE_CURRENT_TASK.md`)
Date: 2026-08-27
Branch: `main` (handoff metadata only)
Candidate branch: `assets/seal-of-the-curse-candidate` @ `6f0e00fca98b7452c4c1f987165cf3157753dccb`
Base: `main` @ `5b91f3e`
PR: none

## FINAL STATUS: REJECTED / BLOCKED

The integrity gate fails catastrophically. The committed candidate is **27 bytes**. The expected size
is **326,508**. Visual QA was not started, as the task requires.

Nothing was repaired, re-encoded, resized, regenerated or substituted. The file was not staged, and
`/admin/art-review` was not touched — there is no image to review.

## Integrity gate results

The mandated pre-push check, run against the committed object:

```
$ git cat-file -s 6f0e00fca98b7452c4c1f987165cf3157753dccb:art-source/seal-of-the-curse.webp
27
```

It must print `326508`.

| Check               | Expected        | Actual                            | Result   |
| ------------------- | --------------- | --------------------------------- | -------- |
| `git cat-file -s`   | 326508          | **27**                            | **FAIL** |
| Byte size           | 326,508         | **27**                            | **FAIL** |
| SHA-256             | `699db6b7…`     | **`9643136c…`**                   | **FAIL** |
| RIFF-declared total | 326,508         | **313,964**                       | **FAIL** |
| declared == actual  | equal           | 313,964 vs 27                     | **FAIL** |
| Decoded dimensions  | 1024 × 1536     | **undeterminable**                | **FAIL** |
| Full decode         | succeeds        | `could not create decoder object` | **FAIL** |
| RIFF / WEBP magic   | `RIFF` / `WEBP` | `RIFF` / `WEBP`                   | PASS     |
| Container FourCC    | `VP8 `          | `VP8 `                            | PASS     |

Seven checks fail. Only the two magic-string checks and the FourCC pass, and they pass for a trivial
reason: those bytes all live in the first 16 bytes of the file, which is the only part that arrived.

## What actually arrived — the entire file

All 27 bytes:

```
52 49 46 46 64 ca 04 00  57 45 42 50 56 50 38 20     RIFF d... WEBPVP8
58 ca 04 00 f0 1c 00 9d  01 2a 00                    X....... .*.
```

That is the RIFF container header, the `VP8 ` chunk header, and the first four bytes of the VP8
keyframe — and then the file simply stops. It ends _inside_ the keyframe header, four bytes before
the width and height fields. There is no image data of any kind: **0.0086% of the declared length
arrived.**

`file(1)` reports it as "Web/P image, VP8 encoding, **0x0**" — the 0×0 is not a real dimension, it is
`file` failing to find dimension bytes that were never transported.

## Two distinct failures, not one

This is worse than the truncations seen on Card 01 and SHADOW Card 04, and the difference matters for
the fix.

**Failure 1 — catastrophic truncation.** 27 of 313,964 declared bytes arrived.

**Failure 2 — the surviving header contradicts the provenance note.** The RIFF header that _did_
arrive declares a total of **313,964 bytes**. The provenance record
(`docs/art-sources/2026-08-27-purification-card-02-master-candidate.md`) states the normalized master
is **326,508 bytes** with a RIFF-declared total of **326,508**. Those cannot both be true of the same
file — they differ by 12,544 bytes.

On Card 01, the surviving header declared _exactly_ the expected size, which independently
corroborated the provenance note and let me say with confidence "the art is fine, only transport
failed." **I cannot say that here.** The header actively contradicts the note, so the recorded
326,508 / `699db6b7…` values do not describe the file whose header reached the repository.

At least one of these must be true:

- the note's size and SHA were measured on a different file than the one uploaded;
- the file was re-encoded between measurement and upload (a second Pillow pass produces a different
  byte size);
- the header bytes came from some other export entirely.

This must be resolved **before** re-transport, otherwise the same expected values will be checked
against a file that was never going to match them.

## The truncation is baked into the commit

Verified so the loss is not misattributed to my fetch:

- `git cat-file -s 52e91958c9b64c816b89674338b634e4de15d6f3` → **27**
- `git cat-file -p <blob> | wc -c` → **27**
- GitHub's API reports blob `52e91958…` as `"size": 27`
- the commit's own diffstat records `art-source/seal-of-the-curse.webp | Bin 0 -> 27 bytes`

The wrong bytes were written when the commit was created.

## The provenance note predicted this exact failure

From the note, verbatim:

> Because the connected API path previously demonstrated unsafe binary truncation during Card 01, no
> unverified binary write is to be treated as a valid candidate.

The note then records: _"The candidate branch and this provenance record were prepared through the
connected GitHub tooling."_ The binary went through the very path the note identifies as unsafe, and
it truncated again — this time far more severely.

**This is the third binary transport failure of this class on the project:**

| Card                                   | Committed size | Outcome      |
| -------------------------------------- | -------------- | ------------ |
| SHADOW Card 04, candidate v1           | 14,999 bytes   | rejected     |
| PURIFICATION Card 01, candidate v1     | 15,042 bytes   | rejected     |
| **PURIFICATION Card 02, candidate 01** | **27 bytes**   | **rejected** |

The two earlier failures clustered at ~15 KB; this one lost essentially everything. So the API/web
upload path does not truncate at a consistent boundary — its output size is not predictable, which
means "it looked about the right size" is never a safe substitute for the byte check.

## Required fix

1. **Do not regenerate the art.** Nothing here indicates the generated image is bad — only that no
   usable bytes reached the repository. Regenerating would discard a candidate the owner already
   accepted visually.
2. **First, re-establish the authoritative file.** On the machine holding the normalized master, run
   `wc -c` and `sha256sum` on the exact file to be uploaded and compare against the note's
   326,508 / `699db6b7…`. If they disagree, the note must be corrected to match the real file before
   anything else — the integrity gate is only meaningful if its expected values describe the file
   that actually exists.
3. **Commit with the git CLI from local disk** — not the connected GitHub tooling, not a web upload,
   not an API create-file call, not a base64 payload. That path has now failed three times.
4. **Verify before pushing:**

   ```sh
   wc -c        art-source/seal-of-the-curse.webp
   sha256sum    art-source/seal-of-the-curse.webp
   git add      art-source/seal-of-the-curse.webp
   git commit -m "art(source): Card 02 master candidate (re-transport)"
   git cat-file -s HEAD:art-source/seal-of-the-curse.webp   # MUST match the real byte size
   ```

   That last command reads the size back out of the object git actually stored, rather than off the
   local file. Run before any of the three failures, it would have caught all of them.

5. **Push to a fresh branch**, e.g. `assets/seal-of-the-curse-candidate-v2`. Leave the broken branch
   in place as evidence; do not force-push over it.
6. Claude Code then re-runs this integrity gate and, on PASS, proceeds to the full surface QA.

## What was NOT done, and why

Everything downstream of the integrity gate was skipped, per the task's explicit stop rule:

- the candidate was **not** staged at `apps/web/public/art-review-candidates/seal-of-the-curse.webp`;
- `seal-of-the-curse` was **not** registered in `/admin/art-review`, so no application code changed
  and no lint/typecheck/test/build run was required;
- none of the eight required surfaces were reviewed — raw master, `CardView` 3:4,
  `CardDetailDrawer` 4:5, `HandCardPreview` 7:9, `/admin/art-review` desktop and 390 px, 92 px
  thumbnail, 92 px grayscale;
- the 92 px hierarchy comparison against Common `acolyte-of-the-white-rune` and Legendary
  `high-warden-of-the-white-rune` was not run;
- the brief's automatic-reject list and final acceptance checklist were not walked.

None of these are possible against a 27-byte header fragment. Registering a review target pointed at
an unusable file would have added a code change with no review value.

**No visual judgement of the artwork has been made.** Every question in the task's "Visual questions"
list — whether the attack reads as physically sealed, whether the clamp is the focal point, whether
the dark arm avoids SHADOW lighting, faction neutrality, anatomy, rune restraint, corruption
language, RARE hierarchy, grayscale separation, crop safety, the y≈260–1280 working safe zone —
remains **unanswered**. This rejection is purely about bytes and implies nothing about the image the
owner accepted.

## Changed files

- `docs/agent-reports/2026-08-27-art-pack-03-card-02-candidate-rejected.md` — this report
- `docs/CLAUDE_CURRENT_TASK.md` — rejection recorded, re-transport instructions added
- `docs/AGENT_STATE.md` — updated last, per protocol rule C

No artwork was committed, altered, repaired or substituted. No candidate branch was merged or
force-pushed. No application code was changed.

## Confirmed untouched

`apps/game-server/prisma/seed.ts`, Prisma schema and migrations, gameplay / balance / card text /
effects / cost / rarity / faction / stats, `apps/web/public/art/cards/`, every card's production
`artworkUrl` and `rightsStatus`, `/admin/art-review` code, Battlefield gameplay and layout,
production sync scripts and workflows, Railway / Vercel / production DB. No workflow was dispatched
and no production connection of any kind was made. Card 03 was not started. The candidate branch was
not merged.

## Recommended next action

Resolve the size discrepancy first (step 2 above), then re-transport via the git CLI to
`assets/seal-of-the-curse-candidate-v2`, confirming
`git cat-file -s HEAD:art-source/seal-of-the-curse.webp` matches the real byte size **before**
pushing. Claude Code resumes the integrity gate and the full surface QA from there.

Worth considering separately: three truncations through the same tooling is a pattern, not bad luck.
Making the git-CLI route the standing rule for every binary — and the `git cat-file -s` read-back a
required step in the provenance note itself — would close this off permanently.
