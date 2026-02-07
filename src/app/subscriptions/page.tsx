const plans = [
  {
    name: "Morning Ritual",
    price: "$48 / week",
    description: "Four breakfast sandwiches + two fresh juices."
  },
  {
    name: "Office Lunch",
    price: "$110 / week",
    description: "Five lunches with rotating bowls and sides."
  },
  {
    name: "Wellness Bundle",
    price: "$72 / week",
    description: "Three bowls + two smoothies and snack bites."
  }
];

export default function SubscriptionsPage() {
  return (
    <div className="section">
      <div className="container-padded grid gap-8">
        <div className="card p-6">
          <h2>Subscriptions</h2>
          <p className="text-sm text-ink-500">
            Weekly or monthly bundles curated by our chefs.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan.name} className="card border border-ink-100 p-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-ink-500">{plan.description}</p>
                <p className="mt-3 text-xl font-semibold text-ink-900">
                  {plan.price}
                </p>
                <button className="btn btn-primary mt-4 w-full">
                  Choose plan
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold">Pause or customize</h3>
          <p className="text-sm text-ink-500">
            Skip a week, update dietary preferences, and adjust delivery times.
          </p>
        </div>
      </div>
    </div>
  );
}
