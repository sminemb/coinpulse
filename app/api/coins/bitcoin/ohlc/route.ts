import { PERIOD_CONFIG, type ChartPeriod } from "@/constants";
import { fetcher } from "@/lib/coingecko";

export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get("period");

  if (!period || !Object.hasOwn(PERIOD_CONFIG, period)) {
    return Response.json({ error: "Invalid chart period." }, { status: 400 });
  }

  const { days } = PERIOD_CONFIG[period as ChartPeriod];

  try {
    let data: OHLCData[];

    try {
      data = await fetcher<OHLCData[]>(
        `/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`,
      );
    } catch (error) {
      if (period !== "max") throw error;

      // Some CoinGecko plans reject `days=max`; 365 days is the longest
      // standard range supported across plans and keeps Max usable there.
      data = await fetcher<OHLCData[]>(
        "/coins/bitcoin/ohlc?vs_currency=usd&days=365",
      );
    }

    if (period === "max" && data.length === 0) {
      data = await fetcher<OHLCData[]>(
        "/coins/bitcoin/ohlc?vs_currency=usd&days=365",
      );
    }

    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("CoinGecko OHLC request failed", {
      period,
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json(
      { error: "Market data is temporarily unavailable." },
      { status: 502 },
    );
  }
}
