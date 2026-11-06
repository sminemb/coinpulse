import { PERIOD_CONFIG, type ChartPeriod } from "@/constants";
import { fetcher } from "@/lib/coingecko";

export async function GET(request: Request) {
  const period = new URL(request.url).searchParams.get("period");

  if (!period || !Object.hasOwn(PERIOD_CONFIG, period)) {
    return Response.json({ error: "Invalid chart period." }, { status: 400 });
  }

  const { days } = PERIOD_CONFIG[period as ChartPeriod];

  try {
    const data = await fetcher<OHLCData[]>(
      `/coins/bitcoin/ohlc?vs_currency=usd&days=${days}`,
    );
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Market data is temporarily unavailable." },
      { status: 502 },
    );
  }
}
