"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const steps = [
  { title: "Order Accepted", time: "Just now", active: true },
  { title: "Kitchen started", time: "Pending", active: false },
  { title: "Courier assigned", time: "Pending", active: false },
  { title: "Out for delivery", time: "Pending", active: false },
  { title: "Arriving soon", time: "Pending", active: false }
];

export default function OrderTrackingPage({
  params
}: {
  params: { id: string };
}) {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-ink-50 pt-24 pb-20">
      <div className="container-padded max-w-5xl">

        {isSuccess && (
          <div className="mb-10 text-center animate-fade-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-500 rounded-full mb-6 shadow-xl shadow-brand-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-ink-900 mb-4 tracking-tight">
              Order Successful!
            </h1>
            <p className="text-lg text-ink-500 max-w-lg mx-auto leading-relaxed">
              Thank you for choosing The Kind Ones. We've received your order and our chefs are already getting started.
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-start">

          {/* Main Status Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-crisp border border-ink-100/60 transition-all hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-ink-100/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-400 mb-2"> Live Order Status </p>
                <h2 className="text-2xl font-bold text-ink-900 font-display">Order #{params.id.slice(-8).toUpperCase()}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-5 py-2.5 bg-brand-50 rounded-full border border-brand-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
                  <span className="text-sm font-black text-brand-600 uppercase tracking-widest">ETA: 25-35 MIN</span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-ink-100" />

              <div className="space-y-10">
                {steps.map((step, index) => (
                  <div key={step.title} className={`relative flex items-start gap-6 group transition-all ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`relative z-10 w-8 h-8 rounded-full border-4 flex-shrink-0 transition-all duration-500 ${step.active
                        ? 'bg-ink-900 border-brand-500 shadow-lg shadow-ink-900/10 scale-110'
                        : 'bg-white border-ink-200 group-hover:border-ink-300'
                      }`}
                    />
                    <div className="flex-1 -mt-1">
                      <div className="flex justify-between items-center">
                        <p className={`text-lg font-bold tracking-tight ${step.active ? 'text-ink-900' : 'text-ink-400'}`}>
                          {step.title}
                        </p>
                        <span className={`text-xs font-bold ${step.active ? 'text-brand-600' : 'text-ink-300'}`}>
                          {step.time}
                        </span>
                      </div>
                      {step.active && (
                        <p className="text-sm text-ink-500 mt-1 animate-in fade-in duration-700">
                          {index === 0 ? "Your order is confirmed and waiting for the kitchen." : "Currently in progress"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 p-6 bg-ink-50 rounded-2xl flex items-center justify-center gap-4 border border-ink-100/50">
              <button className="text-sm font-bold text-ink-900 hover:text-brand-600 transition-colors uppercase tracking-widest">Need help with this order?</button>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-ink-100/60">
              <h3 className="text-xl font-display font-bold text-ink-900 mb-4">Delivery Details</h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-ink-50 border border-ink-100/50 mb-6">
                <div className="w-12 h-12 bg-ink-200 rounded-full flex items-center justify-center text-xl overflow-hidden">
                  👨‍🍳
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-900 leading-tight">Finding Courier...</p>
                  <p className="text-xs text-ink-500 font-medium">Assigning best driver nearby</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-2 border-b border-ink-50">
                  <span className="text-ink-400 font-medium">Method</span>
                  <span className="font-bold text-ink-900">Standard Delivery</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-ink-400 font-medium">Contact</span>
                  <span className="font-bold text-ink-900">Registered Number</span>
                </div>
              </div>
            </div>

            <div className="bg-ink-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-ink-900/40">
              <h4 className="text-xl font-display font-bold mb-4 relative z-10">Rate your experience?</h4>
              <p className="text-sm text-ink-300 leading-relaxed mb-6 relative z-10">
                Let us know how we did! Your feedback helps us maintain the highest standards of quality.
              </p>
              <div className="flex gap-2 relative z-10">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center text-lg">
                    ⭐
                  </button>
                ))}
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl" />
            </div>

            <Link
              href="/menu"
              className="w-full flex items-center justify-center gap-2 py-5 bg-white rounded-2xl border-2 border-ink-900 text-ink-900 font-black uppercase tracking-[0.2em] hover:bg-ink-900 hover:text-white transition-all group"
            >
              <span>Return to Menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
