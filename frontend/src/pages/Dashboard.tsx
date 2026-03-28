import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { SignalCard } from "../components/SignalCard";
import { SectorRotationChart } from "../components/SectorRotationChart";
import { useSignals } from "../hooks/useSignals";
import { useAppStore } from "../store/useAppStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useSignals();
  const setSignals = useAppStore((s) => s.setSignals);
  const signals = data ?? [];

  const avgConfidence = signals.length
    ? signals.reduce((sum, s) => sum + s.confidence_score, 0) / signals.length
    : 0;
  const lowRiskCount = signals.filter((s) => s.risk_level === "low").length;
  const highRiskCount = signals.filter((s) => s.risk_level === "high").length;

  const sectors = [
    { name: "IT", score: 6.8 + avgConfidence * 2 },
    { name: "Financials", score: 6.1 + lowRiskCount * 0.2 },
    { name: "Energy", score: 5.9 + signals.length * 0.1 },
    { name: "Auto", score: 5.4 + Math.max(0, 2 - highRiskCount) * 0.2 },
  ];

  useEffect(() => {
    if (data) setSignals(data);
  }, [data, setSignals]);

  return (
    <main className="grid gap-4 p-4 lg:grid-cols-[1fr_300px]">
      <section className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Portfolio Value</p>
            <p className="mt-2 text-3xl font-bold">₹14,82,340</p>
            <p className="text-sm text-emerald-400">+₹23,410 today</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Active Signals</p>
            <p className="mt-2 text-3xl font-bold">{signals.length || 14}</p>
            <p className="text-xs text-slate-400">{lowRiskCount} bullish · {highRiskCount} bearish</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-slate-900/70 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Top Opportunity</p>
            <p className="mt-2 text-2xl font-bold">HDFC BANK</p>
            <p className="text-sm text-amber-300">Confidence: {(avgConfidence * 100 || 94).toFixed(0)}%</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-widest text-slate-300">LIVE SIGNAL FEED</h2>
              <span className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">ALL</span>
            </div>
            {isLoading && <p className="text-slate-400">Loading signals...</p>}
            <div className="space-y-3">
              {signals.slice(0, 3).map((signal) => (
                <SignalCard key={`${signal.stock_symbol}-${signal.signal_type}`} signal={signal} />
              ))}
            </div>
          </div>

          <SectorRotationChart sectors={sectors} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-widest text-slate-300">PATTERN INTELLIGENCE</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>TITAN — Cup &amp; Handle — <span className="text-emerald-400">82%</span></p>
              <p>RELIANCE — Bull Flag — <span className="text-emerald-400">88%</span></p>
              <p>INFY — MACD Crossover — <span className="text-amber-300">72%</span></p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-widest text-slate-300">RISK PROFILE</h3>
            <div className="h-32 rounded-lg bg-gradient-to-r from-slate-800 via-slate-700 to-amber-400/80" />
          </div>
        </div>
      </section>

      <aside className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-xl font-semibold">AI Copilot</h2>
        <p className="mb-4 text-xs text-slate-400">Contextual intelligence</p>
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div className="mb-2 h-36 rounded-lg bg-[radial-gradient(circle_at_top,_#334155,_#020617)]" />
          <p className="text-sm font-semibold">Morning Update</p>
          <p className="text-xs text-slate-400">Post-Policy Market Strategy &amp; Support Levels</p>
        </div>
        <div className="mb-4 space-y-2 text-xs">
          <button
            onClick={() => navigate("/chat?query=What%20changed%20in%20my%20portfolio%20today%3F")}
            className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left"
          >
            What changed?
          </button>
          <button
            onClick={() => navigate("/chat?query=Which%20stock%20has%20the%20top%20breakout%20signal%20today%3F")}
            className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left"
          >
            Top breakout?
          </button>
          <button
            onClick={() => navigate("/chat?query=Should%20I%20book%20profits%20on%20my%20top%20winner%3F")}
            className="w-full rounded-lg border border-slate-700 px-3 py-2 text-left"
          >
            Should I book profits?
          </button>
        </div>
        <div className="mt-20 rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-sm text-slate-400">Ask Nivesh AI...</div>
      </aside>
    </main>
  );
}
