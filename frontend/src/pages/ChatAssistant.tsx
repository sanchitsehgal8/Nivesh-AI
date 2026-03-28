import { FormEvent, useState } from "react";

import { apiClient } from "../api/client";
import { useAppStore } from "../store/useAppStore";

type ChatResponse = {
  recommendation: string;
  confidence_score: number;
  risk_band: "low" | "medium" | "high";
  reasoning: string;
  citations: string[];
  supporting_signals: string[];
};

export default function ChatAssistant() {
  const [query, setQuery] = useState("Should I hold Infosys?");
  const [loading, setLoading] = useState(false);
  const { chatHistory, addChatMessage } = useAppStore((s) => ({
    chatHistory: s.chatHistory,
    addChatMessage: s.addChatMessage,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    addChatMessage({ role: "user", content: query });
    setLoading(true);
    try {
      let data: ChatResponse;
      try {
        const response = await apiClient.post<ChatResponse>("/chat", {
          query,
          user_id: "00000000-0000-0000-0000-000000000001",
          portfolio_id: "00000000-0000-0000-0000-000000000001",
        });
        data = response.data;
      } catch {
        data = {
          recommendation: "Hold with caution",
          confidence_score: 0.74,
          risk_band: "medium",
          reasoning: "Fallback advisory generated locally because backend is unavailable.",
          citations: ["Local fallback model", "Last known signals snapshot"],
          supporting_signals: ["RSI divergence", "Earnings trend stable"],
        };
      }
      addChatMessage({
        role: "assistant",
        content: `${data.recommendation} (${data.risk_band} risk): ${data.reasoning}`,
        citations: data.citations,
        confidenceScore: data.confidence_score,
      });
      setQuery("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-64px)] gap-4 p-4 xl:grid-cols-[260px_1fr]">
      <aside className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
        <h3 className="text-xs uppercase tracking-widest text-slate-400">Context Engine</h3>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 p-3 text-slate-300">
          Active portfolio context on. Analyzing holdings, risk, and strategy.
        </div>
        <h3 className="pt-2 text-xs uppercase tracking-widest text-slate-400">Recent Signals</h3>
        <p className="rounded bg-slate-800 px-2 py-1 text-xs">RELIANCE: Bullish</p>
        <p className="rounded bg-slate-800 px-2 py-1 text-xs">INFY: Sector Lag</p>
        <p className="rounded bg-slate-800 px-2 py-1 text-xs">HDFC: Dividend Alert</p>
      </aside>

      <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <div className="flex justify-end">
          <div className="max-w-2xl rounded-xl bg-indigo-600 px-4 py-3 text-sm text-indigo-50">
            Should I increase exposure to IT stocks given the current NIFTY outlook?
          </div>
        </div>

        <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
          {chatHistory.map((msg, index) => (
            <div key={`${msg.role}-${index}`} className="rounded-lg border border-slate-700 p-3">
              <p className="text-xs uppercase text-slate-400">{msg.role}</p>
              <p className="text-sm text-slate-200">{msg.content}</p>
              {typeof msg.confidenceScore === "number" && (
                <p className="mt-1 text-xs text-amber-300">{Math.round(msg.confidenceScore * 100)}% Confidence</p>
              )}
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
