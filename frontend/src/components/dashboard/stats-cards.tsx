"use client"

import { cn } from "../../lib/utils"
import { TrendingUp, Signal, Target, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  subLabel?: string
  subValue?: string
  change?: string
  isPositive?: boolean
  icon: React.ReactNode
  bgColor?: string
  className?: string
}

function StatCard({ 
  label, 
  value, 
  subLabel,
  subValue, 
  change,
  isPositive, 
  icon,
  bgColor = "bg-mint",
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl p-6 card-shadow border-0 transition-all hover:shadow-lg",
      bgColor,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-gray-700/70">{label}</span>
            {change && (
              <span className={cn(
                "flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold",
                isPositive 
                  ? "bg-success/30 text-green-700" 
                  : "bg-destructive/30 text-red-700"
              )}>
                {isPositive ? "+" : ""}{change}
              </span>
            )}
          </div>
          <p className="mt-3 text-4xl font-bold text-gray-900">
            {value}
          </p>
          {subValue && (
            <p className="mt-1 text-sm text-gray-600">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <StatCard
        label="Portfolio Value"
        value="₹14,82,340"
        subValue="Total holdings"
        icon={<Wallet className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-emerald-100 to-green-100"
      />
      <StatCard
        label="Today P&L"
        value="+₹23,410"
        change="1.6%"
        isPositive={true}
        subValue="Day change"
        icon={<TrendingUp className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-yellow-100 to-amber-100"
      />
      <StatCard
        label="Alpha Score"
        value="18.4%"
        icon={<Signal className="h-6 w-6" />}
        bgColor="bg-gradient-to-br from-blue-100 to-indigo-100"
      />
    </div>
  )
}
