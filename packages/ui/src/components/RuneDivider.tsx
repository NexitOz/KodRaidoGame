import clsx from 'clsx';

export interface RuneDividerProps {
  label?: string;
  className?: string;
}

/**
 * Kod Raido brand motif: a thin line with a small rune tick at its center. Used to separate
 * sections (card detail panels, collection groups, deck picker) instead of a plain <hr>.
 */
export function RuneDivider({ label, className }: RuneDividerProps) {
  return (
    <div className={clsx('flex items-center gap-3', className)} role="separator">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-raido-mist/30 to-raido-mist/30" />
      <span aria-hidden className="text-[10px] text-raido-red/70">
        ◈
      </span>
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-widest text-raido-mist">{label}</span>
      ) : null}
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-raido-mist/30 to-raido-mist/30" />
    </div>
  );
}
