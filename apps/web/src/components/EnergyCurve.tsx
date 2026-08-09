import type { Card } from '@kod-raido/shared';

export function EnergyCurve({
  entries,
  cardsById,
}: {
  entries: Array<{ cardId: string; quantity: number }>;
  cardsById: Map<string, Card>;
}) {
  const buckets = new Array(8).fill(0) as number[]; // index 0..6 = cost 1..7, index 7 = 8+
  for (const entry of entries) {
    const card = cardsById.get(entry.cardId);
    if (!card) continue;
    const idx = Math.min(Math.max(card.cost, 1), 8) - 1;
    buckets[idx] = (buckets[idx] ?? 0) + entry.quantity;
  }
  const max = Math.max(1, ...buckets);

  return (
    <div className="flex items-end gap-1.5 rounded-xl border border-white/10 bg-black/20 p-3">
      {buckets.map((count, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-20 w-full items-end">
            <div
              className="w-full rounded-t bg-raido-red/70"
              style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
            />
          </div>
          <span className="text-[10px] text-raido-mist">{i === 7 ? '8+' : i + 1}</span>
        </div>
      ))}
    </div>
  );
}
