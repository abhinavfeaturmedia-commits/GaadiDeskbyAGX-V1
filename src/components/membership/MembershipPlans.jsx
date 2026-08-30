import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  Crown,
  Sparkles,
  Tag,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

export const MembershipPlans = ({ onClose }) => {
  const { business, setBusiness, formatCurrency, t } = useApp();

  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successPlan, setSuccessPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      vehicles: 5,
      staff: 1,
      monthlyPrice: 499,
      yearlyPrice: 4999,
      description: 'Ideal for small owner-drivers & fleets',
      badge: 'POPULAR'
    },
    {
      id: 'growth',
      name: 'Growth Plan',
      vehicles: 15,
      staff: 3,
      monthlyPrice: 1499,
      yearlyPrice: 14999,
      description: 'Typical city cab & outstation operator',
      badge: 'RECOMMENDED'
    },
    {
      id: 'business',
      name: 'Business Fleet',
      vehicles: 40,
      staff: 8,
      monthlyPrice: 2999,
      yearlyPrice: 29999,
      description: 'Multi-driver agency with high volume',
      badge: 'PRO'
    },
    {
      id: 'agency',
      name: 'Agency Enterprise',
      vehicles: 100,
      staff: 15,
      monthlyPrice: 4999,
      yearlyPrice: 49999,
      description: 'Large travel agency & rental mix',
      badge: 'UNLIMITED'
    }
  ];

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'MAHA50') {
      setDiscountPercent(50);
      setCouponMessage('🎉 Coupon MAHA50 applied! Flat 50% OFF on SaaS membership.');
    } else {
      setDiscountPercent(0);
      setCouponMessage('❌ Invalid coupon code. Try MAHA50');
    }
  };

  const handleUpgrade = (plan) => {
    setIsProcessing(true);
    setTimeout(() => {
      setBusiness(prev => ({
        ...prev,
        membershipPlan: plan.id,
        vehicleLimit: plan.vehicles,
        staffLimit: plan.staff,
        membershipExpires: '2027-08-30'
      }));
      setIsProcessing(false);
      setSuccessPlan(plan);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-[#FBF8F2] rounded-4xl max-w-[430px] w-full max-h-[92vh] flex flex-col shadow-2xl border border-card-border overflow-hidden">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-card-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-accent-amber/20 flex items-center justify-center text-accent-amber font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">{t('membershipTitle')}</h3>
              <p className="text-[11px] text-text-secondary">Official B2B SaaS Plans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {successPlan ? (
            <div className="bg-white rounded-3xl p-6 text-center border border-green-200 shadow-soft space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
              <h4 className="text-base font-extrabold text-gray-900">
                🎉 Congratulations! You are on {successPlan.name}
              </h4>
              <p className="text-xs text-text-secondary">
                Your account now supports up to <b>{successPlan.vehicles} vehicles</b> and <b>{successPlan.staff} staff logins</b>. Valid till 30 August 2027.
              </p>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-full bg-accent-amber text-white text-xs font-bold shadow-glow-amber"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Billing Toggle (Monthly / Yearly) */}
              <div className="bg-white rounded-2xl p-1 border border-card-border flex items-center shadow-xs">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    billingCycle === 'monthly' ? 'bg-accent-lime text-[#1E232A] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    billingCycle === 'yearly' ? 'bg-accent-lime text-[#1E232A] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  <span>Yearly (2 Mos Free)</span>
                  <span className="text-[9px] bg-red-500 text-white px-1 rounded-sm">SAVE 17%</span>
                </button>
              </div>

              {/* Coupon Box */}
              <div className="bg-white rounded-2xl p-3 border border-card-border space-y-1.5 shadow-soft">
                <div className="flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-accent-amber" />
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. MAHA50)"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#FBF8F2] border border-card-border rounded-xl px-2.5 py-1 text-xs font-mono font-bold uppercase text-gray-900 focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3 py-1 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className="text-[10px] font-bold text-green-700">{couponMessage}</p>
                )}
              </div>

              {/* Plans List */}
              <div className="space-y-3">
                {plans.map(plan => {
                  const isCurrent = business.membershipPlan === plan.id;
                  let rawPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                  let finalPrice = discountPercent > 0 ? Math.round(rawPrice * (1 - discountPercent / 100)) : rawPrice;

                  return (
                    <div
                      key={plan.id}
                      className={`bg-white rounded-3xl p-4 border transition-all shadow-soft space-y-3 ${
                        isCurrent ? 'border-2 border-accent-amber ring-2 ring-accent-amber/20' : 'border-card-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-extrabold text-gray-900">{plan.name}</h4>
                            <span className="text-[9px] font-extrabold bg-accent-lime text-[#1E232A] px-2 py-0.5 rounded-full">
                              {plan.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-secondary">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gray-900">
                            {formatCurrency(finalPrice)}
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#FBF8F2] rounded-2xl p-2.5 border border-card-border space-y-1 text-xs text-gray-700">
                        <div className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Up to <b>{plan.vehicles} Vehicles</b> in Fleet</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span><b>{plan.staff} Staff Login</b> Accounts</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Unlimited WhatsApp Slips & GST Invoices</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                          <span>Auto Expiry Alerts & Conflict Detection</span>
                        </div>
                      </div>

                      <button
                        disabled={isCurrent || isProcessing}
                        onClick={() => handleUpgrade(plan)}
                        className={`w-full py-2.5 rounded-full text-xs font-extrabold transition-all tap-active flex items-center justify-center gap-1.5 ${
                          isCurrent
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-accent-amber text-white shadow-glow-amber hover:bg-amber-600'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>{isCurrent ? 'Current Active Plan' : `Pay ${formatCurrency(finalPrice)} via UPI / Card`}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
