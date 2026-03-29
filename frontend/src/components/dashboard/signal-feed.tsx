"use client"

import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"
import { Star } from "lucide-react"

interface Signal {
  stock: string
  price: string
  type: string
  typeLabel: string
  description: string
  confidence: number
  risk: "low" | "medium" | "high"
  date: string
}

const signals: Signal[] = [
  {
    stock: "RELIANCE",
    price: "₹2,847",
    type: "insider_buy",
    typeLabel: "Insider Buy",
    description: "Promoter-linked buying at support with improving volume.",
    confidence: 83,
    risk: "medium",
    date: "Today",
  },
  {
    stock: "INFY",
    price: "₹1,612",
    type: "earnings_surprise",
    typeLabel: "Earnings Beat",
    description: "Revenue growth beat trend and margin guidance stable.",
    confidence: 79,
    risk: "low",
    date: "Today",
  },
  {
    stock: "HDFCBANK",
    price: "₹1,578",
    type: "breakout",
    typeLabel: "Breakout",
    description: "Breaking resistance with volume confirmation.",
    confidence: 76,
    risk: "low",
    date: "Yesterday",
  },
]

const riskColors = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
}

export function SignalFeed() {
  return (
    <div className="rounded-3xl border-0 bg-card card-shadow overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Signal Feed</h3>
          <p className="text-sm text-muted-foreground">Data Updates Every 3 Hours</p>
        </div>
        <button className="text-sm font-medium text-accent hover:underline">
          View All
        </button>
      </div>
      
      <div className="divide-y divide-border">
        {signals.map((signal) => (
          <div 
            key={signal.stock} 
            className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary/30"
          >
            {/* Stock Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <span className="text-xs font-bold text-foreground">
                {signal.stock.slice(0, 2)}
              </span>
            </div>
            
            {/* Stock Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{signal.stock}</span>
                <Badge variant="secondary" className="rounded-md text-[10px]">
                  {signal.typeLabel}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{signal.description}</p>
            </div>
            
            {/* Price */}
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{signal.price}</p>
            </div>

            {/* Risk */}
            <div className={cn(
              "rounded-md px-2 py-1 text-[10px] font-medium capitalize",
              riskColors[signal.risk]
            )}>
              {signal.risk}
            </div>
            
            {/* Date */}
            <div className="w-16 text-right text-xs text-muted-foreground">
              {signal.date}
            </div>
            
            {/* Action */}
            <button className="text-muted-foreground hover:text-foreground">
              <Star className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
