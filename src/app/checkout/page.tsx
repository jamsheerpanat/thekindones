"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Spinner } from "@/components/Spinner";

// --- Icons ---
const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
    <path d="M14 17h1" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const StoreIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);

const CreditCardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);

const BanknoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CheckoutPage() {
  const { items, summary, clear, governorates, selectedGovernorate, setGovernorate } = useCart();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const { data: session, status } = useSession();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Guest/User details state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Autofetch user details when session changes
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");

    try {
      const payload = {
        items: items.map((item) => ({
          menuItemId: item.product.id,
          quantity: item.quantity,
          modifiers: item.modifiers,
        })),
        method,
        paymentMethod,
        governorateId: method === "delivery" ? selectedGovernorate : undefined,
        guest: !session ? { name, email, phone } : undefined
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Unable to place order.");
      }

      const data = await res.json();

      // Clear the cart on success
      clear();

      // Redirect to success page
      window.location.href = `/orders/${data.id}?success=true`;
    } catch (err: any) {
      setError(err.message);
      setPlacing(false);
    }
  };

  const StepIndicator = ({ step, title, active }: { step: number; title: string, active?: boolean }) => (
    <div className={`flex items-center gap-3 mb-6 transition-opacity ${active === false ? 'opacity-50' : 'opacity-100'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-sm transition-colors ${active === false ? 'bg-ink-100 text-ink-400' : 'bg-ink-900 text-white'}`}>
        {step}
      </div>
      <h3 className="text-lg md:text-xl font-display font-semibold text-ink-900">{title}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50 py-12 md:py-20 animate-fade-in relative z-0">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none -z-10" />

      <div className="container-padded relative z-10">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-ink-900 mb-2">
          Checkout
        </h1>
        <p className="text-ink-500 mb-10 text-lg">Complete your order securely.</p>

        <div className="grid gap-8 lg:grid-cols-[1.6fr,1.1fr] items-start">

          {/* Left Column: Checkout Steps */}
          <div className="space-y-6">

            {/* Step 1: Delivery Method */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-ink-100/60 hover:shadow-md transition-shadow duration-300">
              <StepIndicator step={1} title="How would you like to receive your order?" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMethod("delivery")}
                  className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${method === "delivery"
                    ? "border-ink-900 bg-ink-50 shadow-inner"
                    : "border-ink-100 bg-white hover:border-ink-300 hover:bg-ink-50/50"
                    }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${method === "delivery" ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-500 group-hover:text-ink-700"}`}>
                    <TruckIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="block font-bold text-ink-900 text-lg mb-1">Delivery</span>
                    <span className="text-sm text-ink-500 font-medium leading-relaxed">We'll bring it to your door.</span>
                  </div>
                  {method === "delivery" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-ink-900 rounded-full flex items-center justify-center animate-scale-in">
                      <CheckIcon className="text-white" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("pickup")}
                  className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${method === "pickup"
                    ? "border-ink-900 bg-ink-50 shadow-inner"
                    : "border-ink-100 bg-white hover:border-ink-300 hover:bg-ink-50/50"
                    }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${method === "pickup" ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-500 group-hover:text-ink-700"}`}>
                    <StoreIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="block font-bold text-ink-900 text-lg mb-1">Pickup</span>
                    <span className="text-sm text-ink-500 font-medium leading-relaxed">Collect from Tahlia branch.</span>
                  </div>
                  {method === "pickup" && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-ink-900 rounded-full flex items-center justify-center animate-scale-in">
                      <CheckIcon className="text-white" />
                    </div>
                  )}
                </button>
              </div>

              {/* Dynamic Inputs based on Method */}
              <div className="mt-8 pt-8 border-t border-ink-100 animate-fade-in">
                {method === "delivery" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Street Address</label>
                      <input className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all" placeholder="123 King Fahd Rd" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Governorate</label>
                      <select
                        className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all w-full"
                        value={selectedGovernorate || ""}
                        onChange={(e) => setGovernorate(e.target.value)}
                        required={method === "delivery"}
                      >
                        <option value="">Select Governorate</option>
                        {governorates.map((gov) => (
                          <option key={gov.id} value={gov.id}>
                            {gov.name} ({formatPrice(Number(gov.deliveryFee))})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Apartment / Unit</label>
                      <input className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all" placeholder="Unit 402" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Delivery Instructions (Optional)</label>
                      <textarea className="input min-h-[80px] py-3 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all resize-none" placeholder="Leave at the door, ring doorbell, etc." />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-brand-50 border border-brand-100/50 p-5 flex gap-4 text-ink-800">
                    <div className="p-2 bg-white rounded-lg shadow-sm h-fit text-brand-600">
                      <StoreIcon width={24} height={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">The Kind Ones - Tahlia Branch</h4>
                      <p className="text-sm text-ink-600 leading-relaxed max-w-md">
                        King Abdulaziz Road, Riyadh.<br />
                        Usually ready in 15-20 minutes. Parking spots available in front.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Personal Details */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-ink-100/60 hover:shadow-md transition-shadow duration-300">
              <StepIndicator step={2} title="Contact Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Email Address</label>
                  <input
                    className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all disabled:opacity-60 disabled:bg-ink-100/50"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "authenticated"}
                  />
                  {!session && (
                    <p className="text-[10px] text-brand-600 font-bold uppercase tracking-tighter ml-1">
                      Account will be created automatically
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Full Name</label>
                  <input
                    className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-400 ml-1">Phone Number</label>
                  <input
                    className="input h-12 bg-ink-50/30 border-ink-200 focus:bg-white focus:border-ink-900 transition-all"
                    placeholder="+966 5..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-ink-100/60 hover:shadow-md transition-shadow duration-300">
              <StepIndicator step={3} title="Payment Method" />

              <div className="flex flex-col gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "card"
                    ? "border-ink-900 bg-ink-50"
                    : "border-ink-100 bg-white hover:bg-ink-50/30"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className={paymentMethod === "card" ? "text-ink-900" : "text-ink-500"} />
                    <span className="font-semibold text-ink-900">Credit / Debit Card</span>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="w-5 h-5 bg-ink-900 rounded-full flex items-center justify-center animate-scale-in">
                      <CheckIcon className="text-white w-3 h-3" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "cash"
                    ? "border-ink-900 bg-ink-50"
                    : "border-ink-100 bg-white hover:bg-ink-50/30"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <BanknoteIcon className={paymentMethod === "cash" ? "text-ink-900" : "text-ink-500"} />
                    <span className="font-semibold text-ink-900">Cash on Delivery</span>
                  </div>
                  {paymentMethod === "cash" && (
                    <div className="w-5 h-5 bg-ink-900 rounded-full flex items-center justify-center animate-scale-in">
                      <CheckIcon className="text-white w-3 h-3" />
                    </div>
                  )}
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="p-6 border border-ink-200 rounded-2xl bg-ink-50/30 space-y-6 hover:border-ink-300 transition-colors animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-ink-200/50">
                    <span className="font-bold text-ink-900 flex items-center gap-3">
                      Secure Card Payment
                    </span>
                    <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div className="w-10 h-6 bg-orange-500 rounded"></div>
                      <div className="w-10 h-6 bg-black rounded"></div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="relative group">
                      <input className="input h-12 pl-12 bg-white border-ink-200 focus:border-ink-900 transition-all font-mono" placeholder="0000 0000 0000 0000" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
                        <CreditCardIcon width={18} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <input className="input h-12 w-full bg-white border-ink-200 focus:border-ink-900 transition-all text-center" placeholder="MM / YY" />
                      <input className="input h-12 w-full bg-white border-ink-200 focus:border-ink-900 transition-all text-center" placeholder="CVC" />
                    </div>
                    <input className="input h-12 bg-white border-ink-200 focus:border-ink-900 transition-all" placeholder="Name on Card" />
                  </div>
                  <p className="mt-5 text-xs text-center text-ink-400 flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Payments are processed securely via Stripe. Your data is encrypted.
                  </p>
                </div>
              ) : (
                <div className="p-6 border border-brand-200 rounded-2xl bg-brand-50/50 space-y-3 animate-fade-in text-center">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BanknoteIcon />
                  </div>
                  <p className="text-ink-900 font-bold text-lg">Pay with Cash</p>
                  <p className="text-sm text-ink-600 max-w-xs mx-auto">
                    Please have the exact amount ready upon delivery to help us serve you faster.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:sticky lg:top-28 space-y-6 animate-fade-up delay-100">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-crisp border border-ink-100/80">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-bold text-ink-900">Your Order</h3>
                <Link href="/cart" className="text-sm font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors">
                  Edit Cart
                </Link>
              </div>

              <div className="space-y-6 mb-8 relative max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-ink-400">
                    <p>Your cart is empty.</p>
                  </div>
                ) : items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 bg-ink-100 rounded-2xl overflow-hidden flex-shrink-0 border border-ink-50 shadow-sm group-hover:shadow-md transition-all">
                      {item.product.image && <img src={item.product.image} alt={item.product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />}
                      <span className="absolute top-0 right-0 bg-ink-900 text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-bl-xl font-bold shadow-sm">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-base font-bold text-ink-900 leading-tight line-clamp-2">{item.product.name}</p>
                        <p className="text-sm font-bold text-ink-900 whitespace-nowrap">
                          {formatPrice((item.product.price + item.modifiers.reduce((sum, option) => sum + (option.priceDelta || 0), 0)) * item.quantity)}
                        </p>
                      </div>
                      <p className="text-xs text-ink-500 mt-1 line-clamp-1 font-medium">
                        {item.modifiers.length > 0 ? item.modifiers.map(m => m.label).join(", ") : "Original"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-dashed border-ink-100 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-ink-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-ink-900">{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-ink-500 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-ink-900">{formatPrice(summary.deliveryFee)}</span>
                </div>

                <div className="pt-4 mt-2 border-t border-ink-100">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-ink-900">Total</span>
                    <span className="text-3xl font-display font-bold text-ink-900 tracking-tight">{formatPrice(summary.total)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-medium rounded-2xl border border-red-100 flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <button
                className="w-full relative overflow-hidden group btn btn-primary mt-8 py-4 text-lg font-bold shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {placing ? (
                    <>
                      <Spinner size="sm" color="white" className="-ml-1 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {paymentMethod === "cash" ? "Place Order" : `Pay ${formatPrice(summary.total)}`}
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </div>

            <div className="bg-ink-900 rounded-[2rem] p-8 text-white text-center relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <h4 className="font-display font-semibold text-lg mb-2">The Kind Ones Promise</h4>
                <p className="text-sm text-ink-300 leading-relaxed">
                  We guarantee fast delivery and fresh ingredients. If something's wrong, we'll fix it instantly.
                </p>
              </div>
              {/* Decorative background blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
