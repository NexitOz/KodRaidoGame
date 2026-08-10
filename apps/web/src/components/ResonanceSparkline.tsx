'use client';

export function ResonanceSparkline({ points }: { points: number[] }) {
  if (points.length < 2) {
    return <p className="py-3 text-xs text-raido-mist">Пока недостаточно данных за 7 дней.</p>;
  }

  const width = 200;
  const height = 40;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = Math.max(max - min, 1);
  const stepX = width / (points.length - 1);

  const coords = points.map((point, i) => {
    const x = i * stepX;
    const y = height - ((point - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-10 w-full text-raido-red"
      role="img"
      aria-label="Resonance score за последние 7 дней"
    >
      <polyline points={coords.join(' ')} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
