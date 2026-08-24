# SHADOW Card 04 — master-art candidate v2 source note

Card: `rune-of-the-echoing-dusk` / «Рунный Страж Эха»
Date: 2026-08-24
Status: candidate transport v2, awaiting the real WebP binary on this branch

## Canonical concept

Approved concept and owner decision:
`docs/agent-reports/2026-08-24-shadow-card-04-concept-review.md` § `Owner decision`.

## Master expected on this branch

Path:
`art-source/rune-of-the-echoing-dusk.webp`

Expected integrity from the local export:

- dimensions: `1024x1536`
- format: WebP (`VP8 `)
- encoding: quality 92, method 6
- file size: `351690` bytes
- RIFF-declared total: `351690` bytes
- SHA-256: `319bdccc4dad399e3f048bf4aa095910c1fd255f453387a8604e1022734eb858`

## Important

The previous connector-based binary upload produced invalid bytes and must not be reused.
This v2 branch starts clean from current `main`. The real `.webp` must be uploaded as an actual file, then independently verified after commit before visual QA.

Do not promote `artworkUrl`, change `rightsStatus`, touch gameplay/seed data, production DB, or production sync until the visual review passes.
