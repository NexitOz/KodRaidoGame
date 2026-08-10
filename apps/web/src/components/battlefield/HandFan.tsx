'use client';

import clsx from 'clsx';
import type { Card } from '@kod-raido/shared';
import { CardView } from '@kod-raido/ui';
import { useLongPress } from '@/lib/use-long-press';

export interface HandCardEntry {
  instanceId: string;
  card: Card;
}

export interface HandFanProps {
  cards: HandCardEntry[];
  energy: number;
  selectedInstanceId?: string | null;
  disabled?: boolean;
  onSelect: (instanceId: string, cost: number) => void;
  onPreview: (card: Card) => void;
}

const ANGLE_STEP_DEG = 5;
const ARC_STEP_PX = 3;
const OVERLAP_PX = 22;

export function HandFan({ cards, energy, selectedInstanceId, disabled, onSelect, onPreview }: HandFanProps) {
  const center = (cards.length - 1) / 2;

  return (
    <div
      className="flex justify-center overflow-x-auto px-2 pb-1 pt-2"
      role="list"
      aria-label={`Рука, ${cards.length} карт`}
    >
      <div className="flex" style={{ marginLeft: cards.length > 1 ? OVERLAP_PX : 0 }}>
        {cards.map(({ instanceId, card }, i) => (
          <HandCardItem
            key={instanceId}
            card={card}
            offsetFromCenter={i - center}
            marginLeft={i === 0 ? 0 : -OVERLAP_PX}
            zIndex={i}
            selected={selectedInstanceId === instanceId}
            affordable={card.cost <= energy}
            disabled={disabled}
            onSelect={() => onSelect(instanceId, card.cost)}
            onPreview={() => onPreview(card)}
          />
        ))}
      </div>
    </div>
  );
}

interface HandCardItemProps {
  card: Card;
  offsetFromCenter: number;
  marginLeft: number;
  zIndex: number;
  selected: boolean;
  affordable: boolean;
  disabled?: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function HandCardItem({
  card,
  offsetFromCenter,
  marginLeft,
  zIndex,
  selected,
  affordable,
  disabled,
  onSelect,
  onPreview,
}: HandCardItemProps) {
  const longPress = useLongPress(onPreview);

  return (
    <div
      role="listitem"
      className="relative shrink-0 transition-transform duration-150 ease-out"
      style={{
        marginLeft,
        zIndex: selected ? 100 : zIndex,
        transform: selected
          ? 'translateY(-16px) rotate(0deg)'
          : `translateY(${Math.abs(offsetFromCenter) * ARC_STEP_PX}px) rotate(${offsetFromCenter * ANGLE_STEP_DEG}deg)`,
      }}
      onPointerDown={longPress.onPointerDown}
      onPointerUp={longPress.onPointerUp}
      onPointerLeave={longPress.onPointerLeave}
      onPointerCancel={longPress.onPointerCancel}
      onClickCapture={longPress.onClickCapture}
    >
      <CardView
        card={card}
        size="xs"
        onSelect={disabled ? undefined : onSelect}
        className={clsx(
          'animate-card-in',
          selected && 'ring-2 ring-raido-red',
          !affordable && 'opacity-40',
          disabled && 'pointer-events-none',
        )}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        aria-label={`Просмотреть карту: ${card.name}`}
        className="absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-xs text-raido-white ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raido-red"
      >
        ℹ
      </button>
    </div>
  );
}
