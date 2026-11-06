export default function CoinOverviewSkeleton() {
  return <section className="market-card coin-overview market-skeleton" aria-label="Loading Bitcoin chart" aria-busy="true">
    <div className="overview-toolbar"><div className="overview-coin"><span className="skeleton-block avatar-skeleton" /><div><span className="skeleton-block name-skeleton" /><span className="skeleton-block price-skeleton" /></div></div><div className="period-switch"><span className="skeleton-block period-skeleton" /><span className="skeleton-block period-skeleton" /><span className="skeleton-block period-skeleton" /></div></div>
    <div className="skeleton-block chart-skeleton" />
  </section>;
}
