# OWNER APPROVAL — Art Pack 03 Card 03

Date: 2026-08-31
Card: `warden-of-the-barrier` / «Хранительница Барьера»
Faction / type / rarity: PURIFICATION / CHARACTER / RARE

## Decision

**OWNER APPROVED — FINAL VISUAL APPROVAL FOR INTEGRATION.**

The owner approved the exact byte-verified Card 03 master v2 after the completed real-stack nine-surface QA recorded in:

`docs/agent-reports/2026-08-31-art-pack-03-card-03-candidate-v2-visual-qa.md`

Approved candidate source:

- candidate branch: `assets/warden-of-the-barrier-candidate-v2`
- candidate branch head at QA completion: `b4f35bb379d82584f0e0f28c92f3776d332752a8`
- exact binary source commit: `3dda92ef0d427b943c71212b8e24c95f659dbce5`
- path: `art-source/warden-of-the-barrier.webp`
- Git blob SHA: `c4cb3f4e41f349e86b044712f267f9fdc678aa86`
- SHA-256: `bf5814d345a652d119919c37d128d6a540cd65882d60d04f17432cb31c98239f`
- size: `193038` bytes
- dimensions: `1024 × 1536`
- RIFF total: `193038`
- FourCC: plain `VP8 `
- full decode: PASS

The earlier Card 03 v1 binary (`284002` bytes / SHA-256 `1a175635a24e84c86f37f11e954299ca3cb4bb675c9f9b178c134ee0ab0ea27e`) remains **REJECTED HISTORICAL INPUT** and must never be substituted for the approved v2.

## Accepted QA judgement items

The owner explicitly accepts the documented QA judgement items as non-blocking:

1. **Single classical background column:** the scene is not completely empty, but the column remains pale, soft and subordinate, collapses to a background band at thumbnail size, and does not recreate the rejected v1 cathedral / spires / crowd / monumental-architecture language.
2. **High-key value profile:** Card 03 is the palest card measured in the shipped set (`p5 = 109`), but its tonal profile is consistent with the established PURIFICATION treatment and is closest to the already approved `acolyte-of-the-white-rune`.
3. **Minor 4:5 anchor-base crop:** the binding crop cuts only the very bottom lip of the base plate; the spike and displaced rubble that communicate the planted ward-screen remain visible. This is accepted as a non-blocking crop observation.

These points must not be reopened as blockers during repository integration unless a new regression appears on the canonical production artwork path.

## Authorization scope

This owner approval authorizes **repository integration only**:

- promote the exact approved v2 bytes to `apps/web/public/art/cards/warden-of-the-barrier.webp`
- set only Card 03 production-source fields in `seed.ts`: `artworkUrl: '/art/cards/warden-of-the-barrier.webp'` and `rightsStatus: 'owned'`
- convert the Card 03 `/admin/art-review` entry from candidate to the canonical production path while preserving CHARACTER / CreatureSlot review behavior
- mark Card 03 FINAL APPROVED in Art Pack 03 documentation
- extend the controlled card-art synchronization definition from 12 to 13 targets, but leave the immutable source pin deliberately unready for production until the integration merge commit exists
- run production-path visual QA and normal repository validation
- open a narrow integration PR and stop for repository review

This approval does **not** authorize:

- merging the integration PR without independent review
- dispatching the production card-art sync
- using or consuming a production confirmation string
- mutating the production database
- accessing or mutating Railway/Vercel production
- beginning Card 04

`SYNC-12-CARD-ART-PRODUCTION` is consumed. Any 13-card production synchronization requires a **new explicit owner confirmation** after the integration is merged and every immutable-source pin has been repointed to the exact merged integration commit. The reserved future confirmation string is:

`SYNC-13-CARD-ART-PRODUCTION`

It is **NOT authorized or consumed by this approval**.
