"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  type ChartPeriod,
} from "@/constants";
import { convertOHLCData } from "@/lib/utils";

interface CandlestickChartProps {
  coin: {
    image: string;
    name: string;
    symbol: string;
    currentPrice: string;
  };
}

export default function CandlestickChart({ coin }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [activePeriod, setActivePeriod] = useState<ChartPeriod>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const height = container.clientHeight;
    const chart = createChart(container, {
      ...getChartConfig(height),
      width: container.clientWidth,
    });
    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry || chartRef.current !== chart) return;
      chart.resize(entry.contentRect.width, entry.contentRect.height);
    });
    resizeObserver.observe(container);

    return () => {
      abortRef.current?.abort();
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  const loadPeriod = useCallback(async (period: ChartPeriod) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/coins/bitcoin/ohlc?period=${encodeURIComponent(period)}`,
        { signal: controller.signal, cache: "no-store" },
      );
      if (!response.ok) throw new Error("Market data is temporarily unavailable.");

      const rawData = (await response.json()) as OHLCData[];
      const data = convertOHLCData(rawData);
      if (data.length === 0) throw new Error("No chart data is available for this range.");

      const series = seriesRef.current;
      const chart = chartRef.current;
      if (!series || !chart || controller.signal.aborted) return;

      series.setData(data);
      chart.timeScale().fitContent();
      setActivePeriod(period);
    } catch (requestError) {
      if (controller.signal.aborted) return;
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Market data is temporarily unavailable.",
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadPeriod("daily"), 0);
    return () => {
      window.clearTimeout(initialLoad);
      abortRef.current?.abort();
    };
  }, [loadPeriod]);

  return (
    <div className="chart-content">
      <div className="overview-toolbar">
        <div className="overview-coin">
          <Image src={coin.image} alt="" width={44} height={44} unoptimized />
          <div>
            <p className="overview-symbol">
              {coin.name} / {coin.symbol}
            </p>
            <p className="overview-price">{coin.currentPrice}</p>
          </div>
        </div>
        <div className="period-switch" aria-label="Chart timeframe">
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              aria-pressed={activePeriod === value}
              className={activePeriod === value ? "selected" : ""}
              key={value}
              onClick={() => void loadPeriod(value)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-area">
        <div
          aria-label={`${coin.name} price candlestick chart`}
          className="chart-container"
          ref={containerRef}
        />
        {(loading || error) && (
          <p className="chart-status" role={error ? "alert" : "status"}>
            {error ?? "Loading chart data…"}
          </p>
        )}
      </div>
    </div>
  );
}
