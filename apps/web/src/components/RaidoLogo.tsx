export function RaidoLogo({ className }: { className?: string }) {
  return (
    <span
      className={`flex items-center gap-2 font-display text-lg font-bold tracking-[0.2em] ${className ?? ''}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-raido-red text-raido-red shadow-rune">
        ᚱ
      </span>
      КОД РАЙДО
    </span>
  );
}
