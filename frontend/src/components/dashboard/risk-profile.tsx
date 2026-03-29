"use client"

import { cn } from "../../lib/utils"

const riskMetrics = [
  { label: "Portfolio Beta", value: "1.12", status: "moderate" },
  { label: "Concentration", value: "34%", status: "low" },
  { label: "Volatility", value: "18.4%", status: "moderate" },
  { label: "Sharpe Ratio", value: "1.84", status: "good" },
]

const statusColors = {
  low: "bg-success",
  moderate: "bg-warning", 
  good: "bg-accent",
  high: "bg-destructive",
}

export function RiskProfile() {
  return (
    <div className="rounded-3xl border-0 bg-card card-shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Risk Profile</h3>
          <p className="text-sm text-muted-foreground">Portfolio risk assessment</p>
        </div>
        <span className="rounded-lg bg-success/20 px-3 py-1.5 text-sm font-medium text-success">
          Healthy
        </span>
      </div>
      
      {/* Risk Gauge */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative h-24 w-48">
          {/* Gauge Background */}
          <svg className="h-full w-full" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--success)" />
                <stop offset="50%" stopColor="var(--warning)" />
                <stop offset="100%" stopColor="var(--destructive)" />
              </linearGradient>
            </defs>
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="125.6"
            />
            {/* Needle */}
            <line
              x1="100"
              y1="90"
              x2="60"
              y2="50"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-foreground"
            />
            <circle cx="100" cy="90" r="6" className="fill-foreground" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 text-center">
            <span className="text-lg font-bold text-foreground">Low-Medium</span>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {riskMetrics.map((metric) => (
          <div 
            key={metric.label}
            className="rounded-xl bg-secondary/50 p-3"
          >
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">{metric.value}</span>
              <span className={cn(
                "h-2 w-2 rounded-full",
                statusColors[metric.status as keyof typeof statusColors]
              )} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
