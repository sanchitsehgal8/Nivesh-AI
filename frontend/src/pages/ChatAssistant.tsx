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
      const { data } = await apiClient.post<ChatResponse>("/chat", {
        query,
        user_id: "00000000-0000-0000-0000-000000000001",
        portfolio_id: "00000000-0000-0000-0000-000000000001",
      });
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
    <main className="mx-auto max-w-4xl space-y-4 p-6 text-slate-100">
      <h1 className="text-2xl font-semibold">Portfolio-Aware Chat Assistant</h1>
      <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-4">
        {chatHistory.map((msg, index) => (
          <div key={`${msg.role}-${index}`} className="rounded-lg border border-slate-700 p-3">
            <p className="text-xs uppercase text-slate-400">{msg.role}</p>
            <p className="text-sm text-slate-200">{msg.content}</p>
            {typeof msg.confidenceScore === "number" && (
              <p className="mt-1 text-xs text-cyan-300">Confidence: {(msg.confidenceScore * 100).toFixed(0)}%</p>
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
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded bg-slate-800 px-3 py-2"
          placeholder="Ask about your portfolio or a stock..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-cyan-600 px-4 py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </main>
  );
}
