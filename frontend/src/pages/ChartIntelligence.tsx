import { useState } from "react";

import { PatternOverlay } from "../components/PatternOverlay";
import { usePatterns } from "../hooks/usePatterns";

export default function ChartIntelligence() {
  const [symbol, setSymbol] = useState("INFY");
  const { data = [], isLoading } = usePatterns(symbol);

  return (
    <main className="space-y-4 p-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-5xl font-black tracking-tight">Chart Pattern Intelligence</h1>
            <p className="text-sm text-slate-400">● Scanning 1,847 NSE stocks</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button className="rounded bg-slate-800 px-3 py-2">15M</button>
            <button className="rounded bg-slate-800 px-3 py-2">1H</button>
            <button className="rounded bg-slate-800 px-3 py-2">4H</button>
            <button className="rounded bg-slate-800 px-3 py-2">1D</button>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <PatternOverlay patterns={data.map((p) => ({ pattern_name: p.pattern_name, confidence: p.confidence }))} />

        {isLoading ? (
          <p className="text-slate-400">Scanning patterns...</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-300">
                <tr>
                  <th className="px-3 py-2">Stock</th>
                  <th className="px-3 py-2">Pattern</th>
                  <th className="px-3 py-2">Confidence</th>
                  <th className="px-3 py-2">Win % / Trend</th>
                  <th className="px-3 py-2">Avg Return</th>
                  <th className="px-3 py-2">Timeframe</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((pattern, i) => (
                  <tr key={`${pattern.pattern_name}-${pattern.detected_at}`} className="border-t border-slate-800 bg-slate-900/60">
                    <td className="px-3 py-2 font-semibold">{["RELIANCE", "HDFCBANK", "INFY", "TATASTEEL", "TITAN"][i] ?? symbol}</td>
                    <td className="px-3 py-2">{pattern.pattern_name}</td>
                    <td className="px-3 py-2">{(pattern.confidence * 100).toFixed(0)}% Match</td>
                    <td className="px-3 py-2">{(pattern.backtest_success_rate * 100).toFixed(1)}%</td>
                    <td className="px-3 py-2 text-emerald-400">+{(pattern.backtest_success_rate * 6.5).toFixed(1)}%</td>
                    <td className="px-3 py-2">{pattern.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="mb-2 text-2xl font-bold">RELIANCE <span className="text-xs text-emerald-400">BULLISH FLAG</span></h2>
          <div className="h-72 rounded-lg bg-[linear-gradient(to_bottom,#0b1220,#05080f)] p-4">
            <div className="h-full w-full rounded border border-emerald-500/20 bg-[radial-gradient(circle_at_30%_40%,#14532d33,transparent_45%)]" />
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h3 className="mb-3 text-sm font-semibold tracking-widest text-slate-300">AI PATTERN THESIS</h3>
          <p className="rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-sm text-slate-300">
            RELIANCE formed a textbook Bullish Flag after a 12% impulse move. Volume profile suggests weakening sell pressure.
            Confirmation above resistance may unlock continuation.
          </p>
          <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
            <div className="rounded-lg bg-slate-950/80 p-3">
              <p className="text-xs text-slate-500">Historical Win Rate</p>
              <p className="text-2xl font-bold text-emerald-400">72.4%</p>
            </div>
            <div className="rounded-lg bg-slate-950/80 p-3">
              <p className="text-xs text-slate-500">Avg Gain/Loss</p>
              <p className="text-2xl font-bold">3.8:1</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
