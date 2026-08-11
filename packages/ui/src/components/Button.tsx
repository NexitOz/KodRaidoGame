import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const VARIANT_CLASS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-raido-red text-raido-white hover:bg-raido-redGlow shadow-glow focus-visible:ring-raido-red',
  secondary:
    'bg-raido-steel text-raido-white hover:bg-raido-graphite border border-raido-mist/30 focus-visible:ring-raido-mist',
  ghost: 'bg-transparent text-raido-mist hover:text-raido-white focus-visible:ring-raido-mist',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx(
        'inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-raido-black active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
        VARIANT_CLASS[variant],
        className,
      )}
      {...props}
    />
  );
});
