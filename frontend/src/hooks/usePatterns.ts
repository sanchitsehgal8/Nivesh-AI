import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";

export type Pattern = {
  pattern_name: string;
  timeframe: string;
  confidence: number;
  plain_english_summary: string;
  backtest_success_rate: number;
  detected_at: string;
};

type PatternsResponse = {
  symbol: string;
  patterns: Pattern[];
};

export function usePatterns(symbol: string) {
  return useQuery({
    queryKey: ["patterns", symbol],
    queryFn: async (): Promise<Pattern[]> => {
      const { data } = await apiClient.get<PatternsResponse>(`/patterns/${symbol}`);
      return data.patterns;
    },
    enabled: symbol.length > 0,
    refetchInterval: 5 * 60_000,
  });
}
