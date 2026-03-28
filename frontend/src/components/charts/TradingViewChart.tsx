import { useEffect, useMemo, useRef } from "react";
import {
  ColorType,
  HistogramSeries,
  CandlestickSeries,
  LineSeries,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";

import type { Candle } from "../../hooks/useOhlcv";

type Props = {
  candles: Candle[];
  support?: number;
  resistance?: number;
  className?: string;
};

const toTs = (iso: string): UTCTimestamp => Math.floor(new Date(iso).getTime() / 1000) as UTCTimestamp;

export function TradingViewChart({ candles, support, resistance, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const candleData = useMemo(
    () =>
      candles.map((c) => ({
        time: toTs(c.ts),
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      })),
    [candles],
  );

  const volumeData = useMemo(
    () =>
      candles.map((c) => ({
        time: toTs(c.ts),
        value: c.volume,
        color: c.close >= c.open ? "rgba(52, 211, 153, 0.35)" : "rgba(244, 63, 94, 0.35)",
      })),
    [candles],
  );

  useEffect(() => {
    if (!containerRef.current || candles.length === 0) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 420;
    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#070b16" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      rightPriceScale: {
        borderColor: "#334155",
      },
      timeScale: {
        borderColor: "#334155",
      },
      crosshair: {
        vertLine: { color: "#64748b" },
        horzLine: { color: "#64748b" },
      },
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#f43f5e",
    });
    candleSeries.setData(candleData);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: "",
      priceFormat: {
        type: "volume",
      },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    volumeSeries.setData(volumeData);

    if (support && candleData.length > 1) {
      const s = chart.addSeries(LineSeries, {
        color: "#10b981",
        lineWidth: 1,
      });
      s.setData([
        { time: candleData[0].time, value: support },
        { time: candleData[candleData.length - 1].time, value: support },
      ]);
    }

    if (resistance && candleData.length > 1) {
      const r = chart.addSeries(LineSeries, {
        color: "#f59e0b",
        lineWidth: 1,
      });
      r.setData([
        { time: candleData[0].time, value: resistance },
        { time: candleData[candleData.length - 1].time, value: resistance },
      ]);
    }

    chart.timeScale().fitContent();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) return;
      const { width: w, height: h } = entry.contentRect;
      chartRef.current.applyOptions({ width: Math.max(320, Math.floor(w)), height: Math.max(220, Math.floor(h)) });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, candleData, volumeData, support, resistance]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
