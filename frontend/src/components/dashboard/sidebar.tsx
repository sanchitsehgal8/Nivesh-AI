"use client"

import { cn } from "../../lib/utils"
import {
  LayoutDashboard,
  Radar,
  Search,
  LineChart,
  Briefcase,
  MessageSquare,
  Video,
  Settings,
  Plus,
  LogOut,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Opportunity Radar", href: "/radar", icon: Radar },
  { name: "Stock Explorer", href: "/explorer", icon: Search },
  { name: "Chart Intelligence", href: "/charts", icon: LineChart },
  { name: "Portfolio Copilot", href: "/portfolio", icon: Briefcase },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Video Briefings", href: "/videos", icon: Video },
]

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[72px] flex-col bg-sidebar lg:w-56">
      {/* Logo & User */}
      <div className="flex flex-col items-center p-4 lg:items-start lg:p-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/90">
            <svg className="h-5 w-5 text-sidebar" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-sidebar-foreground">Nivesh</h1>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="mt-6 flex flex-col items-center lg:items-start">
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-gray-600 to-gray-800 lg:h-20 lg:w-20">
              <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white lg:text-2xl">
                KD
              </div>
            </div>
            <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-sidebar bg-green-500" />
          </div>
          <div className="mt-3 hidden text-center lg:block lg:text-left">
            <p className="text-[11px] text-sidebar-foreground/60">Welcome Back,</p>
            <p className="text-sm font-medium text-sidebar-foreground">Khushi Dangi</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-1 flex-col px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group relative flex h-10 items-center justify-center rounded-xl transition-all lg:justify-start lg:px-3",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="ml-3 hidden text-[13px] font-medium lg:block">
                  {item.name}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 hidden h-6 w-1 rounded-r-full bg-amber-400 lg:block" />
                )}
              </Link>
            )
          })}
        </div>

        {/* New Analysis Button */}
        <button className="mt-5 flex h-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors hover:bg-accent/90 lg:justify-start lg:px-3">
          <Plus className="h-[18px] w-[18px] shrink-0" />
          <span className="ml-3 hidden text-[13px] font-medium lg:block">
            New Analysis
          </span>
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mb-4 space-y-1">
          <Link
            to="/settings"
            className={cn(
              "flex h-10 items-center justify-center rounded-xl transition-colors lg:justify-start lg:px-3",
              pathname === "/settings"
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            <span className="ml-3 hidden text-[13px] font-medium lg:block">Settings</span>
          </Link>
          
          <button className="flex h-10 w-full items-center justify-center rounded-xl text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground lg:justify-start lg:px-3">
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="ml-3 hidden text-[13px] font-medium lg:block">Log Out</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
