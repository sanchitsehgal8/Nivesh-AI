import { PortfolioRiskMeter } from "../components/PortfolioRiskMeter";
import { PerformanceChart } from "../components/charts/PerformanceChart";
import { usePortfolio } from "../hooks/usePortfolio";
import { usePortfolioPerformance } from "../hooks/usePortfolioPerformance";

const SAMPLE_PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

export default function PortfolioCopilot() {
  const { data, isLoading } = usePortfolio(SAMPLE_PORTFOLIO_ID);
  const holdings = data?.holdings ?? [];
  const { perfSeries, latestPriceBySymbol, totalValue, totalPnl, todayPnl, dataSource, isLoading: perfLoading } =
    usePortfolioPerformance(holdings);

  if (isLoading) {
    return <main className="p-6 text-slate-300">Loading portfolio analysis...</main>;
  }

  const riskBand = data?.risk_band ?? "medium";

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[1fr_320px]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Total Value</p>
            <p className="text-3xl font-black">₹{Math.round(totalValue).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Today P&amp;L</p>
            <p className={`text-3xl font-black ${todayPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {todayPnl >= 0 ? "+" : "-"}₹{Math.round(Math.abs(todayPnl)).toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-lg bg-slate-900/70 p-3">
            <p className="text-xs text-slate-500">Alpha Score</p>
            <p className="text-3xl font-black">{((perfSeries[perfSeries.length - 1] ?? 100) - 100).toFixed(1)}%</p>
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
                const ltp = latestPriceBySymbol[h.symbol.toUpperCase()] ?? h.avg_buy_price;
                const pnl = Math.round(h.quantity * (ltp - h.avg_buy_price));
                return (
                  <tr key={h.symbol} className="border-t border-slate-800">
                    <td className="px-3 py-2 font-semibold">{h.symbol}</td>
                    <td className="px-3 py-2">{h.quantity}</td>
                    <td className="px-3 py-2">₹{ltp.toFixed(2)}</td>
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
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Intelligence</h3>
            <span className={`rounded px-2 py-1 text-xs ${dataSource === "live" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
              {dataSource === "live" ? "Live market data" : "Fallback sample data"}
            </span>
          </div>
          <div className="h-44 rounded-lg overflow-hidden">
            <PerformanceChart values={perfSeries} />
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Net P&amp;L estimate: <span className={`${totalPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{totalPnl >= 0 ? "+" : ""}₹{Math.abs(totalPnl).toFixed(0)}</span>
            {perfLoading ? <span className="ml-2 text-xs text-slate-500">(refreshing market data...)</span> : null}
          </p>
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
