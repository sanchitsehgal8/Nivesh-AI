type PatternSummary = {
  pattern_name: string;
  confidence: number;
};

export function PatternOverlay({ patterns }: { patterns: PatternSummary[] }) {
  return (
    <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
      <p className="mb-2">Pattern Overlay Summary</p>
      <div className="flex flex-wrap gap-2">
        {patterns.length === 0 ? (
          <span className="rounded bg-slate-800 px-2 py-1 text-xs">No active patterns</span>
        ) : (
          patterns.map((p) => (
            <span key={p.pattern_name} className="rounded bg-slate-800 px-2 py-1 text-xs">
              {p.pattern_name} ({Math.round(p.confidence * 100)}%)
            </span>
          ))
        )}
      </div>
    </section>
  );
}
