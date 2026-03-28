import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { usePatterns } from "../hooks/usePatterns";
import { useSignals } from "../hooks/useSignals";

export default function StockExplorer() {
  const [searchParams] = useSearchParams();
  const [symbol, setSymbol] = useState("INFY");
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y" | "5Y">("1D");
  const { data: patterns = [] } = usePatterns(symbol);
  const { data: signals = [] } = useSignals();

  useEffect(() => {
    const paramSymbol = searchParams.get("symbol");
    if (paramSymbol) setSymbol(paramSymbol.toUpperCase());
  }, [searchParams]);

  const symbolSignals = signals.filter((s) => s.stock_symbol === symbol);
  const confidenceSeries = patterns.slice(0, 8).map((p) => Math.round(p.confidence * 100));

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[1fr_330px]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <div className="mx-auto w-full max-w-md rounded-xl border border-slate-700 bg-slate-900/80 p-3">
          <input
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Search stocks, sectors, or AI patterns..."
          />
        </div>

        <div>
          <h1 className="text-4xl font-black">{symbol}</h1>
          <p className="text-3xl font-bold">
            ₹2,984.45 <span className="text-sm text-emerald-400">+12.30 (0.41%)</span>
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="mb-3 flex gap-2 text-xs">
            {(["1D", "1W", "1M", "1Y", "5Y"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`rounded px-2 py-1 ${timeframe === tf ? "bg-indigo-500/70" : "bg-slate-800"}`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="h-[520px] rounded-lg border border-slate-800 bg-[linear-gradient(to_bottom,#0c1322,#070a12)] p-4">
            <p className="mb-4 text-xs text-slate-500">{timeframe} view · Resistance 3,120.00</p>
            <div className="h-full w-full rounded bg-[radial-gradient(circle_at_50%_90%,#22c55e30,transparent_45%)]" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
          <h3 className="mb-2 font-semibold">Signal Timeline</h3>
          {symbolSignals.length === 0 ? <p className="text-slate-500">No recent symbol-specific signals.</p> : null}
          {symbolSignals.map((s, i) => (
            <p key={`${s.signal_type}-${i}`}>• {s.signal_type} ({Math.round(s.confidence_score * 100)}%): {s.reasoning_summary}</p>
          ))}
          <div className="mt-3 flex h-20 items-end gap-1">
            {confidenceSeries.map((value, index) => (
              <div key={`${value}-${index}`} className="w-5 rounded-t bg-cyan-500" style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="mb-3 flex gap-4 border-b border-slate-800 pb-2 text-xs">
          <span className="font-semibold text-slate-200">Overview</span>
          <span className="text-slate-400">Signals</span>
          <span className="text-slate-400">Technicals</span>
          <span className="text-slate-400">Filings</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded bg-slate-800/70 p-3"><p className="text-xs text-slate-500">P/E Ratio</p><p className="text-xl font-bold">28.42</p></div>
          <div className="rounded bg-slate-800/70 p-3"><p className="text-xs text-slate-500">EPS (TTM)</p><p className="text-xl font-bold">₹105.14</p></div>
          <div className="rounded bg-slate-800/70 p-3"><p className="text-xs text-slate-500">52W High</p><p className="text-xl font-bold">3,024.90</p></div>
          <div className="rounded bg-slate-800/70 p-3"><p className="text-xs text-slate-500">52W Low</p><p className="text-xl font-bold">2,220.35</p></div>
        </div>
        <div className="mt-4 text-xs text-slate-400">Sentiment Gauge</div>
        <div className="mt-2 h-2 rounded bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400" />

        <div className="mt-5 space-y-3 text-sm">
          <p className="font-semibold">Technical Patterns</p>
          {patterns.slice(0, 2).map((p) => (
            <div key={p.pattern_name} className="rounded border border-slate-700 p-2">
              <p className="font-semibold">{p.pattern_name}</p>
              <p className="text-xs text-slate-400">Confidence {Math.round(p.confidence * 100)}%</p>
            </div>
          ))}
          <div className="rounded border border-slate-700 p-2">
            <p className="font-semibold">Corporate Filings</p>
            <p className="text-xs text-slate-400">AI summary: Revenue beat expectations by 4.2%</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
