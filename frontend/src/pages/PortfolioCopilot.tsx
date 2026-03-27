import { PortfolioRiskMeter } from "../components/PortfolioRiskMeter";
import { usePortfolio } from "../hooks/usePortfolio";

const SAMPLE_PORTFOLIO_ID = "00000000-0000-0000-0000-000000000001";

export default function PortfolioCopilot() {
  const { data, isLoading } = usePortfolio(SAMPLE_PORTFOLIO_ID);

  if (isLoading) {
    return <main className="p-6 text-slate-300">Loading portfolio analysis...</main>;
  }

  const holdings = data?.holdings ?? [];
  const riskBand = (data as { risk_band?: "low" | "medium" | "high" } | undefined)?.risk_band ?? "medium";

  return (
    <main className="space-y-5 p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">Portfolio Copilot</h1>

      <PortfolioRiskMeter riskBand={riskBand} />

      <section className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800 text-slate-200">
            <tr>
              <th className="px-3 py-2">Symbol</th>
              <th className="px-3 py-2">Quantity</th>
              <th className="px-3 py-2">Avg Buy Price</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.symbol} className="border-t border-slate-800">
                <td className="px-3 py-2">{h.symbol}</td>
                <td className="px-3 py-2">{h.quantity}</td>
                <td className="px-3 py-2">₹{h.avg_buy_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
        AI suggestions panel: diversify concentration above 30%, reduce high-beta overlap, and monitor near-term downside risk signals.
      </section>
    </main>
  );
}
