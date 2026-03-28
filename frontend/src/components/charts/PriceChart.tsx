import type { Candle } from "../../hooks/useOhlcv";

type Props = {
  candles: Candle[];
  width?: number;
  height?: number;
  support?: number;
  resistance?: number;
};

const minMax = (values: number[]) => ({
  min: Math.min(...values),
  max: Math.max(...values),
});

export function PriceChart({ candles, width = 1000, height = 420, support, resistance }: Props) {
  if (!candles.length) {
    return <div className="h-full rounded bg-slate-950/70" />;
  }

  const pad = 28;
  const closes = candles.map((c) => c.close);
  const { min, max } = minMax(closes);
  const span = Math.max(1, max - min);
  const toX = (i: number) => pad + (i / Math.max(1, candles.length - 1)) * (width - pad * 2);
  const toY = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);

  const line = candles
    .map((c, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(2)},${toY(c.close).toFixed(2)}`)
    .join(" ");

  const area = `${line} L ${toX(candles.length - 1)},${height - pad} L ${toX(0)},${height - pad} Z`;

  const supportY = support ? toY(support) : undefined;
  const resistanceY = resistance ? toY(resistance) : undefined;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full rounded-lg">
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill="#070b16" />

      {Array.from({ length: 6 }).map((_, i) => {
        const y = pad + (i / 5) * (height - pad * 2);
        return <line key={`grid-y-${i}`} x1={pad} y1={y} x2={width - pad} y2={y} stroke="#1e293b" strokeWidth="1" />;
      })}

      <path d={area} fill="url(#lineFill)" />
      <path d={line} stroke="#34d399" strokeWidth="2.2" fill="none" />

      {supportY ? <line x1={pad} y1={supportY} x2={width - pad} y2={supportY} stroke="#10b981" strokeDasharray="6 6" /> : null}
      {resistanceY ? <line x1={pad} y1={resistanceY} x2={width - pad} y2={resistanceY} stroke="#f59e0b" strokeDasharray="6 6" /> : null}
    </svg>
  );
}
