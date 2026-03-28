type Props = {
  values: number[];
};

export function PerformanceChart({ values }: Props) {
  if (!values.length) return <div className="h-full w-full rounded bg-slate-950/60" />;

  const width = 900;
  const height = 240;
  const pad = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const toX = (i: number) => pad + (i / Math.max(1, values.length - 1)) * (width - pad * 2);
  const toY = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const line = values.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const area = `${line} L ${toX(values.length - 1)},${height - pad} L ${toX(0)},${height - pad} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full rounded-lg">
      <defs>
        <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="#090f1a" />
      <path d={area} fill="url(#perfFill)" />
      <path d={line} stroke="#a5b4fc" strokeWidth="2.2" fill="none" />
    </svg>
  );
}
