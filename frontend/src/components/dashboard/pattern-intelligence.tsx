"use client"

import { cn } from "../../lib/utils"
import { TrendingUp, Activity, BarChart3 } from "lucide-react"

interface Pattern {
  stock: string
  pattern: string
  confidence: number
  icon: React.ReactNode
}

const patterns: Pattern[] = [
  { stock: "TITAN", pattern: "Cup & Handle", confidence: 82, icon: <Activity className="h-4 w-4" /> },
  { stock: "RELIANCE", pattern: "Bull Flag", confidence: 88, icon: <TrendingUp className="h-4 w-4" /> },
  { stock: "INFY", pattern: "MACD Crossover", confidence: 72, icon: <BarChart3 className="h-4 w-4" /> },
]

export function PatternIntelligence() {
  return (
    <div className="rounded-3xl border-0 bg-card card-shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pattern Intelligence</h3>
          <p className="text-sm text-muted-foreground">Technical pattern detection</p>
        </div>
      </div>
      
      <div className="mt-5 space-y-3">
        {patterns.map((pattern) => (
          <div
            key={pattern.stock}
            className="group flex items-center justify-between rounded-2xl bg-secondary/50 p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-muted-foreground group-hover:text-foreground">
                {pattern.icon}
              </div>
              <div>
                <p className="font-medium text-foreground">{pattern.stock}</p>
                <p className="text-sm text-muted-foreground">{pattern.pattern}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-20 overflow-hidden rounded-full bg-secondary">
                <div 
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${pattern.confidence}%` }}
                />
              </div>
              <span className="w-12 text-right font-semibold text-accent">
                {pattern.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
