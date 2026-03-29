import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/index";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

const timeframes = ["1D", "1W", "1M", "1Y", "5Y"];

const technicalPatterns = [
  { name: "Bullish MACD Crossover", confidence: 78 },
  { name: "Volume-backed Breakout", confidence: 74 },
];

function StockDetailPanel() {
  return (
    <div className="space-y-5">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-secondary p-1">
          <TabsTrigger value="overview" className="rounded-lg text-xs">Overview</TabsTrigger>
          <TabsTrigger value="signals" className="rounded-lg text-xs">Signals</TabsTrigger>
          <TabsTrigger value="technicals" className="rounded-lg text-xs">Technicals</TabsTrigger>
          <TabsTrigger value="filings" className="rounded-lg text-xs">Filings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "P/E Ratio", value: "28.42" },
              { label: "EPS (TTM)", value: "₹105.14" },
              { label: "52W High", value: "3,024.90" },
              { label: "52W Low", value: "2,220.35" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Sentiment Gauge */}
          <div className="rounded-xl bg-secondary/50 p-4">
            <p className="text-xs font-medium text-muted-foreground">Sentiment Gauge</p>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{
                  width: "75%",
                  background: "linear-gradient(90deg, var(--destructive) 0%, var(--warning) 50%, var(--success) 100%)",
                }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="signals" className="mt-5">
          <div className="space-y-3">
            {technicalPatterns.map((pattern) => (
              <div
                key={pattern.name}
                className="flex items-center justify-between rounded-xl bg-secondary/50 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{pattern.name}</p>
                  <p className="text-xs text-muted-foreground">Active signal</p>
                </div>
                <span className="rounded-lg bg-accent/20 px-2.5 py-1 text-sm font-semibold text-accent">
                  {pattern.confidence}%
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technicals" className="mt-5">
          <div className="rounded-xl bg-secondary/50 p-4 text-center">
            <p className="text-sm text-muted-foreground">Technical analysis coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="filings" className="mt-5">
          <div className="rounded-xl bg-secondary/50 p-4">
            <p className="font-medium text-foreground">Corporate Filings</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Revenue beat expectations by 4.2%
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StockExplorer() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [searchQuery, setSearchQuery] = useState("INFY");
  const isPositive = false;

  return (
    <DashboardLayout rightPanel={<StockDetailPanel />}>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stocks..."
            className="h-12 rounded-xl border-border bg-card pl-11 text-base"
          />
        </div>

        {/* Stock Info */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">INFY</h1>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-2xl font-semibold text-foreground">₹1,611.73</span>
              <span className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium",
                isPositive ? "bg-success-light text-success" : "bg-destructive/10 text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                -0.45 (-0.03%)
              </span>
            </div>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={cn(
                "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                selectedTimeframe === tf
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Area */}
        <div className="rounded-2xl border border-border bg-card p-5 card-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedTimeframe} view
            </p>
            <span className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              Resistance: 3,120.00
            </span>
          </div>
          <div className="mt-6 h-72 w-full">
            {/* Placeholder chart with cleaner bars */}
            <div className="flex h-full items-end gap-0.5">
              {Array.from({ length: 80 }).map((_, i) => {
                const height = 25 + Math.random() * 55;
                const isGreen = Math.random() > 0.45;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm transition-all",
                      isGreen ? "bg-success/80" : "bg-destructive/80"
                    )}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
