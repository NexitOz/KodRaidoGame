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

const FLAGSHIPS: Array<{ slug: string; faction: string; referenceLabel: string }> = [
  { slug: 'necromancer-of-the-twilight-order', faction: 'SHADOW', referenceLabel: 'Reference 01' },
  { slug: 'high-warden-of-the-white-rune', faction: 'PURIFICATION', referenceLabel: 'Reference 02' },
  { slug: 'matriarch-of-the-spring-light', faction: 'BOND', referenceLabel: 'Reference 03' },
  { slug: 'lord-of-the-nameless-shadow', faction: 'VEIL', referenceLabel: 'Reference 04' },
  { slug: 'keeper-of-the-grey-mist', faction: 'MYSTERY', referenceLabel: 'Reference 05' },
  { slug: 'lord-of-the-stellar-stream', faction: 'COSMIC', referenceLabel: 'Reference 06' },
];

function FlagshipRow({
  slug,
  faction,
  referenceLabel,
  card,
  onOpenDetail,
  onOpenHandPreview,
}: {
  slug: string;
  faction: string;
  referenceLabel: string;
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

  const displayCard: Card = candidateUrl ? { ...card, artworkUrl: candidateUrl } : card;
  const usingCandidate = Boolean(candidateUrl);
  // Stub unit for the Battlefield board-slot check only - never a real match, never persisted.
  // All six flagships are CHARACTER cards, so 'attack'/'health' are always present.
  const stubUnit: UnitInstanceView = {
    instanceId: `art-review-stub-${slug}`,
    card: displayCard,
    attack: 'attack' in displayCard ? displayCard.attack : 0,
    health: 'health' in displayCard ? displayCard.health : 0,
    maxHealth: 'health' in displayCard ? displayCard.health : 0,
    statuses: [],
    summonedThisTurn: false,
    attackedThisTurn: false,
  };

  return (
    <section className="rounded-panel border border-white/10 bg-raido-graphite/60 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold">{card.name}</h2>
          <p className="text-xs text-raido-mist">
            {factionLabel(faction)} · <code>{slug}</code> · {referenceLabel} LOCKED (see
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
              usingCandidate ? 'border-raido-gold/50 text-raido-gold' : 'border-white/10 text-raido-mist/70',
            )}
          >
            {usingCandidate ? 'showing CANDIDATE (not wired to artworkUrl)' : 'no candidate file — showing shipped placeholder'}
          </span>
        </div>
      </div>

      {!usingCandidate ? (
        <p className="mb-3 text-xs text-raido-mist">
          Drop a file at <code>apps/web/public/art-review-candidates/{slug}.png</code> (or .jpg /
          .webp) to review a production candidate here. This never modifies the card record.
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
            <img src={displayCard.artworkUrl} alt={displayCard.name} className="h-full w-full object-cover" />
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

        <div className="flex flex-col items-center gap-1">
          <p className="text-[11px] uppercase tracking-wide text-raido-mist">
            Battlefield board slot (CreatureSlot, 3:4)
          </p>
          <div className="w-full max-w-[160px]">
            <CreatureSlot unit={stubUnit} />
          </div>
        </div>
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
        {FLAGSHIPS.map((f) => (
          <FlagshipRow
            key={f.slug}
            slug={f.slug}
            faction={f.faction}
            referenceLabel={f.referenceLabel}
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
