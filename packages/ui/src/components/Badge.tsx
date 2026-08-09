import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border border-raido-mist/30 bg-raido-graphite/80 px-2.5 py-0.5 text-xs font-medium text-raido-mist backdrop-blur',
        className,
      )}
      {...props}
    />
  );
}
