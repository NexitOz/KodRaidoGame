-- Canonical Card Roster 1.1: makes an existing database's `Card.active` state canonical
-- (40 active collectible Content Pack 01 cards + 1 active token, 23 archived legacy cards)
-- without depending on a re-run of prisma/seed.ts. `prisma migrate deploy` alone must be
-- enough - a fresh database still gets this state from seed.ts, but an already-seeded
-- production database (where every card row, legacy included, currently has active=true)
-- needs this data migration to reach the same end state on upgrade.
--
-- Idempotent (safe to run more than once) and safe if some of these rows don't exist yet
-- (e.g. a database seeded before Content Pack 01 shipped) - an UPDATE ... WHERE slug IN (...)
-- simply matches zero rows for any slug that isn't present, it does not error.
--
-- No Card row is deleted. No CollectionEntry row is touched. No card id/slug is changed.
-- Historical Match/MatchEvent data is untouched - MatchesService.buildMatchContext() and
-- DecksService.validate() both query cards without an `active` filter by design, so this
-- migration cannot affect in-progress or historical match rendering.

-- The 23 pre-Content-Pack-01 legacy cards (see docs/content-pack-01.md's "Canonical launch
-- set" section for the full per-card disposition) - archived, not deleted.
UPDATE "cards"
SET "active" = false
WHERE "slug" IN (
  'kael-rider-of-ash',
  'vex-the-silent',
  'nyra-bloodrune',
  'draven-nightblade',
  'selene-duskcaller',
  'morrigan-voice-of-ash',
  'raiden-umbra',
  'korrath-hollow-king',
  'aria-lightweaver',
  'bram-stonewarden',
  'wren-songkeeper',
  'halcyon-the-resonant',
  'awakening-of-shadow',
  'echo-of-resonance',
  'drakes-voice',
  'code-raido-awakening',
  'surge-of-energy',
  'shadow-breakthrough',
  'resonance-recovery',
  'seal-of-silence',
  'rune-of-echo',
  'rune-of-shadow',
  'rune-of-the-skybound'
);

-- "Руна Райдо" (rune-of-raido) is one of the 10 canonical Content Pack 01 neutral cards,
-- defined once and reused as-is from before the faction schema existed (see
-- prisma/seed.ts's NEUTRAL_CARDS) - it is NOT one of the 23 legacy slugs above and must stay
-- active regardless of any prior state. Explicit rather than assumed, per Canonical Card
-- Roster 1.1's deployment-closure requirement.
UPDATE "cards"
SET "active" = true
WHERE "slug" = 'rune-of-raido';
