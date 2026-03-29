import { useState } from "react";
import { DashboardLayout } from "../components/dashboard/index";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Send, ChevronDown, Sparkles, Zap, TrendingUp, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
 confidence?: number;
}

const recentSignals = [
  { text: "RELIANCE: Bullish", icon: <TrendingUp className="h-3.5 w-3.5" /> },
  { text: "INFY: Sector Lag", icon: <Activity className="h-3.5 w-3.5" /> },
  { text: "HDFC: Dividend Alert", icon: <Zap className="h-3.5 w-3.5" /> },
];

const messages: Message[] = [
  {
    role: "user",
    content: "Should I increase exposure to IT stocks given the current NIFTY outlook?",
  },
  {
    role: "assistant",
    content:
      "Based on current market conditions, IT sector shows mixed signals. NIFTY IT is trading near support with moderate volume. Consider partial allocation with stop-loss at key levels.",
    confidence: 82,
  },
];

function ContextPanel() {
  return (
    <div className="space-y-5">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
        </div>
        <span className="text-sm font-medium text-success">Engine Online</span>
      </div>

      {/* Context Card */}
      <div className="rounded-2xl bg-secondary/70 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Active Context
        </p>
        <p className="mt-2 text-sm text-foreground">
          Portfolio analysis mode. Analyzing holdings, risk exposure, and market correlations.
        </p>
      </div>

      {/* Recent Signals */}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recent Signals
        </p>
        <div className="mt-3 space-y-2">
          {recentSignals.map((signal) => (
            <div
              key={signal.text}
              className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2.5"
            >
              <span className="text-muted-foreground">{signal.icon}</span>
              <span className="text-sm text-foreground">{signal.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Button className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90">
          <Sparkles className="mr-2 h-4 w-4" />
          Run Deep Analysis
        </Button>
        <Button variant="outline" className="w-full rounded-xl">
          New Conversation
        </Button>
      </div>
    </div>
  );
}

export default function ChatAssistant() {
  const [input, setInput] = useState("");

  return (
    <DashboardLayout rightPanel={<ContextPanel />}>
      <div className="flex h-[calc(100vh-8rem)] flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
          <p className="text-sm text-muted-foreground">Ask questions about your portfolio and market</p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-lg rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "border border-border bg-card"
                )}
              >
                {message.role === "assistant" && (
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Nivesh Assistant
                    </span>
                  </div>
                )}
                <p className={cn(
                  "text-sm leading-relaxed",
                  message.role === "user" ? "text-background" : "text-foreground"
                )}>
                  {message.content}
                </p>
                {message.confidence && (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-lg bg-success-light px-2 py-1 text-xs font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" />
                      {message.confidence}% Confidence
                    </span>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      <ChevronDown className="h-3 w-3" />
                      View sources
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your portfolio..."
              className="h-12 rounded-xl border-border bg-card pr-12 text-sm"
            />
          </div>
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
