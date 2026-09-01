'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import type { Card, UnitInstanceView } from '@kod-raido/shared';
import { CardView, RARITY_FRAME_CLASS } from '@kod-raido/ui';
import { api } from '@/lib/api';
import { factionLabel } from '@/lib/factions';
import { CardDetailDrawer } from '@/components/CardDetailDrawer';
import { HandCardPreview } from '@/components/battlefield/HandCardPreview';
import { CreatureSlot } from '@/components/battlefield/CreatureSlot';

/**
 * Production Art Pass 01 review tool (docs/art-bible-01.md). Not linked from any nav - reachable
 * only by typing the URL. Reads only the public GET /api/cards response; never writes anything.
 *
 * A "candidate" is a not-yet-approved production illustration dropped locally at
 * apps/web/public/art-review-candidates/<slug>.<ext> (gitignored, never committed - see
 * .gitignore). This page never touches any card's real artworkUrl or rightsStatus; it only swaps
 * the image source client-side, in-memory, for review. Approving a candidate and wiring it into
 * the real pipeline (artworkUrl, rightsStatus: 'owned') is a separate, explicit step per
 * docs/art-bible-01.md - this page does not perform it.
 */

const CANDIDATE_EXTENSIONS = ['png', 'jpg', 'webp'];

type ReviewTarget = {
  slug: string;
  faction: string;
  referenceLabel: string;
  reviewArtworkUrl?: string;
};

const REVIEW_TARGETS: ReviewTarget[] = [
  {
    slug: 'necromancer-of-the-twilight-order',
    faction: 'SHADOW',
    referenceLabel: 'Reference 01 — LOCKED',
  },
  {
    slug: 'high-warden-of-the-white-rune',
    faction: 'PURIFICATION',
    referenceLabel: 'Reference 02 — LOCKED',
  },
  {
    slug: 'matriarch-of-the-spring-light',
    faction: 'BOND',
    referenceLabel: 'Reference 03 — LOCKED',
  },
  { slug: 'lord-of-the-nameless-shadow', faction: 'VEIL', referenceLabel: 'Reference 04 — LOCKED' },
  { slug: 'keeper-of-the-grey-mist', faction: 'MYSTERY', referenceLabel: 'Reference 05 — LOCKED' },
  {
    slug: 'lord-of-the-stellar-stream',
    faction: 'COSMIC',
    referenceLabel: 'Reference 06 — LOCKED',
  },
  {
    slug: 'whisper-of-the-forgotten',
    faction: 'SHADOW',
    referenceLabel: 'ART PACK 02 — APPROVED 01',
    reviewArtworkUrl: '/art/cards/whisper-of-the-forgotten.webp',
  },
  {
    slug: 'ashen-blade',
    faction: 'SHADOW',
    referenceLabel: 'ART PACK 02 — APPROVED 02',
    reviewArtworkUrl: '/art/cards/ashen-blade.webp',
  },
  {
    slug: 'keeper-of-smoldering-embers',
    faction: 'SHADOW',
    referenceLabel: 'ART PACK 02 — APPROVED 03',
    reviewArtworkUrl: '/art/cards/keeper-of-smoldering-embers.webp',
  },
  // Card 04 is a RUNE, not a CHARACTER - the first non-character entry here. It exercises the
  // `hasBoardSlot` path below: a rune never occupies a Battlefield slot, so its row shows four
  // surfaces instead of five.
  {
    slug: 'rune-of-the-echoing-dusk',
    faction: 'SHADOW',
    referenceLabel: 'ART PACK 02 — APPROVED 04',
    reviewArtworkUrl: '/art/cards/rune-of-the-echoing-dusk.webp',
  },
  {
    slug: 'acolyte-of-the-white-rune',
    faction: 'PURIFICATION',
    referenceLabel: 'ART PACK 03 — APPROVED 01',
    reviewArtworkUrl: '/art/cards/acolyte-of-the-white-rune.webp',
  },
  // Card 02 is an EVENT, so like the Art Pack 02 rune it takes the `hasBoardSlot` false path below
  // and shows four surfaces rather than five - an EVENT never occupies a Battlefield board slot.
  {
    slug: 'seal-of-the-curse',
    faction: 'PURIFICATION',
    referenceLabel: 'ART PACK 03 — APPROVED 02',
    reviewArtworkUrl: '/art/cards/seal-of-the-curse.webp',
  },
  // Card 03 is a CHARACTER, so unlike Cards 02/04 above it takes the `hasBoardSlot` true path and
  // shows all five surfaces including the real CreatureSlot board slot.
  {
    slug: 'warden-of-the-barrier',
    faction: 'PURIFICATION',
    referenceLabel: 'ART PACK 03 — APPROVED 03',
    reviewArtworkUrl: '/art/cards/warden-of-the-barrier.webp',
  },
  // Card 04 is a RUNE, so like Card 02 it takes the `hasBoardSlot` false path and shows four
  // surfaces rather than five - a rune never occupies a Battlefield board slot.
  {
    slug: 'rune-of-curse-breaking',
    faction: 'PURIFICATION',
    referenceLabel: 'ART PACK 03 — APPROVED 04',
    reviewArtworkUrl: '/art/cards/rune-of-curse-breaking.webp',
  },
];

function FlagshipRow({
  slug,
  faction,
  referenceLabel,
  reviewArtworkUrl,
  card,
  onOpenDetail,
  onOpenHandPreview,
}: {
  slug: string;
  faction: string;
  referenceLabel: string;
  reviewArtworkUrl?: string;
  card: Card | undefined;
  onOpenDetail: (card: Card) => void;
  onOpenHandPreview: (card: Card) => void;
}) {
  const [candidateExtIndex, setCandidateExtIndex] = useState(0);
  const [candidateMissing, setCandidateMissing] = useState(false);
  const candidateUrl = candidateMissing
    ? null
    : `/art-review-candidates/${slug}.${CANDIDATE_EXTENSIONS[candidateExtIndex]}`;

  if (!card) {
    return (
      <section className="rounded-panel border border-red-500/40 bg-red-950/20 p-4">
        <p className="text-sm text-red-300">
          <strong>{slug}</strong> ({factionLabel(faction)}) was not found in the current{' '}
          <code>/api/cards</code> response. Canonical Card Roster may have changed since
          docs/art-bible-01.md was written — reconcile before reviewing this faction.
        </p>
      </section>
    );
  }

  const displayArtworkUrl = reviewArtworkUrl ?? candidateUrl ?? card.artworkUrl;
  const displayCard: Card =
    displayArtworkUrl === card.artworkUrl ? card : { ...card, artworkUrl: displayArtworkUrl };
  const usingReviewArtwork = Boolean(reviewArtworkUrl);
  const usingCandidate = Boolean(candidateUrl);
  // Only CHARACTER cards ever occupy a Battlefield board slot, so the CreatureSlot panel is only a
  // real surface for them. A RUNE/EVENT/TRACK never renders its artwork on the board at all - the
  // Rune zone draws a glyph (see components/battlefield/RuneZone.tsx) and the play reveal draws an
  // icon - so showing it here would review a surface that does not exist, with a meaningless 0/0
  // stat block stubbed in from the missing attack/health.
  const hasBoardSlot = displayCard.type === 'CHARACTER';
  // Stub unit for the Battlefield board-slot check only - never a real match, never persisted.
  const stubUnit: UnitInstanceView | null = hasBoardSlot
    ? {
        instanceId: `art-review-stub-${slug}`,
        card: displayCard,
        attack: 'attack' in displayCard ? displayCard.attack : 0,
        health: 'health' in displayCard ? displayCard.health : 0,
        maxHealth: 'health' in displayCard ? displayCard.health : 0,
        statuses: [],
        summonedThisTurn: false,
        attackedThisTurn: false,
      }
    : null;

  return (
    <section className="rounded-panel border border-white/10 bg-raido-graphite/60 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">{card.name}</h2>
          <p className="text-xs text-raido-mist">
            {factionLabel(faction)} · <code>{slug}</code> · {referenceLabel} (see
            docs/art-bible-01.md)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={clsx(
              'rounded-full border px-2 py-0.5',
              card.rightsStatus === 'placeholder'
                ? 'border-raido-mist/40 text-raido-mist'
                : 'border-emerald-400/50 text-emerald-300',
            )}
          >
            rightsStatus: {card.rightsStatus}
          </span>
          <span
            className={clsx(
              'rounded-full border px-2 py-0.5',
              usingReviewArtwork || usingCandidate
                ? 'border-raido-gold/50 text-raido-gold'
                : 'border-white/10 text-raido-mist/70',
            )}
          >
            {usingReviewArtwork
              ? 'PRODUCTION ASSET — REVIEW'
              : usingCandidate
                ? 'showing CANDIDATE (not wired to artworkUrl)'
                : 'no candidate file — showing shipped placeholder'}
          </span>
        </div>
      </div>

      {!usingReviewArtwork && !usingCandidate ? (
        <p className="mb-3 text-xs text-raido-mist">
          Drop a file at <code>apps/web/public/art-review-candidates/{slug}.png</code> (or .jpg /
          .webp) to review a production candidate here. This never modifies the card record.
        </p>
      ) : null}

      <div
        className={clsx(
          'grid grid-cols-2 gap-4 sm:grid-cols-3',
          hasBoardSlot ? 'lg:grid-cols-5' : 'lg:grid-cols-4',
        )}
      >
        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] uppercase tracking-wide text-raido-mist">Raw master art</p>
          <img
            src={displayCard.artworkUrl}
            alt=""
            className="max-h-64 w-full rounded-lg border border-white/10 object-contain"
            onError={() => {
              if (candidateExtIndex + 1 < CANDIDATE_EXTENSIONS.length) {
                setCandidateExtIndex((i) => i + 1);
              } else {
                setCandidateMissing(true);
              }
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] uppercase tracking-wide text-raido-mist">
            CardView 3:4 (Collection / Hand / Battlefield slot)
          </p>
          <CardView card={displayCard} size="md" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] uppercase tracking-wide text-raido-mist">
            CardDetailDrawer crop 4:5 (tightest — top/bottom risk here is real)
          </p>
          <div
            className={clsx(
              'relative h-40 w-32 overflow-hidden rounded-xl border',
              RARITY_FRAME_CLASS[displayCard.rarity],
            )}
          >
            <img
              src={displayCard.artworkUrl}
              alt={displayCard.name}
              className="h-full w-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={() => onOpenDetail(displayCard)}
            className="mt-1 rounded-full border border-white/10 px-3 py-1 text-[11px] text-raido-mist hover:text-raido-white"
          >
            Open real Card Detail modal
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] uppercase tracking-wide text-raido-mist">
            HandCardPreview crop 7:9 (in-match hand tap)
          </p>
          <div
            className={clsx(
              'h-36 w-28 overflow-hidden rounded-xl border',
              RARITY_FRAME_CLASS[displayCard.rarity],
            )}
          >
            <img src={displayCard.artworkUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onOpenHandPreview(displayCard)}
            className="mt-1 rounded-full border border-white/10 px-3 py-1 text-[11px] text-raido-mist hover:text-raido-white"
          >
            Open real Hand Preview modal
          </button>
        </div>

        {stubUnit ? (
          <div className="flex flex-col items-center gap-1">
            <p className="text-[11px] uppercase tracking-wide text-raido-mist">
              Battlefield board slot (CreatureSlot, 3:4)
            </p>
            <div className="w-full max-w-[160px]">
              <CreatureSlot unit={stubUnit} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function ArtReviewPage() {
  const { data: cards, isLoading } = useQuery({ queryKey: ['cards'], queryFn: api.getCards });
  const [detailCard, setDetailCard] = useState<Card | null>(null);
  const [handPreviewCard, setHandPreviewCard] = useState<Card | null>(null);

  const bySlug = new Map((cards ?? []).map((c) => [c.slug, c]));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-bold">Art Pack 01 — Production Review</h1>
        <p className="text-sm text-raido-mist">
          Internal QA tool for Production Art Pass 01 (docs/art-bible-01.md). Not linked from any
          navigation — there is currently no access gate on this route beyond obscurity. It reads
          only the public <code>GET /api/cards</code> response and, optionally, local candidate
          files under <code>apps/web/public/art-review-candidates/</code> (gitignored). It never
          writes to any card record, and never changes gameplay, balance, economy, abilities, card
          stats, or the other five factions' placeholders.
        </p>
      </header>

      {isLoading ? <p className="text-sm text-raido-mist">Loading cards…</p> : null}

      <div className="flex flex-col gap-6">
        {REVIEW_TARGETS.map((f) => (
          <FlagshipRow
            key={f.slug}
            slug={f.slug}
            faction={f.faction}
            referenceLabel={f.referenceLabel}
            reviewArtworkUrl={f.reviewArtworkUrl}
            card={bySlug.get(f.slug)}
            onOpenDetail={setDetailCard}
            onOpenHandPreview={setHandPreviewCard}
          />
        ))}
      </div>

      <CardDetailDrawer card={detailCard} onClose={() => setDetailCard(null)} />
      <HandCardPreview card={handPreviewCard} onClose={() => setHandPreviewCard(null)} />
    </div>
  );
}
