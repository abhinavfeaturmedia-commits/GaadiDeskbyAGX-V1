import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  ShieldAlert,
  Users,
  Car,
  Crown,
  Settings,
  Languages,
  RotateCcw,
  Tag,
  ChevronRight,
  Phone,
  Building,
  CheckCircle2,
  X,
  LogOut,
  UserCheck
} from 'lucide-react';
import { PapersReminder } from '../papers/PapersReminder';
import { CustomerDriverCRM } from '../crm/CustomerDriverCRM';

export const MoreMenu = () => {
  const {
    t,
    business,
    setBusiness,
    language,
    toggleLanguage,
    rateCards,
    setRateCards,
    setIsMembershipOpen,
    formatCurrency,
    authUser,
    logoutUser,
    moreSubView,
    setMoreSubView
  } = useApp();

  const [activeSubView, setActiveSubView] = useState(moreSubView || null); // 'papers' | 'crm' | 'ratecards' | 'business'
  const [editingRateCard, setEditingRateCard] = useState(null);

  useEffect(() => {
    if (moreSubView) {
      setActiveSubView(moreSubView);
    }
  }, [moreSubView]);

  const handleSubViewChange = (view) => {
    setActiveSubView(view);
    setMoreSubView(view);
  };

  // Business settings form
  const [bizForm, setBizForm] = useState(business);

  const handleBizSave = (e) => {
    e.preventDefault();
    setBusiness(bizForm);
    alert("Business profile details updated successfully!");
    handleSubViewChange(null);
  };

  const handleRateCardSave = (e) => {
    e.preventDefault();
    setRateCards(prev => prev.map(rc => rc.id === editingRateCard.id ? editingRateCard : rc));
    setEditingRateCard(null);
  };

  if (activeSubView === 'papers') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => handleSubViewChange(null)}
          className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#E5DFD3] shadow-xs"
        >
          ← Back to More Menu
        </button>
        <PapersReminder />
      </div>
    );
  }

  if (activeSubView === 'crm') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => handleSubViewChange(null)}
          className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#E5DFD3] shadow-xs"
        >
          ← Back to More Menu
        </button>
        <CustomerDriverCRM />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-[#111827]">{t('navMore')}</h2>
        <p className="text-xs text-[#4B5563] font-semibold">
          Settings, Rate Cards, Papers & Account
        </p>
      </div>

      {/* Membership Banner Card */}
      <div
        onClick={() => setIsMembershipOpen(true)}
        className="bg-[#111827] rounded-3xl p-4 text-white shadow-md cursor-pointer tap-active flex items-center justify-between border border-gray-800"
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5">
            <Crown className="w-4 h-4 text-[#D4F05B]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">
              GaadiDesk by AGX SaaS
            </span>
          </div>
          <h3 className="text-base font-black text-white">
            {business.membershipPlan.toUpperCase()} PLAN
          </h3>
          <p className="text-[11px] text-gray-300 font-medium">
            Up to {business.vehicleLimit} vehicles • Valid till {business.membershipExpires}
          </p>
        </div>
        <button className="px-3.5 py-1.5 rounded-full bg-[#D4F05B] text-[#111827] text-xs font-black shadow-xs hover:bg-[#c2de4a] tap-active">
          Upgrade
        </button>
      </div>

      {/* Menu Options List */}
      <div className="bg-white rounded-3xl p-2 border-2 border-[#E5DFD3] shadow-xs divide-y divide-gray-100">
        {/* Rate Cards Manager */}
        <div
          onClick={() => handleSubViewChange('ratecards')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">Fare Rate Cards</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">Local, Airport, Outstation & Rental pricing</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Papers & Expiry Vault */}
        <div
          onClick={() => handleSubViewChange('papers')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">RTO Papers Vault</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">RC, Insurance, PUC, Fitness, Permits</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* CRM Customers & Drivers */}
        <div
          onClick={() => handleSubViewChange('crm')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 font-bold text-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">Customers & Drivers Directory</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">Corporate GST billing, balances & staff</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Business Profile Settings */}
        <div
          onClick={() => handleSubViewChange('business')}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-800 font-bold text-xs">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">Travel Agency Profile</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">{business.name} • {business.city}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Language Selection */}
        <div
          onClick={toggleLanguage}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">Language / भाषा</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">
                Current: <b>{language === 'en' ? 'English' : 'हिन्दी (Hindi)'}</b> (Tap to switch)
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-[#EA580C]">Switch</span>
        </div>

        {/* Logged in User Profile & Logout */}
        <div className="p-3.5 flex items-center justify-between hover:bg-red-50/50 rounded-2xl transition-all">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
              <UserCheck className="w-4 h-4 text-slate-700" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">
                {authUser?.name || business.ownerName}
              </h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">
                +91 {authUser?.phone || business.phone} • {authUser?.isDemo ? 'Demo Mode' : (authUser?.membershipStatus || 'Active')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out and return to the home page?")) {
                logoutUser();
              }
            }}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 text-xs font-black border border-red-200 tap-active"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* RATE CARDS SUB-VIEW */}
      {activeSubView === 'ratecards' && (
        <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Manage Fare Rate Cards
            </h3>
            <button
              onClick={() => handleSubViewChange(null)}
              className="text-xs font-bold text-[#4B5563] hover:text-[#111827]"
            >
              Close
            </button>
          </div>

          <div className="space-y-2.5">
            {rateCards.map(rc => (
              <div
                key={rc.id}
                className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-black text-[#111827]">{rc.tripType} Package</h4>
                  <p className="text-[10px] text-[#4B5563] font-semibold">
                    {rc.tripType === 'Outstation' ? `₹${rc.perKmRate}/km • Min ${rc.minKmPerDay} km/day` : `Base ₹${rc.basePrice} (${rc.includedHours}h / ${rc.includedKm}km)`}
                  </p>
                </div>
                <button
                  onClick={() => setEditingRateCard(rc)}
                  className="px-3 py-1 rounded-full bg-[#111827] text-white text-[10px] font-black hover:bg-black tap-active"
                >
                  Edit Rates
                </button>
              </div>
            ))}
          </div>

          {editingRateCard && (
            <form onSubmit={handleRateCardSave} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 mt-3">
              <h4 className="text-xs font-black text-amber-950">Editing {editingRateCard.tripType} Rates</h4>
              {editingRateCard.tripType === 'Outstation' ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 block">Rate / KM (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.perKmRate}
                      onChange={e => setEditingRateCard({ ...editingRateCard, perKmRate: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 block">Driver Bata (₹/day)</label>
                    <input
                      type="number"
                      value={editingRateCard.driverBata}
                      onChange={e => setEditingRateCard({ ...editingRateCard, driverBata: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1 text-xs font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 block">Base Package (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.basePrice}
                      onChange={e => setEditingRateCard({ ...editingRateCard, basePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-amber-900 block">Extra KM Rate (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.extraKmRate}
                      onChange={e => setEditingRateCard({ ...editingRateCard, extraKmRate: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-2 py-1 text-xs font-bold"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingRateCard(null)}
                  className="flex-1 py-1 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1 text-xs font-black text-white bg-[#111827] rounded-full"
                >
                  Save Rates
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* BUSINESS SETTINGS SUB-VIEW */}
      {activeSubView === 'business' && (
        <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Edit Agency Profile & Billing Info
            </h3>
            <button
              onClick={() => handleSubViewChange(null)}
              className="text-xs font-bold text-[#4B5563] hover:text-[#111827]"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleBizSave} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">Business / Agency Name</label>
              <input
                type="text"
                value={bizForm.name}
                onChange={e => setBizForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-[#111827] block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={bizForm.ownerName}
                  onChange={e => setBizForm(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#111827] block mb-1">City / State</label>
                <input
                  type="text"
                  value={bizForm.city}
                  onChange={e => setBizForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={bizForm.gstin}
                onChange={e => setBizForm(prev => ({ ...prev, gstin: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">UPI ID for Payments</label>
              <input
                type="text"
                value={bizForm.upiId}
                onChange={e => setBizForm(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black tap-active"
            >
              Save Agency Profile
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
