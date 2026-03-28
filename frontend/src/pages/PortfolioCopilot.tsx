import { PortfolioRiskMeter } from "../components/PortfolioRiskMeter";
import { PerformanceChart } from "../components/charts/PerformanceChart";
import { usePortfolio } from "../hooks/usePortfolio";

const SAMPLE_PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

export default function PortfolioCopilot() {
  const { data, isLoading } = usePortfolio(SAMPLE_PORTFOLIO_ID);

  if (isLoading) {
    return <main className="p-6 text-slate-300">Loading portfolio analysis...</main>;
  }

  const holdings = data?.holdings ?? [];
  const riskBand = data?.risk_band ?? "medium";
  const totalPnl = holdings.reduce((sum, h) => sum + h.quantity * (Math.random() * 120 - 30), 0);
  const perfSeries = Array.from({ length: 40 }).map((_, i) => 100 + Math.sin(i / 4) * 8 + i * 0.35);

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Total Value</p>
            <p className="text-3xl font-black">₹14,82,340</p>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Today P&amp;L</p>
            <p className="text-3xl font-black text-emerald-400">+₹23,410</p>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Alpha Score</p>
            <p className="text-3xl font-black">18.4%</p>
          </div>
        </div>

        <PortfolioRiskMeter riskBand={riskBand} />

        <section className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-300">
              <tr>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">LTP</th>
                <th className="px-3 py-2">P&amp;L</th>
                <th className="px-3 py-2">Signals</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => {
                const pnl = Math.round(h.quantity * (Math.random() * 120 - 30));
                return (
                  <tr key={h.symbol} className="border-t border-slate-800">
                    <td className="px-3 py-2 font-semibold">{h.symbol}</td>
                    <td className="px-3 py-2">{h.quantity}</td>
                    <td className="px-3 py-2">₹{(h.avg_buy_price + 58).toFixed(2)}</td>
                    <td className={`px-3 py-2 font-semibold ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {pnl >= 0 ? "+" : ""}₹{Math.abs(pnl).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2">{["●", "●", "●", "●"][i % 4]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="mb-2 text-lg font-semibold">Performance Intelligence</h3>
          <div className="h-44 rounded-lg overflow-hidden">
            <PerformanceChart values={perfSeries} />
          </div>
          <p className="mt-2 text-sm text-slate-400">Net P&amp;L estimate: <span className={`${totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{totalPnl >= 0 ? "+" : ""}₹{Math.abs(totalPnl).toFixed(0)}</span></p>
        </section>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="mb-2 text-xl font-bold">AI Copilot</h2>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">Risk: You are over-exposed to BFSI by 12%. Reduce HDFC BANK to improve diversification.</div>
          <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3">Suggestion: Add IT exposure to balance rate-sensitive holdings.</div>
          <div className="h-48 rounded-lg bg-[radial-gradient(circle_at_top,#0f172a,#020617)]" />
        </div>
      </aside>
    </main>
  );
}
