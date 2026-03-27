import { useState } from "react";

import { usePatterns } from "../hooks/usePatterns";
import { useSignals } from "../hooks/useSignals";

export default function StockExplorer() {
  const [symbol, setSymbol] = useState("INFY");
  const { data: patterns = [] } = usePatterns(symbol);
  const { data: signals = [] } = useSignals();

  const symbolSignals = signals.filter((s) => s.stock_symbol === symbol);

  return (
    <main className="space-y-5 p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">Stock Explorer</h1>
      <div className="flex items-center gap-3">
        <label htmlFor="symbol" className="text-sm text-slate-300">
          NSE Symbol
        </label>
        <input
          id="symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          className="rounded bg-slate-800 px-3 py-2"
        />
      </div>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
        TradingView Lightweight Chart area (wire real chart component here).
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="mb-2 font-medium">Detected Patterns</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {patterns.map((p) => (
              <li key={`${p.pattern_name}-${p.detected_at}`}>• {p.pattern_name}: {p.plain_english_summary}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="mb-2 font-medium">Signal & Sentiment Timeline</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {symbolSignals.map((s, i) => (
              <li key={`${s.signal_type}-${i}`}>• {s.signal_type} ({Math.round(s.confidence_score * 100)}%): {s.reasoning_summary}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
