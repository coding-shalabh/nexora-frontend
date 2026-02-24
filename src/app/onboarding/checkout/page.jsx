'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import IndustrySeedPopup from '@/components/billing/industry-seed-popup';

const PLAN_DETAILS = {
  starter: {
    name: 'Starter',
    price: '₹1,999',
    period: '/month',
    features: [
      'Up to 5 users',
      '5,000 contacts',
      'CRM & Sales',
      'Email support',
      'Basic analytics',
    ],
    color: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    badge: null,
  },
  growth: {
    name: 'Growth',
    price: '₹4,999',
    period: '/month',
    features: [
      'Up to 25 users',
      '50,000 contacts',
      'All hubs included',
      'Priority support',
      'Advanced analytics',
      'Automation workflows',
    ],
    color: 'from-blue-50 to-indigo-100',
    border: 'border-blue-300',
    badge: 'Most Popular',
  },
  enterprise: {
    name: 'Enterprise',
    price: '₹12,999',
    period: '/month',
    features: [
      'Unlimited users',
      'Unlimited contacts',
      'All hubs + custom',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    color: 'from-purple-50 to-purple-100',
    border: 'border-purple-300',
    badge: 'Best Value',
  },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan') || 'growth';
  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS.growth;

  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSeedPopup, setShowSeedPopup] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        setShowSeedPopup(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  return (
    <div className="py-8 max-w-xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {paymentSuccess ? "You're all set! 🎉" : 'Complete your subscription'}
        </h2>
        <p className="text-gray-500 mt-1">
          {paymentSuccess
            ? `Your ${plan.name} plan is now active.`
            : '14-day free trial included. Cancel anytime.'}
        </p>
      </div>

      {!paymentSuccess ? (
        <>
          {/* Plan Summary Card */}
          <div
            className={`rounded-2xl border-2 ${plan.border} bg-gradient-to-br ${plan.color} p-6 mb-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name} Plan</h3>
                  {plan.badge && (
                    <span className="text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {plan.price}
                  <span className="text-base font-normal text-gray-500">{plan.period}</span>
                </p>
              </div>
              <Sparkles className="h-8 w-8 text-blue-500" />
            </div>

            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 text-sm">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>{plan.name} Plan (monthly)</span>
              <span>{plan.price}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>14-day trial</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Due today</span>
              <span className="text-green-600">₹0.00</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              First charge on{' '}
              {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            data-subscribe-btn="true"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Subscribe to {plan.name} Plan
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Secure checkout · Cancel anytime · No hidden fees
          </p>
        </>
      ) : (
        /* Success State */
        <div data-payment-success="true" className="text-center py-8">
          <div className="relative inline-flex mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <div className="absolute -inset-2 rounded-full border-4 border-green-200 animate-ping opacity-30" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to Nexora!</h3>
          <p className="text-gray-600 mb-6">
            Your <strong>{plan.name}</strong> plan is now active.
            <br />
            Setting up your workspace...
          </p>

          <div className="flex justify-center gap-1.5">
            {['Activating hubs', 'Configuring settings', 'Almost ready'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                {step}
                {i < 2 && <span className="text-gray-300 ml-1.5">·</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Industry Seed Popup */}
      {showSeedPopup && (
        <div data-seed-popup="true">
          <IndustrySeedPopup open={showSeedPopup} onClose={() => setShowSeedPopup(false)} />
        </div>
      )}
    </div>
  );
}
