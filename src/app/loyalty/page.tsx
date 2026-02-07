export default function LoyaltyPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8">
        <div className="card p-6">
          <h2>Loyalty program</h2>
          <p className="text-sm text-ink-500">
            Earn points, unlock surprise tastings, and get priority access to new
            menus.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Current tier
              </p>
              <p className="text-lg font-semibold text-ink-900">Bronze</p>
            </div>
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Points balance
              </p>
              <p className="text-lg font-semibold text-ink-900">1,420</p>
            </div>
            <div className="card border border-ink-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Next reward
              </p>
              <p className="text-lg font-semibold text-ink-900">80 points</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-xl font-semibold">Member rewards</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li>Free dessert every 4th visit</li>
              <li>Priority seating for reservations</li>
              <li>Exclusive member-only tastings</li>
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="text-xl font-semibold">How to earn</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-600">
              <li>1 point for every $1 spent</li>
              <li>Double points on weekend mornings</li>
              <li>Bonus points for referrals</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
