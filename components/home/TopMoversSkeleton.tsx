export default function TopMoversSkeleton() {
  return (
    <section
      className="market-card trending-card market-skeleton"
      aria-label="Loading top movers"
      aria-busy="true"
    >
      <h2 id="top-movers-skeleton-title" className="market-card-title">
        <span className="skeleton-block title-skeleton" />
      </h2>
      <ul className="trending-list">
        {Array.from({ length: 5 }, (_, index) => (
          <li className="trending-row" key={index}>
            <div className="trending-asset">
              <span className="skeleton-block avatar-skeleton" />
              <div className="trending-name">
                <span className="skeleton-block name-skeleton" />
                <span className="skeleton-block symbol-skeleton" />
              </div>
            </div>
            <span className="skeleton-block change-skeleton" />
            <span className="skeleton-block price-skeleton" />
          </li>
        ))}
      </ul>
    </section>
  );
}
