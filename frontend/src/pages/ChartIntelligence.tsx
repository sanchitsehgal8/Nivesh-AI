import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../components/dashboard/index";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";
import { Search, TrendingUp, BarChart3 } from "lucide-react";
import { useOhlcv } from "../hooks/useOhlcv";
import { usePatterns } from "../hooks/usePatterns";

interface PatternMatch {
  stock: string;
  pattern: string;
  confidence: number;
  winRate: number;
  avgReturn: string;
  timeframe: string;
}

const patternMatches: PatternMatch[] = [
  {
    stock: "RELIANCE",
    pattern: "Bullish MACD Crossover",
    confidence: 78,
    winRate: 66.0,
    avgReturn: "+4.3%",
    timeframe: "1D",
  },
  {
    stock: "HDFCBANK",
    pattern: "Volume-backed Breakout",
    confidence: 74,
    winRate: 63.0,
    avgReturn: "+4.1%",
    timeframe: "1D",
  },
];

const timeframes = ["15M", "1H", "4H", "1D"];

function PatternThesisPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Pattern Thesis
        </h3>
      </div>
      
      <div className="rounded-2xl bg-secondary/70 p-4">
        <p className="text-sm leading-relaxed text-foreground">
          RELIANCE formed a textbook Bullish Flag after a 12% impulse move. Volume profile
          suggests weakening sell pressure. Confirmation above resistance may unlock
          continuation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-success-light p-4">
          <p className="text-xs text-muted-foreground">Historical Win Rate</p>
          <p className="mt-1 text-2xl font-bold text-success">72.4%</p>
        </div>
        <div className="rounded-xl bg-secondary/50 p-4">
          <p className="text-xs text-muted-foreground">Avg Gain/Loss</p>
          <p className="mt-1 text-2xl font-bold text-foreground">3.8:1</p>
        </div>
      </div>
    </div>
  );
}

export default function ChartIntelligence() {
  const [searchParams] = useSearchParams();
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState(searchParams.get("stock") || "RELIANCE");
  const { data: patterns = [] } = usePatterns(selectedStock);

  return (
    <DashboardLayout rightPanel={<PatternThesisPanel />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Chart Pattern Intelligence
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Scanning 1,847 NSE stocks
            </p>
          </div>
          <div className="flex items-center gap-2">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  selectedTimeframe === tf
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {tf}
              </button>
            ))}
            <div className="relative ml-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 rounded-xl border-border pl-9"
              />
            </div>
          </div>
        </div>

        {/* Pattern Summary */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            Bullish MACD Crossover (78%)
          </Badge>
          <Badge variant="secondary" className="rounded-lg px-3 py-1.5 text-xs">
            <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
            Volume-backed Breakout (74%)
          </Badge>
        </div>

        {/* Pattern Table */}
        <div className="rounded-2xl border border-border bg-card card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Stock
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Pattern
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Confidence
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Win Rate
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Avg Return
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Timeframe
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {patternMatches.map((match) => (
                  <tr
                    key={match.stock}
                    onClick={() => setSelectedStock(match.stock)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-secondary/50",
                      selectedStock === match.stock && "bg-secondary/70"
                    )}
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {match.stock}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{match.pattern}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-accent/20 px-2 py-1 text-xs font-medium text-accent">
                        {match.confidence}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{match.winRate}%</td>
                    <td className="px-5 py-4 font-medium text-success">
                      {match.avgReturn}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{match.timeframe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 card-shadow">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">{selectedStock}</h3>
            <Badge className="rounded-lg bg-success-light text-success">
              BULLISH FLAG
            </Badge>
          </div>
          <div className="mt-5 h-64 w-full">
            {/* Chart placeholder with cleaner bars */}
            <div className="flex h-full items-end gap-0.5">
              {Array.from({ length: 60 }).map((_, i) => {
                const height = 20 + Math.random() * 60;
                const isGreen = Math.random() > 0.45;
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-sm",
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
