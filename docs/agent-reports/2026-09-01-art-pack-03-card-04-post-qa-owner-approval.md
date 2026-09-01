# Art Pack 03 Card 04 — post-QA owner approval

Card: `rune-of-curse-breaking` / «Руна Разрушения Проклятий».

## Decision

**FINAL OWNER APPROVED AFTER EIGHT-SURFACE QA** on 2026-09-01.

The approval applies to the exact candidate already verified in GitHub:

- branch: `assets/rune-of-curse-breaking-candidate-v1`
- candidate HEAD: `185126c8b402dc4134245f984d9d0e7cddc6db8a`
- asset: `art-source/rune-of-curse-breaking.webp`
- dimensions: `1024 × 1536`
- byte size: `438894`
- SHA-256: `6f07380f1f64bee0efd8ec9819de1951dd14fd9dc127dd173ddda909b1c49dd5`
- Git blob SHA: `e1ea12a2f03cc84e9931600e978cc8bf6b1eaccb`
- QA report: `docs/agent-reports/2026-08-31-art-pack-03-card-04-candidate-qa.md`

## Explicit owner rulings on the two QA caveats

The owner accepts the candidate **without regeneration or artwork modification** and accepts both reported deviations as-is:

1. **Dark water/basin lip accepted.** The basin/water zone is the highest-contrast zone but not the brightest zone. The owner accepts this resolution because the dark basin functions as the intended dark anchor while preserving strong thumbnail readability and the measured grayscale spread.
2. **Background architecture accepted.** The pale upper-third piers exceed the brief's literal §13 information ceiling, but remain soft, low-contrast, collapse at 92 px and do not introduce the named forbidden monumental/cathedral cues.

These caveats are now closed for this exact artwork. Do not reopen them during integration unless the bytes or rendering surfaces change.

## Authorization boundary

This approval authorizes the **next repository integration task only** for the exact approved candidate.

It does **not** authorize:

- a production database mutation;
- production artwork sync 13 → 14;
- workflow dispatch;
- Railway/Vercel/production DB access;
- reuse of `SYNC-13-CARD-ART-PRODUCTION`;
- any regeneration, repainting, crop, resize or recomposition.

Production promotion remains a separate owner authorization after repository integration is merged and audited.
