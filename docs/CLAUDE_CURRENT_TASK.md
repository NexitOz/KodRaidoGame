# CURRENT TASK: Art Pack 04 Card 01 transport retry + nine-surface QA

## Status

`child-of-the-spring-light` / «Дитя Весеннего Света» has an owner-approved brief and owner-approved generated visual. The first transport attempt was correctly blocked because the recorded Firestorage share was invalid. A fresh active share now exists and the byte tuple has been independently re-verified from the approved runtime files.

This task authorizes candidate transport retry and QA only.

Read first:

- `CLAUDE.md`
- `docs/AGENT_STATE.md`
- `docs/agent-reports/2026-09-02-art-pack-04-card-01-transport-correction.md`  ← canonical byte/source correction
- `docs/art-review/child-of-the-spring-light-master-art-brief.md`
- `docs/art-pack-04.md`
- `docs/agent-reports/2026-09-02-art-pack-04-card-01-owner-master-approval.md`
- `docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md` for the blocked first attempt
- `docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md` as the proven transport/QA pattern

If any older document conflicts with the correction report, the correction report wins for byte digests and Firestorage identity.

## Canonical source

Generation ID: `615e529f-173b-4c42-826b-814da3de8b96`.

Approved PNG:

- `1024 × 1536`, RGB
- `2902102` bytes
- SHA-256 `b67e65b3d6cfc944002a863ded275ca8d5cb6cee2b8f4de3be30338c8de7b3c9`
- full decode PASS

Exact candidate WebP:

- file `child-of-the-spring-light.webp`
- `1024 × 1536`
- `596976` bytes
- SHA-256 `bc2de762075121604d24756478e1d89a9d4e176207a3d8e45a8622b90893eca3`
- expected Git blob `a52de8f99b5d775e6c85c9db7e139a09196bdd7c`
- RIFF total `596976`
- FourCC `VP8 `
- full decode PASS

Fresh Firestorage source:

- share URL `https://firestorage.ai/ja/f/1CULOcsXBz8s`
- share ID `1CULOcsXBz8s`
- file id `01a05f186bd77166bf4f998d657b94c2`
- public id `A9mj0NshF09Yuhiv`
- provider status `active`
- expires `2026-09-15T22:30:31.126992Z`

Do not use the old share `aZIlHM-TkPI7`, old WebP digest beginning `bc2e5abc`, old Git blob beginning `a52fb443`, or old PNG digest beginning `b67d2e52`.

## Existing branches

- candidate branch `assets/child-of-the-spring-light-candidate-v1` currently points to `730efda9b615d2f9a22079dfb09df3131a413ea1` and contains no artwork
- transport branch `transport/art-pack-04-card01-github-actions` currently points to `73c6b96ea457c94db863cf8628b2591e3bbc87c2` and must never merge into `main`

## Required work

1. Confirm fresh `main` and re-read the canonical sources.
2. Update only the temporary transport workflow constants needed to use share `1CULOcsXBz8s` and the corrected exact tuple above. Keep every existing integrity gate.
3. Push the transport branch and require the runner to prove: provider metadata, byte size, SHA-256, Git blob SHA, RIFF total, FourCC, dimensions and full Pillow decode.
4. Commit the exact binary to `art-source/child-of-the-spring-light.webp` on the existing candidate branch.
5. Fetch the candidate branch back and re-verify the remote object against the corrected tuple.
6. Stage the ignored runtime review copy and add only the minimum candidate review row, following the Card 04 pattern. Do not use the production artwork path and do not edit `seed.ts` or `rightsStatus`.
7. Run the full nine-surface CHARACTER QA:
   1. raw 2:3
   2. CardView 3:4
   3. CardDetailDrawer 4:5
   4. HandCardPreview 7:9
   5. CreatureSlot 3:4
   6. admin desktop
   7. admin 390 px
   8. 92 px thumbnail
   9. 92 px hierarchy beside `matriarch-of-the-spring-light`
8. Measure every objective gate in canonical brief §16, including crop geometry, edge density, warmth R-B, saturation, mean luminance, grayscale spread, metallic-gold coverage, thumbnail read, rarity hierarchy, faction differentiation, reserved motifs and all safety constraints.
9. Owner visual approval before QA is not a waiver. Report every deviation honestly.
10. Do not regenerate, retouch, crop, recolor, re-encode or automatically repair the master because of a QA miss.
11. Update `docs/agent-reports/2026-09-02-art-pack-04-card-01-candidate-qa.md` with the retry evidence and final QA result. Preserve the failed first-attempt evidence as history.
12. Update `docs/art-pack-04.md`.
13. Update `docs/AGENT_STATE.md` last, fetch it back from GitHub, verify, then stop.

## Decision rule

- All required gates pass: `READY FOR POST-QA OWNER APPROVAL — ART PACK 04 CARD 01`.
- Candidate intact but one or more brief gates miss: `CANDIDATE QA COMPLETE — OWNER CAVEAT DECISION REQUIRED` and list every miss.
- Binary integrity, transport or a hard safety gate fails: `REJECTED / BLOCKED — NO INTEGRATION`.

## Hard exclusions

No production asset path, seed, schema, migration, gameplay or balance changes. No integration PR. No production-sync preparation or dispatch. No Railway, production DB or Vercel. Do not start Card 02. Do not reuse `SYNC-13-CARD-ART-PRODUCTION` or `SYNC-14-CARD-ART-PRODUCTION`; both are consumed.
