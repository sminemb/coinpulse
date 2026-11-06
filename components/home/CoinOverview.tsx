import CandlestickChart from "@/components/home/CandlestickChart";
import { fetcher } from "@/lib/coingecko";
import { formatCurrency } from "@/lib/utils";

function OverviewError() {
  return (
    <section className="market-card coin-overview" aria-label="Bitcoin price chart">
      <p className="market-error" role="status">
        Market data is temporarily unavailable. Please try again shortly.
      </p>
    </section>
  );
}

async function getOverviewData() {
  try {
    const coins = await fetcher<CoinMarketData[]>(
      "/coins/markets?vs_currency=usd&ids=bitcoin&price_change_percentage=24h",
    );
    const bitcoin = coins[0];
    return bitcoin ?? null;
  } catch {
    return null;
  }
}

export default async function CoinOverview() {
  const bitcoin = await getOverviewData();
  if (!bitcoin) return <OverviewError />;

  return (
      <section className="market-card coin-overview" aria-label="Bitcoin price chart">
        <CandlestickChart
          coin={{
            image: bitcoin.image,
            name: bitcoin.name,
            symbol: bitcoin.symbol.toUpperCase(),
            currentPrice: formatCurrency(bitcoin.current_price),
            currentPriceValue: bitcoin.current_price,
          }}
        />
      </section>
  );
}
