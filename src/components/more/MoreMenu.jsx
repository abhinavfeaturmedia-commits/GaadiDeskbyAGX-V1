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
  UserCheck,
  Globe,
  FileSpreadsheet,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { PapersReminder } from '../papers/PapersReminder';
import { CustomerDriverCRM } from '../crm/CustomerDriverCRM';

export const MoreMenu = () => {
  const {
    t,
    business,
    updateBusiness,
    language,
    toggleLanguage,
    rateCards,
    updateRateCard,
    setIsMembershipOpen,
    formatCurrency,
    formatPhoneNumber,
    authUser,
    logoutUser,
    moreSubView,
    setMoreSubView,
    setIsQuickQuoteOpen,
    setIsCaExportOpen,
    setIsPublicSiteOpen,
    currentStaffRole,
    switchStaffRole
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
    updateBusiness(bizForm);
    alert("Business profile details updated successfully!");
    handleSubViewChange(null);
  };

  const handleRateCardSave = (e) => {
    e.preventDefault();
    if (editingRateCard) {
      updateRateCard(editingRateCard);
    }
    setEditingRateCard(null);
  };

  if (activeSubView === 'papers') {
    return (
      <div className="space-y-4 animate-fade-in">
        <button
          onClick={() => handleSubViewChange(null)}
          className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border-2 border-[#E5DFD3] shadow-xs tap-active"
        >
          ← Back to More Menu
        </button>
        <PapersReminder />
      </div>
    );
  }

  if (activeSubView === 'crm') {
    return (
      <div className="space-y-4 animate-fade-in">
        <button
          onClick={() => handleSubViewChange(null)}
          className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border-2 border-[#E5DFD3] shadow-xs tap-active"
        >
          ← Back to More Menu
        </button>
        <CustomerDriverCRM />
      </div>
    );
  }

  if (activeSubView === 'ratecards') {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSubViewChange(null)}
            className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border-2 border-[#E5DFD3] shadow-xs tap-active"
          >
            ← Back to More Menu
          </button>
          <span className="text-xs font-black text-[#4B5563] uppercase tracking-wider">Fare Engine</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-[#E5DFD3] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#111827]">
              Manage Fare Rate Cards
            </h3>
            <p className="text-xs text-[#4B5563] font-semibold mt-0.5">
              Rates automatically pre-fill into new booking calculations based on trip type & car category.
            </p>
          </div>

          <div className="space-y-2.5">
            {rateCards.map(rc => (
              <div
                key={rc.id}
                className="p-3.5 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-[#111827]">{rc.tripType} - {rc.category || 'All Categories'}</h4>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                      {rc.category || 'Standard'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4B5563] font-semibold mt-1">
                    {rc.tripType === 'Outstation' 
                      ? `₹${rc.perKmRate}/km • Min ${rc.minKmPerDay} km/day • Bata ₹${rc.driverBata}`
                      : rc.tripType === 'Rental'
                      ? `₹${rc.basePrice}/day (Deposit ₹${rc.securityDeposit} • ${rc.fuelPolicy})`
                      : `Base ₹${rc.basePrice} (${rc.includedHours}h / ${rc.includedKm}km) • Extra ₹${rc.extraKmRate}/km`}
                  </p>
                </div>
                <button
                  onClick={() => setEditingRateCard(rc)}
                  className="px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-[11px] font-black hover:bg-black tap-active shadow-xs"
                >
                  Edit Rates
                </button>
              </div>
            ))}
          </div>

          {editingRateCard && (
            <form onSubmit={handleRateCardSave} className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3 mt-4 animate-fade-in">
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                Editing {editingRateCard.tripType} ({editingRateCard.category || 'Standard'}) Rates
              </h4>
              {editingRateCard.tripType === 'Outstation' ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Rate / KM (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.perKmRate}
                      onChange={e => setEditingRateCard({ ...editingRateCard, perKmRate: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Driver Bata (₹/day)</label>
                    <input
                      type="number"
                      value={editingRateCard.driverBata}
                      onChange={e => setEditingRateCard({ ...editingRateCard, driverBata: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                </div>
              ) : editingRateCard.tripType === 'Rental' ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Daily Rental Price (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.basePrice}
                      onChange={e => setEditingRateCard({ ...editingRateCard, basePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.securityDeposit}
                      onChange={e => setEditingRateCard({ ...editingRateCard, securityDeposit: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Base Package Fare (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.basePrice}
                      onChange={e => setEditingRateCard({ ...editingRateCard, basePrice: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">Extra KM Rate (₹)</label>
                    <input
                      type="number"
                      value={editingRateCard.extraKmRate}
                      onChange={e => setEditingRateCard({ ...editingRateCard, extraKmRate: Number(e.target.value) })}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950"
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRateCard(null)}
                  className="flex-1 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-black text-white bg-[#111827] rounded-full shadow-xs"
                >
                  Save Rate Card
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (activeSubView === 'business') {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleSubViewChange(null)}
            className="text-xs font-black text-[#111827] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border-2 border-[#E5DFD3] shadow-xs tap-active"
          >
            ← Back to More Menu
          </button>
          <span className="text-xs font-black text-[#4B5563] uppercase tracking-wider">Agency Profile</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border-2 border-[#E5DFD3] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-[#111827]">
              Agency Profile & Invoicing Details
            </h3>
            <p className="text-xs text-[#4B5563] font-semibold mt-0.5">
              These details print directly on all your GST Invoices, WhatsApp bills, and duty slips.
            </p>
          </div>

          <form onSubmit={handleBizSave} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">Business / Agency Name</label>
              <input
                type="text"
                value={bizForm.name}
                onChange={e => setBizForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#111827] block mb-1">Owner Name</label>
                <input
                  type="text"
                  value={bizForm.ownerName}
                  onChange={e => setBizForm(prev => ({ ...prev, ownerName: e.target.value }))}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#111827] block mb-1">City / Base Hub</label>
                <input
                  type="text"
                  value={bizForm.city}
                  onChange={e => setBizForm(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={bizForm.gstin}
                onChange={e => setBizForm(prev => ({ ...prev, gstin: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#111827] block mb-1">UPI ID for Direct Payments</label>
              <input
                type="text"
                value={bizForm.upiId}
                onChange={e => setBizForm(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black tap-active mt-2"
            >
              Save Agency Profile
            </button>
          </form>
        </div>
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
        className="bg-[#071422] rounded-3xl p-4 text-white shadow-md cursor-pointer tap-active flex items-center justify-between border border-gray-800"
      >
        <div className="flex items-center space-x-3">
          <img
            src="/gaadidesk_logo.png"
            alt="GaadiDesk Logo"
            className="w-12 h-12 rounded-2xl object-cover ring-1 ring-white/20 shadow-sm shrink-0"
          />
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <Crown className="w-3.5 h-3.5 text-[#D4F05B]" />
              <span className="text-[11px] font-black uppercase tracking-wider text-white">
                GaadiDesk <span className="text-[#22C55E]">by AGX</span>
              </span>
            </div>
            <h3 className="text-sm font-black text-white">
              {business.membershipPlan.toUpperCase()} PLAN
            </h3>
            <p className="text-[10px] text-gray-300 font-medium">
              Up to {business.vehicleLimit} vehicles • Valid till {business.membershipExpires}
            </p>
          </div>
        </div>
        <button className="px-3.5 py-1.5 rounded-full bg-[#D4F05B] text-[#111827] text-xs font-black shadow-xs hover:bg-[#c2de4a] tap-active shrink-0">
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

        {/* Public Mini-Website Showcase & Lead Capture */}
        <div
          onClick={() => setIsPublicSiteOpen(true)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-emerald-50/50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-[#111827]">Operator Public Mini-Website</h4>
                <span className="text-[9px] bg-emerald-100 text-emerald-900 font-black px-1.5 py-0.2 rounded-md">LIVE</span>
              </div>
              <p className="text-[10px] text-[#4B5563] font-semibold">Share your branded vehicle catalog & rates link</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* 10-Second Quick Quotation Generator */}
        <div
          onClick={() => setIsQuickQuoteOpen(true)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-50/50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
              <Zap className="w-4 h-4 text-[#EA580C]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">10-Second Quick Quotation</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">Instant branded PDF & WhatsApp fare estimates</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* CA & Tally Export Suite */}
        <div
          onClick={() => setIsCaExportOpen(true)}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-blue-50/50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-[#111827]">CA & Tally Export Suite</h4>
              <p className="text-[10px] text-[#4B5563] font-semibold">1-Click GSTR-1, Expense Ledger & Khata CSV</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Staff Role Permissions (RBAC) */}
        <div
          onClick={() => {
            const nextRole = currentStaffRole === 'Owner' ? 'Manager' : currentStaffRole === 'Manager' ? 'Accountant' : currentStaffRole === 'Accountant' ? 'Dispatcher' : 'Owner';
            switchStaffRole(nextRole);
          }}
          className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-2xl transition-all tap-active"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-[#111827]">Staff Role / Access Mode</h4>
                <span className="text-[9px] bg-[#111827] text-white font-black px-1.5 py-0.2 rounded-md uppercase">
                  {currentStaffRole || 'Owner'}
                </span>
              </div>
              <p className="text-[10px] text-[#4B5563] font-semibold">Owner, Manager, Accountant, Dispatcher (Tap to switch)</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Switch</span>
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
                {formatPhoneNumber(authUser?.phone || business.phone)} • {authUser?.isDemo ? 'Demo Mode' : (authUser?.membershipStatus || 'Active')}
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

      {/* App Info & Verified Branding Card */}
      <div className="bg-white/80 rounded-3xl p-4 border border-[#E5DFD3] text-center space-y-1.5 shadow-xs">
        <div className="flex items-center justify-center space-x-2">
          <img
            src="/gaadidesk_logo.png"
            alt="GaadiDesk by AGX"
            className="w-7 h-7 rounded-xl object-cover shadow-xs"
          />
          <span className="text-xs font-black text-[#111827]">
            Gaadi<span className="text-[#22C55E]">Desk</span> <span className="text-[10px] font-bold text-[#4B5563]">by AGX</span>
          </span>
          <span className="text-[10px] bg-[#D4F05B]/40 text-[#111827] font-black px-2 py-0.5 rounded-full border border-[#BFDD38]">v1.0 Pro</span>
        </div>
        <p className="text-[10px] text-gray-500 font-semibold">
          The Indian Fleet Operating System • Built with ❤️ for Cab & Tour Operators
        </p>
      </div>
    </div>
  );
};
