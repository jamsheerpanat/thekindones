import Link from "next/link";

const steps = [
  { title: "Order placed", time: "11:12" },
  { title: "Kitchen started", time: "11:16" },
  { title: "Courier assigned", time: "11:24" },
  { title: "Out for delivery", time: "11:32" },
  { title: "Arriving soon", time: "11:45" }
];

export default function OrderTrackingPage({
  params
}: {
  params: { id: string };
}) {
  return (
    <div className="section">
      <div className="container-padded grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                Order tracking
              </p>
              <h2 className="mt-2">Order #{params.id}</h2>
            </div>
            <span className="chip bg-brand-200 text-ink-900">
              ETA 18 min
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-start gap-4">
                <div
                  className={
                    index === steps.length - 1
                      ? "h-3 w-3 rounded-full bg-brand-400"
                      : "h-3 w-3 rounded-full bg-ink-200"
                  }
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">
                    {step.title}
                  </p>
                  <p className="text-xs text-ink-400">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-6">
            <h3 className="text-xl font-semibold">Courier details</h3>
            <p className="text-sm text-ink-500">
              Fadi A. is headed your way in a black Lexus.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="chip">Call courier</span>
              <span className="chip">Share status</span>
            </div>
          </div>
          <div className="card p-6">
            <h4 className="text-lg font-semibold">Need to update?</h4>
            <p className="text-sm text-ink-500">
              Add a note or change delivery instructions.
            </p>
            <Link href="/account" className="btn btn-outline mt-4">
              Update delivery info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
