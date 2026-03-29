"use client"

import { useState } from "react"
import { Send, Sparkles, ArrowRight, Clock } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

const quickPrompts = [
  { text: "What changed today?", icon: <Clock className="h-3.5 w-3.5" /> },
  { text: "Top breakout stock?", icon: <ArrowRight className="h-3.5 w-3.5" /> },
  { text: "Should I book profits?", icon: <Sparkles className="h-3.5 w-3.5" /> },
]

export function CopilotPanel() {
  const [query, setQuery] = useState("")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/70">
          <Sparkles className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Copilot</h3>
          <p className="text-xs text-muted-foreground">Contextual intelligence</p>
        </div>
      </div>

      {/* Morning Update Card */}
      <div className="rounded-3xl bg-gradient-to-br from-secondary to-secondary/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card">
            <span className="text-sm">📊</span>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Morning Update</h4>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Post-Policy Market Strategy & Support Levels
            </p>
            <button className="mt-2 flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Read full briefing
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Quick Actions
        </p>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt.text}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-accent hover:bg-secondary/50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground">
              {prompt.icon}
            </span>
            <span className="text-sm text-foreground">{prompt.text}</span>
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Input */}
      <div className="mt-4 space-y-3">
        <div className="relative">
          <Input
            placeholder="Ask Nivesh anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 rounded-xl border-border bg-secondary pr-12 text-sm"
          />
          <Button 
            size="icon" 
            className="absolute right-1.5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground">
          Powered by contextual market intelligence
        </p>
      </div>
    </div>
  )
}
