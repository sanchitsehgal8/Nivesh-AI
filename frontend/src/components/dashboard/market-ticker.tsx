"use client"

import { cn } from "../../lib/utils"
import { ThemeToggle } from "../theme-toggle"
import { Bell, Search } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface TickerItem {
  name: string
  value: string
  change: string
  isPositive: boolean
}

const tickerData: TickerItem[] = [
  { name: "NIFTY 50", value: "22,453.10", change: "+0.45%", isPositive: true },
  { name: "SENSEX", value: "73,982.50", change: "+0.38%", isPositive: true },
  { name: "BANK NIFTY", value: "47,214.90", change: "-0.12%", isPositive: false },
  { name: "INDIA VIX", value: "14.22", change: "", isPositive: true },
]

export function MarketTicker() {
  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-card px-5">
      {/* Left - Page title + ticker */}
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-4 md:flex">
          {tickerData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-xs font-medium text-foreground">{item.value}</span>
              {item.change && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    item.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {item.change}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 w-48 rounded-full border-border bg-secondary pl-9 text-xs"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full bg-secondary">
          <Bell className="h-3.5 w-3.5 text-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}
