type SectorPoint = {
  name: string;
  score: number;
};

export function SectorRotationChart({ sectors }: { sectors: SectorPoint[] }) {
  const maxScore = Math.max(...sectors.map((s) => s.score), 1);
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-200">Sector Rotation Snapshot</h3>
      <div className="space-y-2">
        {sectors.map((sector) => (
          <div key={sector.name}>
            <div className="mb-1 flex justify-between text-xs text-slate-300">
              <span>{sector.name}</span>
              <span>{sector.score.toFixed(1)}</span>
            </div>
            <div className="h-2 rounded bg-slate-700">
              <div
                className="h-2 rounded bg-cyan-500"
                style={{ width: `${Math.max(8, (sector.score / maxScore) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
