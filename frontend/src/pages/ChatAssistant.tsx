import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { apiClient } from "../api/client";

type ChatResponse = {
  recommendation: string;
  confidence_score: number;
  risk_band: "low" | "medium" | "high";
  reasoning: string;
  citations: string[];
  supporting_signals: string[];
  agent_route?: "portfolio" | "pattern" | "sector";
  agent_trace?: string[];
};

type LocalMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  confidenceScore?: number;
  agentRoute?: "portfolio" | "pattern" | "sector";
  agentTrace?: string[];
};

export default function ChatAssistant() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [query, setQuery] = useState("Should I hold Infosys?");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const autoSubmittedRef = useRef<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I am your Nivesh AI copilot. Ask about hold/sell decisions, breakout candidates, or portfolio risk concentration.",
      citations: ["Signal engine", "Portfolio context"],
      confidenceScore: 0.82,
    },
  ]);

  const pushMessage = (message: LocalMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setError(null);
    pushMessage({ role: "user", content: text });
    setLoading(true);
    try {
      let data: ChatResponse;
      try {
        const response = await apiClient.post<ChatResponse>("/chat", {
          query: text,
          user_id: "00000000-0000-0000-0000-000000000001",
          portfolio_id: "00000000-0000-0000-0000-000000000001",
        });
        data = response.data;
      } catch {
        setError("Backend is unreachable. Showing local fallback response.");
        data = {
          recommendation: "Hold with caution",
          confidence_score: 0.74,
          risk_band: "medium",
          reasoning: "Fallback advisory generated locally because backend is unavailable.",
          citations: ["Local fallback model", "Last known signals snapshot"],
          supporting_signals: ["RSI divergence", "Earnings trend stable"],
          agent_route: "portfolio",
          agent_trace: ["router", "retriever", "technical", "fundamental", "sentiment", "synthesis"],
        };
      }
      pushMessage({
        role: "assistant",
        content: `${data.recommendation} (${data.risk_band} risk): ${data.reasoning}`,
        citations: Array.isArray(data.citations) ? data.citations : [],
        confidenceScore: data.confidence_score,
        agentRoute: data.agent_route,
        agentTrace: Array.isArray(data.agent_trace) ? data.agent_trace : [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = query;
    setQuery("");
    await sendMessage(text);
  };

  useEffect(() => {
    const incoming = searchParams.get("query");
    const runNonce = searchParams.get("run") ?? "no-run";
    const dedupeKey = `${incoming ?? ""}|${runNonce}|${location.key}`;
    if (incoming && autoSubmittedRef.current !== dedupeKey) {
      autoSubmittedRef.current = dedupeKey;
      setQuery(incoming);
      void sendMessage(incoming);
    }
  }, [location.key, searchParams]);

  useEffect(() => {
    let cancelled = false;
    const checkHealth = async () => {
      try {
        await apiClient.get("/health");
        if (!cancelled) setBackendOnline(true);
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
    };
    void checkHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[260px_1fr]">
      <aside className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <h3 className="text-xs uppercase tracking-widest text-slate-400">Context Engine</h3>
        <p className={`text-xs ${backendOnline === false ? "text-amber-300" : "text-emerald-300"}`}>
          {backendOnline === false ? "Backend offline (fallback mode)" : "Backend online"}
        </p>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-slate-300">
          Active portfolio context on. Analyzing holdings, risk, and strategy.
        </div>
        <h3 className="pt-2 text-xs uppercase tracking-widest text-slate-400">Recent Signals</h3>
        <button
          onClick={() => void sendMessage("Is RELIANCE still bullish for swing trade?")}
          className="w-full rounded bg-slate-800 px-2 py-1 text-left text-xs"
        >
          RELIANCE: Bullish
        </button>
        <button
          onClick={() => void sendMessage("Should I reduce INFY exposure due to sector lag?")}
          className="w-full rounded bg-slate-800 px-2 py-1 text-left text-xs"
        >
          INFY: Sector Lag
        </button>
        <button
          onClick={() => void sendMessage("How does HDFC dividend alert impact my portfolio yield?")}
          className="w-full rounded bg-slate-800 px-2 py-1 text-left text-xs"
        >
          HDFC: Dividend Alert
        </button>
        <button
          onClick={() =>
            void sendMessage(
              "Run a full agentic analysis of my portfolio and provide top 3 actions with confidence and risk.",
            )
          }
          className="w-full rounded bg-indigo-600/80 px-2 py-1 text-left text-xs font-semibold text-indigo-50"
        >
          Run Agentic Analysis
        </button>
        <button
          onClick={() =>
            void sendMessage("New analysis: summarize my portfolio, key risks, and best opportunity for next 7 days.")
          }
          className="w-full rounded bg-emerald-600/80 px-2 py-1 text-left text-xs font-semibold text-emerald-50"
        >
          New Analysis
        </button>
      </aside>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <div className="flex justify-end">
          <div className="max-w-2xl rounded-xl bg-indigo-600 px-4 py-3 text-sm text-indigo-50">
            Should I increase exposure to IT stocks given the current NIFTY outlook?
          </div>
        </div>

        <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-4 text-sm text-slate-300">
              Start by asking a stock question or click “Run Agentic Analysis”.
            </div>
          ) : null}
          {messages.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className="rounded-lg border border-slate-700 p-3">
              <p className="text-xs uppercase text-slate-400">{msg.role}</p>
              <p className="text-sm text-slate-200">{msg.content}</p>
              {typeof msg.confidenceScore === "number" && (
                <p className="mt-1 text-xs text-amber-300">{Math.round(msg.confidenceScore * 100)}% Confidence</p>
              )}
              {msg.agentRoute ? (
                <p className="mt-1 text-xs text-indigo-300">Route: {msg.agentRoute}</p>
              ) : null}
              {msg.agentTrace && msg.agentTrace.length > 0 ? (
                <p className="mt-1 text-xs text-slate-400">Agents: {msg.agentTrace.join(" → ")}</p>
              ) : null}
              {msg.citations && msg.citations.length > 0 && (
                <details className="mt-2 text-xs text-slate-300">
                  <summary>Sources</summary>
                  <ul className="mt-1 list-disc pl-5">
                    {msg.citations.map((citation) => (
                      <li key={citation}>{citation}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          ))}
          {error ? <p className="text-xs text-amber-300">{error}</p> : null}
          {loading ? <p className="text-xs text-slate-400">Nivesh AI is thinking...</p> : null}
        </section>

        <form onSubmit={handleSubmit} className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent px-2 text-sm outline-none"
            placeholder="Ask Nivesh AI about any stock or portfolio risk..."
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-indigo-500 px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading ? "Thinking..." : "➤"}
          </button>
        </form>
      </section>
    </main>
  );
}
