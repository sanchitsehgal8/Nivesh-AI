import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/index";
import { Button } from "../components/ui/button";
import { LineChart, TrendingUp, Target } from "lucide-react";
import { cn } from "../lib/utils";

const portfolioHoldings = [
  { symbol: "INFY", shares: 152, avgCost: 1558.42, currentPrice: 1611.73, return: 3.42 },
  { symbol: "TCS", shares: 78, avgCost: 3842.15, currentPrice: 3921.50, return: 2.06 },
  { symbol: "WIPRO", shares: 203, avgCost: 445.30, currentPrice: 468.90, return: 5.31 },
];

function CopilotInsights() {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-green-400/30 bg-gradient-to-br from-green-500/5 to-transparent p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="relative h-2 w-2">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-400" />
            <div className="absolute inset-0.5 rounded-full bg-accent" />
          </div>
          <span className="text-xs font-semibold text-accent">Engine Online</span>
        </div>
        <p className="text-sm text-foreground">Your portfolio is well-positioned for growth with current market conditions.</p>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start text-sm font-medium text-muted-foreground">
          What should I optimize first?
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm font-medium text-muted-foreground">
          Top sector rotation opportunity?
        </Button>
        <Button variant="outline" className="w-full justify-start text-sm font-medium text-muted-foreground">
          Diversification suggestions?
        </Button>
      </div>

      <div className="rounded-xl bg-secondary/50 p-4">
        <p className="text-xs font-medium text-muted-foreground">Portfolio Health Score</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-accent" style={{ width: "84%" }} />
        </div>
        <p className="mt-2 text-sm font-semibold text-accent">84/100</p>
      </div>
    </div>
  );
}

export default function PortfolioCopilot() {
  const portfolioValue = 842150;
  const todayPnl = 12480;
  const alphaScore = 2.15;

  return (
    <DashboardLayout rightPanel={<CopilotInsights />}>
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Portfolio Value", value: `₹${portfolioValue.toLocaleString()}`, change: "+5.2%" },
            { label: "Today P&L", value: `₹${todayPnl.toLocaleString()}`, change: "+12.4%", changePositive: true },
            { label: "Alpha Score", value: alphaScore.toFixed(2), change: "+0.15", changePositive: true },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 card-shadow">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <span className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold",
                  stat.changePositive
                    ? "bg-success-light text-success"
                    : "bg-warning/10 text-warning"
                )}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Gauge */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
            <Target className="h-5 w-5 text-accent" />
            Risk Profile
          </h3>
          <div className="flex items-end justify-between gap-4">
            <div className="h-48">
              <svg viewBox="0 0 200 200" className="h-full w-auto">
                <defs>
                  <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(134, 65%, 49%)" />
                    <stop offset="50%" stopColor="hsl(45, 93%, 47%)" />
                    <stop offset="100%" stopColor="hsl(0, 84%, 60%)" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="90" fill="transparent" stroke="hsl(var(--secondary))" strokeWidth="4" />
                <circle cx="100" cy="100" r="90" fill="transparent" stroke="url(#gaugeGrad)" strokeWidth="4" strokeDasharray="141 282" strokeDashoffset="-70.5" rotation="-90" style={{ transformOrigin: "100px 100px" }} />
                <circle cx="100" cy="100" r="75" fill="hsl(var(--card))" />
                <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-2xl font-bold fill-foreground">
                  MEDIUM
                </text>
                <text x="100" y="125" textAnchor="middle" dy="0.3em" className="text-xs fill-muted-foreground">
                  Beta: 0.95
                </text>
              </svg>
            </div>

            <div className="flex-1 space-y-3">
              {[
                { label: "Portfolio Beta", value: "0.95", color: "success" },
                { label: "Concentration", value: "28%", color: "warning" },
                { label: "Volatility", value: "18.2%", color: "warning" },
                { label: "Sharpe Ratio", value: "1.64", color: "success" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      item.color === "success" ? "bg-success" : "bg-warning"
                    )} />
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
            <LineChart className="h-5 w-5 text-accent" />
            Holdings
          </h3>
          <div className="space-y-3">
            {portfolioHoldings.map((holding) => (
              <div key={holding.symbol} className="rounded-xl bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{holding.symbol}</p>
                      <span className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold",
                        holding.return > 0
                          ? "bg-success-light text-success"
                          : "bg-destructive/10 text-destructive"
                      )}>
                        +{holding.return}%
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {holding.shares} shares @ ₹{holding.avgCost.toFixed(2)} avg
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-bold text-foreground">₹{holding.currentPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{(holding.shares * holding.currentPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-6 text-lg font-bold text-foreground">Performance</h3>
          <div className="flex h-64 items-end gap-1">
            {Array.from({ length: 60 }).map((_, i) => {
              const height = 20 + Math.random() * 60;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-accent/60"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <span>1M ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
