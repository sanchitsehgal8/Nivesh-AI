"use client"

import { cn } from "../../lib/utils"

interface Sector {
  name: string
  score: number
  change: string
  isPositive: boolean
}

const sectors: Sector[] = [
  { name: "Information Technology", score: 8.4, change: "+2.3%", isPositive: true },
  { name: "Financials", score: 6.3, change: "+1.1%", isPositive: true },
  { name: "Energy", score: 6.1, change: "+0.8%", isPositive: true },
  { name: "Auto", score: 5.8, change: "-0.4%", isPositive: false },
]

export function SectorRotation() {
  return (
    <div className="rounded-3xl border-0 bg-card card-shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Sector Rotation</h3>
          <p className="text-sm text-muted-foreground">Momentum snapshot</p>
        </div>
        <select className="rounded-lg border-none bg-secondary px-3 py-2 text-sm font-medium text-foreground outline-none">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      
      <div className="mt-5 space-y-4">
        {sectors.map((sector, index) => (
          <div key={sector.name} className="group">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="font-medium text-foreground">{sector.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-xs font-medium",
                  sector.isPositive ? "text-success" : "text-destructive"
                )}>
                  {sector.change}
                </span>
                <span className="w-8 text-right font-semibold text-foreground">
                  {sector.score}
                </span>
              </div>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  sector.isPositive ? "bg-success" : "bg-warning"
                )}
                style={{ width: `${(sector.score / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
