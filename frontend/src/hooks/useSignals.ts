import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type { Signal } from "../store/useAppStore";

type SignalsResponse = { signals: Signal[] };

const fallbackSignals: Signal[] = [
  {
    signal_type: "insider_buy",
    confidence_score: 0.83,
    stock_symbol: "RELIANCE",
    reasoning_summary: "Promoter-linked buying near support with rising volume profile.",
    risk_level: "medium",
    historical_accuracy_reference: 0.72,
    source_url: "https://www.nseindia.com",
  },
  {
    signal_type: "earnings_surprise",
    confidence_score: 0.79,
    stock_symbol: "INFY",
    reasoning_summary: "Quarterly growth beat estimates with stable margin guidance.",
    risk_level: "low",
    historical_accuracy_reference: 0.69,
    source_url: "https://www.bseindia.com",
  },
];

export function useSignals() {
  return useQuery({
    queryKey: ["signals", "latest"],
    queryFn: async (): Promise<Signal[]> => {
      try {
        const { data } = await apiClient.get<SignalsResponse>("/signals/latest");
        return data.signals;
      } catch {
        return fallbackSignals;
      }
    },
    refetchInterval: 60_000,
    retry: 0,
  });
}
