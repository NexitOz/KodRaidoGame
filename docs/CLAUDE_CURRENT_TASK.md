# CURRENT TASK — Art Pack 04 Card 01 candidate transport + nine-surface QA

## Status

`child-of-the-spring-light` / «Дитя Весеннего Света» has an owner-approved brief and an owner-approved generated master. This task authorizes **candidate intake and QA only**.

Read first:

- `CLAUDE.md`
- `docs/AGENT_STATE.md`
- `docs/art-review/child-of-the-spring-light-master-art-brief.md`
- `docs/art-pack-04.md`
- `docs/agent-reports/2026-09-02-art-pack-04-card-01-owner-master-approval.md`
- `docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md` as the proven transport/QA pattern

## Exact candidate source

Generation ID: `615e529f-173b-4c42-826b-814da3de8b96`.

Approved original PNG: `1024×1536`, RGB, `2902102` bytes, SHA-256 `b67d2e520ed7b967e724e47f6de52809ea44da9efaca3d48a33a3265da759635`, full decode PASS.

Exact WebP for candidate transport:

- file `child-of-the-spring-light.webp`
- `1024×1536`
- `596976` bytes
- SHA-256 `bc2e5abcfcedacfad6b98816229c0bb1205cb71d7177f09e88568442ecaaf9c2`
- expected Git blob `a52fb443ff296c4411c7dc0e640be98befbc12bc`
- RIFF total `596976`
- FourCC `VP8 `
- full decode PASS

Machine source: `https://firestorage.ai/ja/f/aZIlHM-TkPI7`, share UUID `aZIlHM-TkPI7`, file id `fl_f0555165aaff4598bed07f2e0f44c487`, expires `2026-09-16T21:44:37.912662Z`.

The owner must not be used as a manual file courier.

## Required work

1. Confirm fresh `main` and re-read all canonical sources above.
2. Use the established GitHub-hosted runner transport pattern. Temporary branch: `transport/art-pack-04-card01-github-actions`. It may contain the temporary `contents: write` transport workflow and **must never merge into `main`**.
3. Fetch the WebP through a machine-readable Firestorage route, not the browser HTML page.
4. Before committing, hard-fail unless all exact gates pass: byte size, SHA-256, expected Git blob SHA, RIFF total, FourCC, dimensions and full decode.
5. Create candidate branch `assets/child-of-the-spring-light-candidate-v1` from the intended fresh `main` base.
6. Commit the exact binary as `art-source/child-of-the-spring-light.webp`.
7. Push, fetch remote back and verify the remote tree points to blob `a52fb443ff296c4411c7dc0e640be98befbc12bc`; re-check the full tuple remotely.
8. Mirror the Card 04 candidate-review pattern: stage a byte-identical ignored runtime copy at `apps/web/public/art-review-candidates/child-of-the-spring-light.webp` and add only the minimum candidate row in `apps/web/src/app/admin/art-review/page.tsx` on the candidate branch.
9. Do **not** use `apps/web/public/art/cards/child-of-the-spring-light.webp`; do not edit `seed.ts` or `rightsStatus`.
10. Run and capture the full nine-surface CHARACTER QA:
   - raw 2:3;
   - CardView 3:4;
   - CardDetailDrawer 4:5;
   - HandCardPreview 7:9;
   - CreatureSlot 3:4;
   - admin desktop;
   - admin 390 px;
   - 92 px thumbnail;
   - 92 px hierarchy beside `matriarch-of-the-spring-light`.
11. Measure **every objective acceptance gate in canonical brief §16** exactly as specified there. Explicitly report crop geometry, edge density, warmth R−B, saturation, mean luminance, grayscale spread, metallic-gold coverage, thumbnail read, rarity hierarchy, faction differentiation, reserved-motif compliance and all safety constraints in the brief.
12. Owner visual approval before QA is **not** a waiver. Report every measured deviation honestly.
13. Do not regenerate, retouch, crop, recolor, re-encode or automatically repair the master because of a QA miss.
14. Write `docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md` and update `docs/art-pack-04.md` with the candidate branch/commit, exact tuple and QA result.
15. Update `docs/AGENT_STATE.md` **last**, fetch it back from GitHub, verify, then stop.

## Decision rule

- All required gates pass: **READY FOR POST-QA OWNER APPROVAL — ART PACK 04 CARD 01**.
- Candidate is intact but one or more brief gates miss: **CANDIDATE QA COMPLETE — OWNER CAVEAT DECISION REQUIRED** and list every miss. No integration and no automatic regeneration.
- Binary integrity, transport or a hard safety gate fails: **REJECTED / BLOCKED — NO INTEGRATION**.

## Hard exclusions

No production asset path, seed, schema, migration, gameplay or balance changes. No integration PR. No production-sync preparation or dispatch. No Railway, production DB or Vercel. Do not start Card 02. Do not reuse `SYNC-13-CARD-ART-PRODUCTION` or `SYNC-14-CARD-ART-PRODUCTION`; both are consumed.
