import { useEffect } from "react";

import { SignalCard } from "../components/SignalCard";
import { SectorRotationChart } from "../components/SectorRotationChart";
import { useSignals } from "../hooks/useSignals";
import { useAppStore } from "../store/useAppStore";

export default function Dashboard() {
  const { data, isLoading } = useSignals();
  const setSignals = useAppStore((s) => s.setSignals);

  useEffect(() => {
    if (data) setSignals(data);
  }, [data, setSignals]);

  return (
    <main className="space-y-6 p-6 text-slate-100">
      <section>
        <h1 className="text-2xl font-semibold">Nivesh AI Dashboard</h1>
        <p className="text-sm text-slate-400">Real-time signals, portfolio health, and market context.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">Portfolio P&amp;L summary card</div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">Win-rate and confidence trend card</div>
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">Market breadth card</div>
      </section>

      <SectorRotationChart />

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Latest Opportunity Signals</h2>
        {isLoading && <p className="text-slate-400">Loading signals...</p>}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).slice(0, 6).map((signal) => (
            <SignalCard key={`${signal.stock_symbol}-${signal.signal_type}`} signal={signal} />
          ))}
        </div>
      </section>
    </main>
  );
}
