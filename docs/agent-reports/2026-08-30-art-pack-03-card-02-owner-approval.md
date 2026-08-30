# OWNER APPROVAL — Art Pack 03 Card 02

Date: 2026-08-30
Card: `seal-of-the-curse` / «Печать Проклятия»
Faction / type / rarity: PURIFICATION / EVENT / RARE

## Decision

**OWNER APPROVED — FINAL VISUAL APPROVAL FOR INTEGRATION.**

The owner approved the exact byte-verified candidate after the completed real-stack visual QA recorded in:

`docs/agent-reports/2026-08-30-art-pack-03-card-02-candidate-v2-visual-qa.md`

Approved candidate source:

- branch: `assets/seal-of-the-curse-candidate-v2`
- commit: `67405697628a3dec3fa8e9dab2cdb27c273b6af1`
- path: `art-source/seal-of-the-curse.webp`
- Git blob SHA: `95940017577f7152a28bf76122912c37e548c7e0`
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- size: `326508` bytes
- dimensions: `1024x1536`
- RIFF total: `326508`
- FourCC: `VP8 `

## Accepted caveats

The owner explicitly accepts both QA caveats as non-blocking:

1. **Background architecture:** the pale blurred interior arcade describes more architecture than the locked brief's near-abstract environment target. It remains low-contrast, does not compete with the seal, and triggers no automatic reject condition.
2. **Star / compass-rose emblem on the enemy weapon pommel:** it is unlit dark steel, carries no COSMIC colour/glow/iridescence language, disappears at 92 px, and is accepted as visually neutral.

These caveats must not be reopened as blockers during integration unless a new regression appears on the production artwork path.

## Authorization scope

This approval authorizes repository integration only:

- promote the exact approved bytes to the canonical production artwork path
- set the Card 02 `artworkUrl` and `rightsStatus: owned`
- mark Card 02 FINAL APPROVED in Art Pack 03 documentation
- extend the controlled production card-art sync from 11 to 12 targets
- perform production-path QA and repository validation
- open/update a narrow integration PR and stop for repository review

This approval does **not** authorize:

- merging the integration PR without review
- dispatching the production sync
- mutating production DB
- beginning Card 03

`SYNC-11-CARD-ART-PRODUCTION` is already consumed. Any 12-card production synchronization requires a new explicit owner confirmation after the integration is merged and the immutable source SHA is repointed to that merge commit.
