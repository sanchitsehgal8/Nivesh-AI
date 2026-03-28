import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../api/client";

export type Candle = {
  ts: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type OhlcvResponse = {
  symbol: string;
  interval: string;
  period: string;
  candles: Candle[];
};

const mapTf = (timeframe: string): { interval: string; period: string } => {
  if (timeframe === "15M") return { interval: "15m", period: "5d" };
  if (timeframe === "1H") return { interval: "60m", period: "1mo" };
  if (timeframe === "4H") return { interval: "1h", period: "3mo" };
  if (timeframe === "1W") return { interval: "1d", period: "1y" };
  if (timeframe === "1M") return { interval: "1d", period: "2y" };
  if (timeframe === "1Y") return { interval: "1wk", period: "5y" };
  if (timeframe === "5Y") return { interval: "1mo", period: "max" };
  return { interval: "1d", period: "6mo" };
};

const fallback = (symbol: string): Candle[] => {
  const base = symbol === "RELIANCE" ? 2800 : symbol === "HDFCBANK" ? 1450 : 1600;
  return Array.from({ length: 100 }).map((_, i) => {
    const close = base + Math.sin(i / 7) * 30 + i * 0.8;
    const open = close - (Math.random() * 8 - 4);
    return {
      ts: new Date(Date.now() - (100 - i) * 60 * 60 * 1000).toISOString(),
      open,
      high: Math.max(open, close) + 5,
      low: Math.min(open, close) - 5,
      close,
      volume: 100000 + i * 120,
    };
  });
};

export function useOhlcv(symbol: string, timeframe: string) {
  const { interval, period } = mapTf(timeframe);
  return useQuery({
    queryKey: ["ohlcv", symbol, timeframe],
    queryFn: async (): Promise<Candle[]> => {
      try {
        const { data } = await apiClient.get<OhlcvResponse>(`/market/ohlcv/${symbol}`, {
          params: { interval, period },
        });
        return data.candles;
      } catch {
        return fallback(symbol);
      }
    },
    enabled: symbol.length > 0,
    refetchInterval: 60_000,
    retry: 0,
  });
}
