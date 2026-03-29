"use client"

import { Sidebar } from "./sidebar"
import { MarketTicker } from "./market-ticker"

interface DashboardLayoutProps {
  children: React.ReactNode
  rightPanel?: React.ReactNode
}

export function DashboardLayout({ children, rightPanel }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[72px] flex-1 lg:ml-60">
        <MarketTicker />
        <div className="flex overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-8">{children}</div>
          {rightPanel && (
            <aside className="hidden w-80 border-l border-border bg-card/30 p-6 xl:block overflow-y-auto">
              {rightPanel}
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}
