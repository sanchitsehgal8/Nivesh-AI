import { useMemo, useState } from "react";

import { SignalCard } from "../components/SignalCard";
import { useSignals } from "../hooks/useSignals";

export default function OpportunityRadar() {
  const { data = [] } = useSignals();
  const [riskFilter, setRiskFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const filtered = useMemo(
    () => data.filter((s) => (riskFilter === "all" ? true : s.risk_level === riskFilter)),
    [data, riskFilter],
  );

  return (
    <main className="space-y-4 p-6 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Opportunity Radar</h1>
        <select
          className="rounded bg-slate-800 px-3 py-2 text-sm"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as "all" | "low" | "medium" | "high")}
        >
          <option value="all">All Risk</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((signal) => (
          <SignalCard key={`${signal.stock_symbol}-${signal.signal_type}-${signal.confidence_score}`} signal={signal} />
        ))}
      </div>
    </main>
  );
}
