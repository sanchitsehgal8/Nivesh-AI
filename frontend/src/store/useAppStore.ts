import { create } from "zustand";

export type Signal = {
  signal_type: "insider_buy" | "bulk_deal" | "earnings_surprise" | "regulatory_change";
  confidence_score: number;
  stock_symbol: string;
  reasoning_summary: string;
  risk_level: "low" | "medium" | "high";
  historical_accuracy_reference: number | null;
  source_url: string;
};

export type Holding = {
  symbol: string;
  quantity: number;
  avg_buy_price: number;
};

export type Portfolio = {
  id: string;
  name: string;
  holdings: Holding[];
  risk_band?: "low" | "medium" | "high";
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  confidenceScore?: number;
};

export interface AppState {
  signals: Signal[];
  activePortfolio: Portfolio | null;
  selectedSymbol: string | null;
  chatHistory: ChatMessage[];
  setSignals: (s: Signal[]) => void;
  setActivePortfolio: (p: Portfolio | null) => void;
  setSelectedSymbol: (symbol: string | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  signals: [],
  activePortfolio: null,
  selectedSymbol: null,
  chatHistory: [],
  setSignals: (s) => set({ signals: s }),
  setActivePortfolio: (p) => set({ activePortfolio: p }),
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
  clearChatHistory: () => set({ chatHistory: [] }),
}));
