const COINGECKO_API = "https://api.coingecko.com/api/v3";

export async function fetcher<T>(endpoint: string): Promise<T> {
  const baseUrl = (process.env.COINGECKO_BASE_URL || COINGECKO_API).replace(/\/$/, "");
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const apiKey = process.env.COINGECKO_API_KEY || process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey
    ? { [baseUrl.includes("pro-api.coingecko.com") ? "x-cg-pro-api-key" : "x-cg-demo-api-key"]: apiKey }
    : {};

  try {
    const response = await fetch(url, { cache: "no-store", headers });

    if (!response.ok) {
      let detail = response.statusText;
      try {
        const body: unknown = await response.json();
        if (body && typeof body === "object" && "error" in body) {
          const error = (body as { error?: unknown }).error;
          if (typeof error === "string") detail = error;
        }
      } catch {
        // Keep the HTTP status text when the error body is not JSON.
      }
      throw new Error(`CoinGecko request failed (${response.status}): ${detail}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("CoinGecko request failed")) {
      throw error;
    }
    throw new Error(`Could not reach CoinGecko: ${error instanceof Error ? error.message : "Unknown network error"}`);
  }
}
