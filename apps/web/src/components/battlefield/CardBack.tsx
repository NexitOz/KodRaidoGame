import clsx from 'clsx';

export interface CardBackProps {
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * The branded Kod Raido card back — shown for the opponent's hand so their
 * card identities never leak to the client, per spec section 4. Reuses the
 * same ᚱ rune glyph as the app logo (RaidoLogo) for brand consistency.
 */
export function CardBack({ size = 'sm', className }: CardBackProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        'relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden rounded-lg border border-raido-red/30 bg-raido-graphite shadow-rune',
        size === 'sm' ? 'w-10' : 'w-16',
        className,
      )}
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 40%, rgba(227,18,62,0.22), transparent 65%)',
      }}
    >
      <span className="absolute inset-1 rounded-md border border-raido-red/15" />
      <span
        className={clsx(
          'flex items-center justify-center rounded-full border border-raido-red/60 text-raido-red',
          size === 'sm' ? 'h-5 w-5 text-xs' : 'h-8 w-8 text-base',
        )}
      >
        ᚱ
      </span>
      <span className="mt-1.5 flex items-end gap-[1.5px]" aria-hidden="true">
        {[0, 1, 2, 3, 2].map((h, i) => (
          <span
            key={i}
            className="animate-waveform-bar w-[2px] rounded-full bg-raido-red/50"
            style={{ height: `${3 + h * 1.5}px`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
