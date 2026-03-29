import { useEffect } from "react";
import { DashboardLayout } from "../components/dashboard/index";
import { StatsCards } from "../components/dashboard/stats-cards";
import { SignalFeed } from "../components/dashboard/signal-feed";
import { SectorRotation } from "../components/dashboard/sector-rotation";
import { PatternIntelligence } from "../components/dashboard/pattern-intelligence";
import { RiskProfile } from "../components/dashboard/risk-profile";
import { CopilotPanel } from "../components/dashboard/copilot-panel";
import { useSignals } from "../hooks/useSignals";
import { useAppStore } from "../store/useAppStore";

export default function Dashboard() {
  const { data } = useSignals();
  const setSignals = useAppStore((s) => s.setSignals);
  const signals = data ?? [];

  useEffect(() => {
    if (data) setSignals(data);
  }, [data, setSignals]);

  return (
    <DashboardLayout rightPanel={<CopilotPanel />}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Payments Updates
          </p>
        </div>

        {/* Stats Row */}
        <StatsCards />

        {/* Main Grid - 2 columns on larger screens */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left column - takes more space */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            <SignalFeed />
            <PatternIntelligence />
          </div>
          
          {/* Right column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <SectorRotation />
            <RiskProfile />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
