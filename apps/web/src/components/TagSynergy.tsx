import type { Card } from '@kod-raido/shared';

export function TagSynergy({
  entries,
  cardsById,
}: {
  entries: Array<{ cardId: string; quantity: number }>;
  cardsById: Map<string, Card>;
}) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const card = cardsById.get(entry.cardId);
    if (!card) continue;
    for (const tag of card.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + entry.quantity);
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (sorted.length === 0) {
    return <p className="text-xs text-raido-mist">Добавь карты, чтобы увидеть синергию тегов.</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {sorted.map(([tag, count]) => (
        <span
          key={tag}
          className="rounded-full border border-white/10 bg-raido-steel px-2.5 py-1 text-xs text-raido-white"
        >
          {tag} <span className="text-raido-mist">×{count}</span>
        </span>
      ))}
    </div>
  );
}
