import Image from "next/image";
import { fetcher } from "@/lib/coingecko";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface TrendingResponse {
  coins?: TrendingCoin[];
}

async function getTopMovers(): Promise<TrendingCoin[]> {
  const response = await fetcher<TrendingResponse>("/search/trending");
  return Array.isArray(response.coins)
    ? response.coins.slice(0, 5).map(({ item }) => item)
    : [];
}

function TopMoversError() {
  return (
    <section className="market-card trending-card" aria-labelledby="trending-title">
      <h2 id="trending-title" className="market-card-title">
        Trending
      </h2>
      <p className="market-error" role="status">
        Trending coins are temporarily unavailable. Please try again shortly.
      </p>
    </section>
  );
}

export default async function TopMovers() {
  try {
    const items = await getTopMovers();
    if (items.length === 0) return <TopMoversError />;

    return (
      <section className="market-card trending-card" aria-labelledby="trending-title">
        <h2 id="trending-title" className="market-card-title">
          Trending
        </h2>
        <ul className="trending-list">
          {items.map((item) => {
            const change = item.data.price_change_percentage_24h.usd;

            return (
              <li className="trending-row" key={item.id}>
                <div className="trending-asset">
                  <Image
                    src={item.large || item.thumb}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                  />
                  <div className="trending-name">
                    <span>{item.name}</span>
                    <small>{item.symbol.toUpperCase()}</small>
                  </div>
                </div>
                <span className={`trending-change ${change >= 0 ? "positive" : "negative"}`}>
                  {change > 0 ? "+" : ""}{formatPercentage(change)}
                </span>
                <span className="trending-price">{formatCurrency(item.data.price)}</span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  } catch {
    return <TopMoversError />;
  }
}
