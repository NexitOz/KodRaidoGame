import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface ArenaSurfaceProps {
  /** Unused now that both mobile and desktop render the illustrated asset (its own lighting takes
   * over) - kept in the prop contract so callers don't need to change. */
  isMyTurn: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * The arena shell. Battlefield Art Asset pass: both mobile (`kod-raido-arena-mobile.webp`) and
 * desktop (`kod-raido-arena-base.webp`) now render the illustrated asset as the real physical-arena
 * surface via `.stage` (a descendant of `children`), so this component is just a minimal
 * positioning root - no competing CSS-drawn material/frame/filigree layers.
 */
export function ArenaSurface({ children, className }: ArenaSurfaceProps) {
  return <div className={clsx('relative isolate', className)}>{children}</div>;
}
