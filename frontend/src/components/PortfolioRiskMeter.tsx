export function PortfolioRiskMeter({ riskBand }: { riskBand: "low" | "medium" | "high" }) {
  const color = riskBand === "low" ? "bg-emerald-500" : riskBand === "medium" ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
      <p className="mb-2 text-sm text-slate-300">Portfolio Risk</p>
      <div className="h-3 w-full rounded-full bg-slate-700">
        <div className={`h-3 rounded-full ${color} ${riskBand === "low" ? "w-1/3" : riskBand === "medium" ? "w-2/3" : "w-full"}`} />
      </div>
    </div>
  );
}
