import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export interface PremiumPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** 'raido' gives the panel the signature black-metallic/red-glow treatment for hero moments. */
  tone?: 'default' | 'raido';
}

/**
 * Shared dark panel surface (graphite base, faint border, soft drop shadow, subtle noise seam)
 * used anywhere a "premium CCG UI chrome" panel is needed - conductor panel, card detail,
 * deck-select cards, home hero. Replaces ad-hoc `bg-raido-graphite border ...` divs so the
 * panel look stays visually consistent across the app (design-tokens rule, no component fork).
 */
export function PremiumPanel({ tone = 'default', className, ...props }: PremiumPanelProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-panel border shadow-panel',
        tone === 'raido'
          ? 'border-raido-red/40 bg-gradient-to-b from-raido-graphite to-raido-black shadow-raido'
          : 'border-white/10 bg-raido-graphite/90',
        className,
      )}
      {...props}
    />
  );
}
