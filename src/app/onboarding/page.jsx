'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Building2,
  Layers,
  BarChart3,
  Users,
  ShoppingCart,
  Headphones,
  Zap,
  Globe,
  ChevronRight,
} from 'lucide-react';
import { INDUSTRY_PROFILES } from '@/config/industry-terminology';

const HUB_ICONS = {
  crm: Users,
  sales: BarChart3,
  inbox: Headphones,
  marketing: Globe,
  service: Headphones,
  projects: Layers,
  commerce: ShoppingCart,
  hr: Users,
  finance: BarChart3,
  inventory: Building2,
  analytics: BarChart3,
  automation: Zap,
  settings: Building2,
};

const PLANS = [
  {
    id: 'starter',
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
    color: 'border-gray-200',
    badge: null,
  },
  {
    id: 'growth',
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
    color: 'border-blue-500',
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
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
    color: 'border-purple-500',
    badge: 'Best Value',
  },
];

// Group industries by category
function groupByCategory(profiles) {
  return Object.values(profiles).reduce((acc, profile) => {
    const cat = profile.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(profile);
    return acc;
  }, {});
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    companySize: '11-50',
    selectedIndustryId: null,
    selectedPlan: null,
    recommendations: {
      acceptedHubs: null,
      acceptedStages: null,
      acceptedTerminology: null,
    },
  });

  const selectedProfile = formData.selectedIndustryId
    ? INDUSTRY_PROFILES[formData.selectedIndustryId]
    : null;

  const handleIndustrySelect = async (industryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedIndustryId: industryId,
      recommendations: { acceptedHubs: null, acceptedStages: null, acceptedTerminology: null },
    }));
    // Save to backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/settings/organization`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ settings: { industryId } }),
          }
        );
      } catch (e) {
        // non-blocking
      }
    }
  };

  const handleAcceptRecommendation = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      recommendations: { ...prev.recommendations, [key]: value },
    }));
  };

  const handleStep1Next = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    if (!formData.selectedIndustryId) {
      setError('Please select your industry');
      return;
    }
    setError('');
    setCurrentStep(3);
  };

  const handlePlanSelect = (planId) => {
    setFormData((prev) => ({ ...prev, selectedPlan: planId }));
    router.push(`/onboarding/checkout?plan=${planId}`);
  };

  const categories = groupByCategory(INDUSTRY_PROFILES);

  return (
    <div className="py-8">
      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          {['Company Info', 'Select Industry', 'Choose Plan'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep > i + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${currentStep === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {label}
              </span>
              {i < 2 && <ChevronRight className="h-4 w-4 text-gray-300 mx-2 hidden sm:block" />}
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* ── Step 1: Company Info ── */}
      {currentStep === 1 && (
        <div data-step="1" className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Tell us about your company</h2>
          <p className="text-gray-500 mb-8">We'll set up Nexora to match your business.</p>

          <div className="space-y-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={(e) => setFormData((p) => ({ ...p, companySize: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500+">500+ employees</option>
              </select>
            </div>
            <button
              onClick={handleStep1Next}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Industry Selection ── */}
      {currentStep === 2 && (
        <div data-step="2">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">What industry are you in?</h2>
          <p className="text-gray-500 mb-6">
            We'll customize Nexora's terminology and pipeline for your business.
          </p>

          <div className="space-y-6">
            {Object.entries(categories).map(([category, profiles]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      data-industry-id={profile.id}
                      onClick={() => handleIndustrySelect(profile.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                        formData.selectedIndustryId === profile.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-2xl">{profile.emoji}</span>
                      <span className="text-xs font-medium text-gray-700 leading-tight">
                        {profile.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations Panel */}
          {selectedProfile && (
            <div className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{selectedProfile.emoji}</span>
                <h3 className="font-semibold text-gray-900">
                  {selectedProfile.label} Recommendations
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hub Recommendations */}
                <div
                  className={`bg-white rounded-xl border-2 p-4 transition-all ${formData.recommendations.acceptedHubs ? 'border-green-400' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">Recommended Hubs</h4>
                    {formData.recommendations.acceptedHubs && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {selectedProfile.recommendedHubs.map((hub) => {
                      const Icon = HUB_ICONS[hub] || Layers;
                      return (
                        <span
                          key={hub}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100"
                        >
                          <Icon className="h-3 w-3" />
                          {hub.charAt(0).toUpperCase() + hub.slice(1)}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    data-rec-action="use-hubs"
                    onClick={() =>
                      handleAcceptRecommendation('acceptedHubs', selectedProfile.recommendedHubs)
                    }
                    className={`w-full text-xs font-medium py-1.5 rounded-lg transition-colors ${formData.recommendations.acceptedHubs ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {formData.recommendations.acceptedHubs ? '✓ Applied' : 'Use These Hubs'}
                  </button>
                </div>

                {/* Pipeline Stages */}
                <div
                  className={`bg-white rounded-xl border-2 p-4 transition-all ${formData.recommendations.acceptedStages ? 'border-green-400' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">Pipeline Stages</h4>
                    {formData.recommendations.acceptedStages && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedProfile.pipelineStages.map((stage, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200"
                      >
                        {stage}
                      </span>
                    ))}
                  </div>
                  <button
                    data-rec-action="use-stages"
                    onClick={() =>
                      handleAcceptRecommendation('acceptedStages', selectedProfile.pipelineStages)
                    }
                    className={`w-full text-xs font-medium py-1.5 rounded-lg transition-colors ${formData.recommendations.acceptedStages ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {formData.recommendations.acceptedStages ? '✓ Applied' : 'Use These Stages'}
                  </button>
                </div>

                {/* Terminology Preview */}
                <div
                  className={`bg-white rounded-xl border-2 p-4 transition-all ${formData.recommendations.acceptedTerminology ? 'border-green-400' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">Terminology</h4>
                    {formData.recommendations.acceptedTerminology && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1 mb-3">
                    {Object.entries(selectedProfile.terminology || {})
                      .slice(0, 4)
                      .map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="text-gray-400 capitalize">{key}:</span>
                          <span className="font-medium text-gray-800">→ {val}</span>
                        </div>
                      ))}
                  </div>
                  <button
                    data-rec-action="use-terminology"
                    onClick={() =>
                      handleAcceptRecommendation('acceptedTerminology', selectedProfile.terminology)
                    }
                    className={`w-full text-xs font-medium py-1.5 rounded-lg transition-colors ${formData.recommendations.acceptedTerminology ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {formData.recommendations.acceptedTerminology
                      ? '✓ Applied'
                      : 'Apply Terminology'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3 max-w-sm">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStep2Next}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Plan Selection ── */}
      {currentStep === 3 && (
        <div data-step="3">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose your plan</h2>
          <p className="text-gray-500 mb-8">Start with 14 days free. No credit card required.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                data-plan-id={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${plan.color}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full text-white ${plan.id === 'growth' ? 'bg-blue-600' : 'bg-purple-600'}`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-2.5 font-medium rounded-lg transition-colors ${
                    plan.id === 'growth'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : plan.id === 'enterprise'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  Continue with {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={() => setCurrentStep(2)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
