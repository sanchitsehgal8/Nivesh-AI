import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { apiClient } from "../api/client";
import type { Holding } from "../store/useAppStore";
import type { Candle } from "./useOhlcv";

type OhlcvResponse = {
  candles: Candle[];
  source?: "live" | "fallback";
};

type PortfolioPerformance = {
  perfSeries: number[];
  latestPriceBySymbol: Record<string, number>;
  totalValue: number;
  totalPnl: number;
  todayPnl: number;
  dataSource: "live" | "fallback";
  isLoading: boolean;
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

const fallbackCandles = (symbol: string, count: number = 180): Candle[] => {
  const base = symbol === "RELIANCE" ? 2800 : symbol === "HDFCBANK" ? 1450 : 1600;
  const rand = rngFactory(seedFrom(`${symbol}-portfolio-performance`));
  let prevClose = base + (rand() - 0.5) * 60;

  return Array.from({ length: count }).map((_, i) => {
    const regime = i < count * 0.35 ? 0.15 : i < count * 0.7 ? -0.07 : 0.12;
    const noise = (rand() - 0.5) * 22;
    const close = Math.max(1, prevClose * (1 + regime / 100) + noise);
    const open = prevClose + (rand() - 0.5) * 7;
    const high = Math.max(open, close) + Math.abs((rand() - 0.2) * 12);
    const low = Math.max(1, Math.min(open, close) - Math.abs((rand() - 0.2) * 10));
    const volume = Math.round(100000 + rand() * 220000);
    prevClose = close;
    return {
      ts: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000).toISOString(),
      open,
      high,
      low,
      close,
      volume,
    };
  });
};

export function usePortfolioPerformance(holdings: Holding[]): PortfolioPerformance {
  const symbols = useMemo(
    () => Array.from(new Set(holdings.map((h) => h.symbol.toUpperCase()).filter(Boolean))),
    [holdings],
  );

  const queryResults = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["portfolio-ohlcv", symbol],
      queryFn: async (): Promise<OhlcvResponse> => {
        try {
          const { data } = await apiClient.get<OhlcvResponse>(`/market/ohlcv/${symbol}`, {
            params: { interval: "1d", period: "6mo" },
          });
          if (Array.isArray(data.candles) && data.candles.length > 1) {
            return { candles: data.candles, source: data.source ?? "live" };
          }
          return { candles: fallbackCandles(symbol), source: "fallback" };
        } catch {
          return { candles: fallbackCandles(symbol), source: "fallback" };
        }
      },
      staleTime: 60_000,
      retry: 0,
      enabled: symbol.length > 0,
    })),
  });

  return useMemo(() => {
    const isLoading = queryResults.some((q) => q.isLoading);

    const candlesBySymbol: Record<string, Candle[]> = {};
    let source: "live" | "fallback" = "live";
    symbols.forEach((symbol, idx) => {
      const data = queryResults[idx]?.data;
      candlesBySymbol[symbol] = Array.isArray(data?.candles) && data.candles.length > 1 ? data.candles : fallbackCandles(symbol);
      if (data?.source === "fallback") {
        source = "fallback";
      }
    });

    const latestPriceBySymbol: Record<string, number> = {};
    for (const symbol of symbols) {
      const series = candlesBySymbol[symbol];
      latestPriceBySymbol[symbol] = series[series.length - 1]?.close ?? 0;
    }

    const minLen = symbols.length
      ? Math.min(...symbols.map((symbol) => candlesBySymbol[symbol].length))
      : 0;

    const perfSeries: number[] = [];
    let baseValue = 0;

    if (minLen > 1) {
      for (let i = 0; i < minLen; i += 1) {
        let value = 0;
        for (const h of holdings) {
          const symbol = h.symbol.toUpperCase();
          const series = candlesBySymbol[symbol];
          const candle = series[series.length - minLen + i];
          value += h.quantity * (candle?.close ?? h.avg_buy_price);
        }

        if (i === 0) baseValue = value || 1;
        perfSeries.push((value / (baseValue || 1)) * 100);
      }
    }

    const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (latestPriceBySymbol[h.symbol.toUpperCase()] ?? h.avg_buy_price), 0);

    const totalPnl = holdings.reduce(
      (sum, h) =>
        sum +
        h.quantity *
          ((latestPriceBySymbol[h.symbol.toUpperCase()] ?? h.avg_buy_price) - h.avg_buy_price),
      0,
    );

    const todayPnl = holdings.reduce((sum, h) => {
      const symbol = h.symbol.toUpperCase();
      const s = candlesBySymbol[symbol];
      if (!s || s.length < 2) return sum;
      const last = s[s.length - 1].close;
      const prev = s[s.length - 2].close;
      return sum + h.quantity * (last - prev);
    }, 0);

    return {
      perfSeries,
      latestPriceBySymbol,
      totalValue,
      totalPnl,
      todayPnl,
      dataSource: source,
      isLoading,
    };
  }, [holdings, queryResults, symbols]);
}
