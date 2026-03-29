import { useEffect, useMemo, useRef } from "react";
import { AreaSeries, ColorType, LineSeries, createChart, type IChartApi, type UTCTimestamp } from "lightweight-charts";

type Props = {
  values: number[];
};

export function PerformanceChart({ values }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const series = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    return values.map((v, i) => ({
      time: Math.floor((now - (values.length - i) * dayMs) / 1000) as UTCTimestamp,
      value: v,
    }));
  }, [values]);

  useEffect(() => {
    if (!containerRef.current || series.length === 0) return;

    const width = containerRef.current.clientWidth || 900;
    const height = containerRef.current.clientHeight || 240;

    const chart = createChart(containerRef.current, {
      width,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#050b16" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#0f172a" },
        horzLines: { color: "#0f172a" },
      },
      timeScale: { borderColor: "#1e293b", timeVisible: false },
      rightPriceScale: { borderColor: "#1e293b" },
      crosshair: {
        vertLine: { color: "#334155" },
        horzLine: { color: "#334155" },
      },
    });
    chartRef.current = chart;

    const area = chart.addSeries(AreaSeries, {
      lineColor: "#9fb4ff",
      topColor: "rgba(127, 145, 255, 0.25)",
      bottomColor: "rgba(127, 145, 255, 0.03)",
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });
    area.setData(series);

    const base = series[0]?.value ?? 100;
    const baseline = chart.addSeries(LineSeries, {
      color: "rgba(148, 163, 184, 0.45)",
      lineWidth: 1,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    baseline.setData([
      { time: series[0].time, value: base },
      { time: series[series.length - 1].time, value: base },
    ]);

    chart.timeScale().fitContent();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: Math.max(320, Math.floor(entry.contentRect.width)),
        height: Math.max(180, Math.floor(entry.contentRect.height)),
      });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [series]);

  if (!values.length) return <div className="h-full w-full rounded bg-slate-950/60" />;
  return <div ref={containerRef} className="h-full w-full rounded-lg" />;
}
