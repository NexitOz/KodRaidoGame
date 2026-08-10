'use client';

import clsx from 'clsx';
import type { FeedbackItem } from '@/lib/use-combat-feedback';

/** Floating damage/heal/shield numbers, absolutely positioned over their target. */
export function FloatingFeedback({ items }: { items: FeedbackItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
      {items.map((item) => (
        <span
          key={item.id}
          role="status"
          className={clsx(
            'animate-float-up absolute text-sm font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
            item.kind === 'damage' && 'text-raido-redGlow',
            item.kind === 'heal' && 'text-emerald-400',
            item.kind === 'shield' && 'text-sky-300',
          )}
        >
          {item.kind === 'damage' ? `−${item.amount}` : null}
          {item.kind === 'heal' ? `+${item.amount}` : null}
          {item.kind === 'shield' ? '🛡' : null}
        </span>
      ))}
    </div>
  );
}
