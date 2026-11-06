import type { CSSProperties } from "react";
import Image from "next/image";
import { fetcher } from "@/lib/coingecko";
import { formatCurrency } from "@/lib/utils";

interface MarketChartData {
  prices: [number, number][];
  total_volumes: [number, number][];
}

function chartValues(prices: [number, number][]) {
  const values = prices.map((point) => point[1]);
  const low = Math.min(...values);
  const range = Math.max(...values) - low || 1;

  return values.map((price, index) => {
    const previous = values[Math.max(index - 1, 0)];
    const delta = price - previous;
    const height = Math.max(12, Math.min(78, 22 + (Math.abs(delta) / range) * 400));
    return { height, offset: 50 - ((price - low) / range) * 58, up: delta >= 0 };
  });
}

function OverviewError() {
  return <section className="market-card coin-overview" aria-labelledby="overview-title"><h2 id="overview-title" className="market-card-title">Chart</h2><p className="market-error" role="status">Market data is temporarily unavailable. Please try again shortly.</p></section>;
}

async function getOverviewData() {
  try {
    const [coins, chart] = await Promise.all([
      fetcher<CoinMarketData[]>("/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h"),
      fetcher<MarketChartData>("/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly"),
    ]);
    const bitcoin = coins[0];
    return bitcoin && chart.prices.length > 0 ? { bitcoin, chart } : null;
  } catch {
    return null;
  }
}

export default async function CoinOverview() {
  const data = await getOverviewData();
  if (!data) return <OverviewError />;

  const { bitcoin, chart } = data;
  const candles = chartValues(chart.prices);
  const volumes = chart.total_volumes.slice(-candles.length).map((point) => point[1]);
  const maxVolume = Math.max(...volumes, 1);
  const prices = chart.prices.map((point) => point[1]);
  const low = Math.min(...prices);
  const range = Math.max(...prices) - low;
  const axisLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 0 }).format(low + range * ratio),
  );

  return (
      <section className="market-card coin-overview" aria-labelledby="overview-title">
        <div className="market-card-heading">
          <h2 id="overview-title" className="market-card-title">Chart</h2>
          <span className="currency-chip"><span aria-hidden="true">●</span> USD <span aria-hidden="true">⌄</span></span>
        </div>
        <div className="overview-toolbar">
          <div className="overview-coin">
            <Image src={bitcoin.image} alt="" width={44} height={44} unoptimized />
            <div><p className="overview-symbol">{bitcoin.name} / {bitcoin.symbol.toUpperCase()}</p><p className="overview-price">{formatCurrency(bitcoin.current_price)}</p></div>
          </div>
          <div className="period-switch" aria-label="Chart timeframe"><span className="selected">1h</span><span>3h</span><span>1d</span><span>1w</span><span>1m</span></div>
        </div>
        <div className="chart-plot" role="img" aria-label="Bitcoin price chart">
          <div className="chart-y-labels" aria-hidden="true">{axisLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}</div>
          <div className="chart-candles" aria-hidden="true">
            {candles.map(({ height, offset, up }, index) => <span className={`candle ${up ? "candle-up" : "candle-down"}`} key={index} style={{ "--candle-height": `${height}%`, "--candle-offset": `${offset}%`, "--wick-height": `${Math.min(height + 18, 98)}%` } as CSSProperties}><i /></span>)}
            <span className="chart-current-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(bitcoin.current_price)}</span>
          </div>
          <div className="chart-x-labels" aria-hidden="true"><span>24h ago</span><span>20h</span><span>16h</span><span>12h</span><span>8h</span><span>4h</span><span>Now</span></div>
        </div>
        <div className="chart-volume" aria-hidden="true">{volumes.map((volume, index) => <span key={index} style={{ height: `${Math.max(5, (volume / maxVolume) * 28)}px` }} />)}</div>
      </section>
  );
}
