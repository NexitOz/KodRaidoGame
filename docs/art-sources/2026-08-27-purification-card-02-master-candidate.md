# PURIFICATION Card 02 — accepted master candidate source record

Date: 2026-08-27

Card: `seal-of-the-curse` / «Печать Проклятия»
Faction/type/rarity: PURIFICATION / EVENT / RARE
Candidate branch: `assets/seal-of-the-curse-candidate`
Base main at branch creation: `2340b0cce04163658e9426dd6eea365c2910939f`

## Owner decision

The project owner explicitly accepted the first generated candidate in chat on 2026-08-27 with «Принимаю.».

This acceptance is visual acceptance of the generated master candidate for repository QA. It is **not** production promotion authorization and does not authorize seed, workflow, Railway, or production DB changes.

## Generator provenance

- Generator: OpenAI ChatGPT image generation
- Generation id: `3fddb82c-e8a8-4a84-91b5-2b5ac3fbc4b3`
- Generated source: 1024 × 1536 PNG
- Concept: hostile dark-material weapon hand stopped mid-attack by a rigid white/silver engraved White Rune restraint clamp locked around the hand and weapon guard/hilt; cold pale blue-white material-bound rune light; bright diffuse PURIFICATION environment; no visible caster.
- Master-art brief: `docs/art-review/seal-of-the-curse-master-art-brief.md`

## Visual acceptance notes

The accepted image preserves the locked Card 02 concept:

- attack reads as physically sealed rather than damaged or corrupted;
- white/silver rune restraint is the hero object;
- dark enemy arm is dark by material, not SHADOW-like lighting;
- rune energy is engraved/material-bound and pale blue-white;
- no crimson/red/violet/magenta/ember-orange corruption language;
- no open-hand caster, beam, projectile, explosion, or generic shield;
- enemy remains generic and secondary;
- composition is event/object-driven rather than a character portrait.

## Technical normalization

The accepted 1024 × 1536 PNG was converted locally without regeneration to WebP using Pillow:

- target path: `art-source/seal-of-the-curse.webp`
- dimensions: `1024 × 1536`
- WebP encoder: Pillow, quality 92, method 6
- byte size: `326508`
- RIFF-declared total: `326508`
- container/chunk FourCC: plain `VP8 `
- SHA-256: `699db6b797effe04c2fd2b8642391af62da506d9e290374369bd842630258261`
- full decode: PASS

These exact values are the transport integrity gate. Any repository copy that differs must be rejected rather than repaired/re-encoded by an agent.

## Transport note

The candidate branch and this provenance record were prepared through the connected GitHub tooling. The binary itself must be transported byte-for-byte from the normalized local master. Because the connected API path previously demonstrated unsafe binary truncation during Card 01, no unverified binary write is to be treated as a valid candidate. The repository copy must be independently checked against all expected values above before visual surface QA begins.

## Scope

Candidate only. Do not merge this branch into `main`. Do not change production `artworkUrl`, `rightsStatus`, seed/card gameplay data, Prisma schema, Battlefield, production sync scripts/workflows, Railway, Vercel, or production DB on the basis of this record.
