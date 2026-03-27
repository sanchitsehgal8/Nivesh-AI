import { useState } from "react";

import { PatternOverlay } from "../components/PatternOverlay";
import { usePatterns } from "../hooks/usePatterns";

export default function ChartIntelligence() {
  const [symbol, setSymbol] = useState("INFY");
  const { data = [], isLoading } = usePatterns(symbol);

  return (
    <main className="space-y-5 p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">Chart Intelligence</h1>
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

      <PatternOverlay />

      {isLoading ? (
        <p className="text-slate-400">Scanning patterns...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="px-3 py-2">Pattern</th>
                <th className="px-3 py-2">Timeframe</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Backtest Success</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pattern) => (
                <tr key={`${pattern.pattern_name}-${pattern.detected_at}`} className="border-t border-slate-800">
                  <td className="px-3 py-2">{pattern.pattern_name}</td>
                  <td className="px-3 py-2">{pattern.timeframe}</td>
                  <td className="px-3 py-2">{(pattern.confidence * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2">
                    <div className="h-2 w-32 rounded bg-slate-700">
                      <div
                        className="h-2 rounded bg-cyan-500"
                        style={{ width: `${Math.round(pattern.backtest_success_rate * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
