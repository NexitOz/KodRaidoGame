import clsx from 'clsx';
import type { ResonanceTier } from '@kod-raido/shared';

import styles from './ProductionControls.module.css';

export interface ResonanceMeterProps {
  tier: ResonanceTier;
  triggerKey?: number;
  align?: 'left' | 'right';
  className?: string;
}

const MAX_TIER = 5;
const CONTROL_PATH = '/art/battlefield/controls';
const GEMS = ['ruby', 'topaz', 'amethyst', 'cyan', 'sapphire'] as const;
const TRANSPARENT_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export function ResonanceMeter({ tier, triggerKey = 0, align = 'left', className }: ResonanceMeterProps) {
  const normalizedTier = Math.max(0, Math.min(MAX_TIER, Number.isFinite(tier) ? Math.trunc(tier) : 0));

  return (
    <div className={clsx(styles.resonance, align === 'right' && styles.alignRight, className)} aria-label={`Резонанс: ${normalizedTier} из ${MAX_TIER}`}>
      <div className={styles.mobileResonance}>
        <span className={styles.mobileTitle}>Резонанс</span>
        <div className={styles.mobileNodes} aria-hidden="true">
          {GEMS.map((gem, i) => <span key={gem} className={clsx(styles.mobileNode, i < normalizedTier && styles.mobileNodeActive)} />)}
        </div>
        <span className={styles.mobileValue}>{normalizedTier}<span>/{MAX_TIER}</span></span>
      </div>

      <div className={styles.desktopResonance}>
        <picture className={styles.resonanceFrame} aria-hidden="true">
          <source media="(min-width: 1024px)" srcSet={`${CONTROL_PATH}/kod-raido-resonance-frame-empty-v1.png`} />
          <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={1671} height={330} />
        </picture>
        <span className={styles.resonanceTitle}>Резонанс</span>
        <div className={styles.gems} aria-hidden="true">
          {GEMS.slice(0, normalizedTier).map((gem, i) => (
            <picture key={gem} className={clsx(styles.gem, triggerKey > 0 && i === normalizedTier - 1 && styles.gemChanged)}>
              <source media="(min-width: 1024px)" srcSet={`${CONTROL_PATH}/kod-raido-resonance-gem-${gem}-v1.png`} />
              <img src={TRANSPARENT_PIXEL} alt="" draggable={false} width={512} height={512} />
            </picture>
          ))}
        </div>
        <span className={styles.resonanceValue}>{normalizedTier}/{MAX_TIER}</span>
      </div>
    </div>
  );
}
