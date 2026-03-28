import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient } from "../api/client";
import { useSignals } from "../hooks/useSignals";

export default function OpportunityRadar() {
  const navigate = useNavigate();
  const { data = [] } = useSignals();
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "insider_buy" | "bulk_deal" | "earnings_surprise" | "regulatory_change">("all");
  const [selected, setSelected] = useState(0);
  const [tradeStatus, setTradeStatus] = useState<string>("");

  const filtered = useMemo(
    () =>
      data.filter((s) => {
        const passRisk = riskFilter === "all" ? true : s.risk_level === riskFilter;
        const passType = typeFilter === "all" ? true : s.signal_type === typeFilter;
        return passRisk && passType;
      }),
    [data, riskFilter, typeFilter],
  );

  const focused = filtered[selected] ?? filtered[0];

  const executeTrade = async () => {
    if (!focused) return;
    try {
      const { data: order } = await apiClient.post<{ order_id: string; message: string }>("/trades/execute", {
        symbol: focused.stock_symbol,
        side: "buy",
        quantity: 10,
        user_id: "00000000-0000-0000-0000-000000000001",
      });
      setTradeStatus(`${order.message} (${order.order_id})`);
    } catch {
      setTradeStatus("Trade request failed. Please retry.");
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[1fr_290px]">
      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-black tracking-tight">OPPORTUNITY RADAR</h1>
            <p className="text-sm text-slate-400">● {filtered.length || 14} signals detected across 847 stocks</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as "all" | "insider_buy" | "bulk_deal" | "earnings_surprise" | "regulatory_change")
              }
            >
              <option value="all">Signal Type</option>
              <option value="insider_buy">Insider Buy</option>
              <option value="bulk_deal">Bulk Deal</option>
              <option value="earnings_surprise">Earnings</option>
              <option value="regulatory_change">Regulatory</option>
            </select>
            <select
              className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as "all" | "low" | "medium" | "high")}
            >
              <option value="all">Risk Level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.slice(0, 4).map((signal, idx) => (
            <article
              key={`${signal.stock_symbol}-${signal.signal_type}-${idx}`}
              onClick={() => setSelected(idx)}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                idx === selected ? "border-emerald-400/40 bg-emerald-500/5" : "border-slate-800 bg-slate-900/60"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-bold">{signal.stock_symbol}</h3>
                <span className="text-sm font-semibold text-emerald-300">₹{(2847 - idx * 705).toLocaleString("en-IN")}</span>
              </div>
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-400">{signal.signal_type.replace("_", " ")}</p>
              <p className="mb-4 text-sm text-slate-200">{signal.reasoning_summary}</p>
              <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className="font-semibold">{Math.round(signal.confidence_score * 100)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Risk</p>
                  <p className="font-semibold uppercase">{signal.risk_level}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-2xl font-bold">{focused?.stock_symbol ?? "RELIANCE"} INDUSTRIES</h2>
        <p className="text-xs text-slate-400">RELIANCE.NSE</p>
        <p className="mt-3 text-4xl font-black">₹2,847.00</p>
        <p className="text-sm text-emerald-400">+₹34.50 (1.24%) today</p>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">
          <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">AI Synthesis</p>
          <p>
            “Recent insider acquisition by primary promoter at ₹2,800 forms strong mean-reversion support with improving upside odds.”
          </p>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <p className="font-semibold">Signal Timeline</p>
          <p className="text-slate-400">• Insider Buy Reported</p>
          <p className="text-slate-400">• Resistance Breakout (H1)</p>
          <p className="text-slate-400">• Accumulation Phase Start</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate(`/stock-explorer?symbol=${encodeURIComponent((focused?.stock_symbol ?? "RELIANCE").toUpperCase())}`)}
            className="rounded-lg bg-slate-700 px-3 py-2 text-sm"
          >
            View Charts
          </button>
          <button onClick={executeTrade} className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">
            Execute Trade
          </button>
        </div>
        {tradeStatus ? <p className="mt-3 text-xs text-emerald-300">{tradeStatus}</p> : null}
      </aside>
    </main>
  );
}
