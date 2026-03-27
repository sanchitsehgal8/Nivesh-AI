import type { Signal } from "../store/useAppStore";

export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-white">{signal.stock_symbol}</h3>
        <span className="text-xs text-slate-300">{signal.signal_type}</span>
      </header>
      <p className="text-sm text-slate-200">{signal.reasoning_summary}</p>
      <footer className="mt-3 flex justify-between text-xs text-slate-400">
        <span>Confidence: {(signal.confidence_score * 100).toFixed(0)}%</span>
        <span>Risk: {signal.risk_level}</span>
      </footer>
    </article>
  );
}
