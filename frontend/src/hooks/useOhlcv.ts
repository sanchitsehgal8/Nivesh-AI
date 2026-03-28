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

const seedFrom = (text: string): number => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rngFactory = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const fallback = (symbol: string, timeframe: string): Candle[] => {
  const base = symbol === "RELIANCE" ? 2800 : symbol === "HDFCBANK" ? 1450 : 1600;
  const count = timeframe === "1D" || timeframe === "15M" || timeframe === "1H" ? 180 : 220;
  const spacingMs =
    timeframe === "15M"
      ? 15 * 60 * 1000
      : timeframe === "1H" || timeframe === "4H"
        ? 60 * 60 * 1000
        : timeframe === "1W"
          ? 24 * 60 * 60 * 1000
          : 7 * 24 * 60 * 60 * 1000;
  const rand = rngFactory(seedFrom(`${symbol}-${timeframe}`));

  let prevClose = base + (rand() - 0.5) * 60;
  return Array.from({ length: count }).map((_, i) => {
    const regime = i < count * 0.35 ? 0.18 : i < count * 0.7 ? -0.05 : 0.12;
    const noise = (rand() - 0.5) * (timeframe === "15M" || timeframe === "1H" ? 12 : 28);
    const close = Math.max(1, prevClose * (1 + regime / 100) + noise);
    const open = prevClose + (rand() - 0.5) * 8;
    const wickUp = Math.abs((rand() - 0.2) * 14);
    const wickDown = Math.abs((rand() - 0.2) * 12);
    const high = Math.max(open, close) + wickUp;
    const low = Math.max(1, Math.min(open, close) - wickDown);
    const spike = rand() > 0.94 ? 3.4 : 1;
    const volume = Math.round((90000 + rand() * 180000) * spike);
    prevClose = close;
    return {
      ts: new Date(Date.now() - (count - i) * spacingMs).toISOString(),
      open,
      high,
      low,
      close,
      volume,
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
        return fallback(symbol, timeframe);
      }
    },
    enabled: symbol.length > 0,
    refetchInterval: 60_000,
    retry: 0,
  });
}
