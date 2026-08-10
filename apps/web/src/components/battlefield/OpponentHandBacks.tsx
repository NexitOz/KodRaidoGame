import { CardBack } from './CardBack';

const MAX_VISIBLE = 8;

export function OpponentHandBacks({ count }: { count: number }) {
  const visible = Math.min(count, MAX_VISIBLE);
  const overflow = count - visible;

  return (
    <div
      className="flex items-center justify-center"
      role="img"
      aria-label={`Рука соперника: ${count} карт`}
    >
      <div className="flex" style={{ marginLeft: visible > 1 ? 10 : 0 }}>
        {Array.from({ length: visible }, (_, i) => (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : -10, zIndex: i }} className="relative">
            <CardBack size="sm" />
          </div>
        ))}
      </div>
      {overflow > 0 ? <span className="ml-1 text-[11px] text-raido-mist">+{overflow}</span> : null}
    </div>
  );
}
