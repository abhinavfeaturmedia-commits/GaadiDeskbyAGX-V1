import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Navigation,
  Car,
  Wallet,
  Menu,
  Bell,
  Languages,
  Plus
} from 'lucide-react';

export const MobileShell = ({ children }) => {
  const {
    t,
    language,
    toggleLanguage,
    business,
    activeTab,
    setActiveTab,
    setIsNewBookingOpen,
    getDocumentAlerts,
    getUnreadNotificationCount,
    setIsNotificationsOpen,
    setIsMembershipOpen,
    quickDriverLogin
  } = useApp();

  const notifCounts = getUnreadNotificationCount ? getUnreadNotificationCount() : { total: 0, urgent: 0 };
  const badgeCount = notifCounts.total;
  const isUrgent = notifCounts.urgent > 0;

  return (
    <div className="phone-shell font-sans text-text-primary bg-canvas selection:bg-accent-peach selection:text-white">
      {/* App Header Bar (Avatar + Good Morning + Language/Notification Controls) */}
      <div className="px-5 pt-4 pb-2.5 flex items-center justify-between">
        {/* Left: Avatar & Friendly Greeting */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => setIsMembershipOpen(true)}
            className="relative cursor-pointer tap-active"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-accent-peach/50 shadow-sm bg-gradient-to-tr from-amber-100 via-orange-50 to-yellow-100 flex items-center justify-center font-extrabold text-amber-950 text-base">
              {business.ownerName?.charAt(0) || 'R'}
            </div>
            {/* Membership Pill Badge */}
            <div className="absolute -bottom-1 -right-1 bg-accent-lime text-[#1E232A] text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs">
              {business.membershipPlan === 'trial' ? 'TRIAL' : 'PRO'}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-text-secondary flex items-center gap-1">
              <span>{t('greetingMorning')}</span>
              <span className="text-amber-500 text-xs">☀️</span>
            </div>
            <h2 className="text-sm font-extrabold text-[#1E232A] leading-tight truncate max-w-[160px]">
              {business.ownerName || 'Ramesh Gaikwad'}
            </h2>
          </div>
        </div>

        {/* Right: Language Switcher, Driver View Switcher & Alert Bell */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle Pill */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full bg-white border border-card-border shadow-soft text-xs font-bold flex items-center gap-1 text-gray-800 hover:bg-gray-50 tap-active"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-accent-peach" />
            <span className="text-[11px] font-extrabold">{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
          </button>

          {/* Quick Switch to Driver Mode (Demo/Testing Helper) */}
          <button
            onClick={() => quickDriverLogin('drv-01')}
            className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-300 shadow-soft flex items-center justify-center text-emerald-950 hover:bg-emerald-100 tap-active"
            title="Switch to Driver Mode (Demo)"
          >
            <span className="text-xs">🚗</span>
          </button>

          {/* Notifications / Expiry Alerts */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-9 h-9 rounded-full bg-white border border-card-border shadow-soft flex items-center justify-center text-gray-800 hover:bg-gray-50 tap-active"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {badgeCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs ${
                isUrgent ? 'bg-red-500 badge-pulse' : 'bg-[#111827]'
              }`}>
                {badgeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content View with Smooth Scroll */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-1 no-scrollbar">
        {children}
      </div>

      {/* Floating Bottom Navigation Dock (1:1 with app_ui_ux.jpg floating dock bar) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pb-5 pt-2 pointer-events-none z-30">
        <div className="frosted-dock rounded-full px-3 py-2 flex items-center justify-between pointer-events-auto shadow-dock">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center justify-center transition-all tap-active ${
              activeTab === 'home'
                ? 'bg-[#D4F05B] text-[#111827] font-black px-4 py-2 rounded-full shadow-glow-lime scale-105'
                : 'text-[#4B5563] hover:text-[#111827] p-2.5'
            }`}
            title={t('navHome')}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          </button>

          {/* Trips Tab */}
          <button
            onClick={() => setActiveTab('trips')}
            className={`flex items-center justify-center transition-all tap-active ${
              activeTab === 'trips'
                ? 'bg-[#D4F05B] text-[#111827] font-black px-4 py-2 rounded-full shadow-glow-lime scale-105'
                : 'text-[#4B5563] hover:text-[#111827] p-2.5'
            }`}
            title={t('navTrips')}
          >
            <Navigation className={`w-5 h-5 ${activeTab === 'trips' ? 'stroke-[2.5]' : ''}`} />
          </button>

          {/* Quick Floating + New Booking FAB */}
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="w-11 h-11 rounded-full bg-[#111827] text-white shadow-md flex items-center justify-center font-black hover:scale-108 transition-transform tap-active border-2 border-white"
            title="Create New Booking"
          >
            <Plus className="w-5 h-5 stroke-[3] text-[#D4F05B]" />
          </button>

          {/* Fleet Tab */}
          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center justify-center transition-all tap-active ${
              activeTab === 'fleet'
                ? 'bg-[#D4F05B] text-[#111827] font-black px-4 py-2 rounded-full shadow-glow-lime scale-105'
                : 'text-[#4B5563] hover:text-[#111827] p-2.5'
            }`}
            title={t('navFleet')}
          >
            <Car className={`w-5 h-5 ${activeTab === 'fleet' ? 'stroke-[2.5]' : ''}`} />
          </button>

          {/* Money Tab */}
          <button
            onClick={() => setActiveTab('money')}
            className={`flex items-center justify-center transition-all tap-active ${
              activeTab === 'money'
                ? 'bg-[#D4F05B] text-[#111827] font-black px-4 py-2 rounded-full shadow-glow-lime scale-105'
                : 'text-[#4B5563] hover:text-[#111827] p-2.5'
            }`}
            title={t('navMoney')}
          >
            <Wallet className={`w-5 h-5 ${activeTab === 'money' ? 'stroke-[2.5]' : ''}`} />
          </button>

          {/* More Tab */}
          <button
            onClick={() => setActiveTab('more')}
            className={`flex items-center justify-center transition-all tap-active ${
              activeTab === 'more'
                ? 'bg-[#D4F05B] text-[#111827] font-black px-4 py-2 rounded-full shadow-glow-lime scale-105'
                : 'text-[#4B5563] hover:text-[#111827] p-2.5'
            }`}
            title={t('navMore')}
          >
            <Menu className={`w-5 h-5 ${activeTab === 'more' ? 'stroke-[2.5]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

