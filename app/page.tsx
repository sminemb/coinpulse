import { Suspense } from "react";
import CoinOverview from "@/components/home/CoinOverview";
import CoinOverviewSkeleton from "@/components/home/CoinOverviewSkeleton";
import TopMovers from "@/components/home/TopMovers";
import TopMoversSkeleton from "@/components/home/TopMoversSkeleton";

export default function Page() {
  return (
    <main className="main-container">
      <section className="home-grid">
        <Suspense fallback={<CoinOverviewSkeleton />}>
          <CoinOverview />
        </Suspense>
        <Suspense fallback={<TopMoversSkeleton />}>
          <TopMovers />
        </Suspense>
      </section>
    </main>
  );
}
