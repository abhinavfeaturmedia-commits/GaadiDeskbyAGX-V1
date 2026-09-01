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
  Plus,
  Cloud,
  CloudOff,
  RefreshCw
} from 'lucide-react';

export const MobileShell = ({ children }) => {
  const {
    t,
    language,
    toggleLanguage,
    business,
    activeTab,
    setActiveTab,
    isNewBookingOpen,
    setIsNewBookingOpen,
    selectedTripDetailBooking,
    settlementBooking,
    selectedInvoiceBooking,
    whatsAppData,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isMembershipOpen,
    setIsMembershipOpen,
    isQuickQuoteOpen,
    selectedCorporateCustomer,
    isCaExportOpen,
    isPublicSiteOpen,
    serviceModalVehicle,
    selectedVehicleDetail,
    renewalModalData,
    customerSettlementData,
    getDocumentAlerts,
    getUnreadNotificationCount,
    quickDriverLogin,
    isCloudConnected,
    cloudSyncStatus,
    syncWithCloud
  } = useApp();

  const isAnyModalOpen = Boolean(
    isNewBookingOpen ||
    selectedTripDetailBooking ||
    settlementBooking ||
    selectedInvoiceBooking ||
    whatsAppData ||
    isNotificationsOpen ||
    isMembershipOpen ||
    isQuickQuoteOpen ||
    selectedCorporateCustomer ||
    isCaExportOpen ||
    isPublicSiteOpen ||
    serviceModalVehicle ||
    selectedVehicleDetail ||
    renewalModalData ||
    customerSettlementData
  );

  const notifCounts = getUnreadNotificationCount ? getUnreadNotificationCount() : { total: 0, urgent: 0 };
  const badgeCount = notifCounts.total;
  const isUrgent = notifCounts.urgent > 0;

  // Dynamic Time-Based Greeting Logic
  const getGreetingData = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return { text: t('greetingMorning'), icon: '☀️' };
    } else if (hour >= 12 && hour < 17) {
      return { text: t('greetingAfternoon'), icon: '🌤️' };
    } else if (hour >= 17 && hour < 21) {
      return { text: t('greetingEvening'), icon: '🌆' };
    } else {
      return { text: t('greetingNight'), icon: '🌙' };
    }
  };

  const greeting = getGreetingData();

  return (
    <div className="phone-shell font-sans text-text-primary bg-canvas selection:bg-accent-peach selection:text-white">
      {/* App Header Bar (Avatar + Dynamic Time Greeting + Language/Notification Controls) */}
      <div className="px-5 pt-4 pb-2.5 flex items-center justify-between shrink-0">
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
              <span>{greeting.text}</span>
              <span className="text-amber-500 text-xs">{greeting.icon}</span>
            </div>
            <h2 className="text-sm font-extrabold text-[#1E232A] leading-tight truncate max-w-[160px]">
              {business.ownerName || 'Ramesh Gaikwad'}
            </h2>
          </div>
        </div>

        {/* Right: Language Switcher, Driver View Switcher, Cloud Status & Alert Bell */}
        <div className="flex items-center space-x-2">
          {/* Supabase Cloud Sync Status Pill */}
          <button
            onClick={() => syncWithCloud(true)}
            className={`px-2 py-1 rounded-full border shadow-soft text-xs font-black flex items-center gap-1.5 transition-all tap-active ${
              cloudSyncStatus === 'synced'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                : cloudSyncStatus === 'syncing'
                ? 'bg-blue-50 border-blue-300 text-blue-900 animate-pulse'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
            title={cloudSyncStatus === 'synced' ? 'Supabase Connected & Synced (Click to Refresh)' : 'Syncing with Supabase...'}
          >
            {cloudSyncStatus === 'syncing' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
            ) : cloudSyncStatus === 'synced' ? (
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            ) : (
              <CloudOff className="w-3 h-3 text-amber-600" />
            )}
            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">
              {cloudSyncStatus === 'synced' ? 'Cloud' : cloudSyncStatus === 'syncing' ? 'Syncing' : 'Local'}
            </span>
          </button>

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
      <div
        className="flex-1 min-h-0 overflow-y-auto px-5 pb-32 pt-1 no-scrollbar overscroll-y-contain"
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>

      {/* Floating Bottom Navigation Dock (Hidden smoothly whenever any modal is open) */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pb-5 pt-2 pointer-events-none z-30 transition-all duration-300 ${
        isAnyModalOpen ? 'translate-y-28 opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div className="frosted-dock rounded-full px-2.5 py-1.5 flex items-center justify-between pointer-events-auto shadow-dock border border-white/80">
          {/* Home Tab */}
          <button
            onClick={() => setActiveTab('home')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active ${
              activeTab === 'home'
                ? 'bg-[#DDF262] text-[#111827] shadow-glow-lime scale-105'
                : 'text-[#8A8782] hover:text-[#111827]'
            }`}
            title={t('navHome')}
          >
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>

          {/* Trips Tab */}
          <button
            onClick={() => setActiveTab('trips')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active ${
              activeTab === 'trips'
                ? 'bg-[#DDF262] text-[#111827] shadow-glow-lime scale-105'
                : 'text-[#8A8782] hover:text-[#111827]'
            }`}
            title={t('navTrips')}
          >
            <Navigation className={`w-5 h-5 ${activeTab === 'trips' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>

          {/* Quick Floating + New Booking FAB */}
          <button
            onClick={() => setIsNewBookingOpen(true)}
            className="w-11 h-11 rounded-full bg-[#111827] text-white shadow-md flex items-center justify-center font-black hover:scale-108 transition-transform tap-active border-2 border-white"
            title="Create New Booking"
          >
            <Plus className="w-5 h-5 stroke-[3] text-[#DDF262]" />
          </button>

          {/* Fleet Tab */}
          <button
            onClick={() => setActiveTab('fleet')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active ${
              activeTab === 'fleet'
                ? 'bg-[#DDF262] text-[#111827] shadow-glow-lime scale-105'
                : 'text-[#8A8782] hover:text-[#111827]'
            }`}
            title={t('navFleet')}
          >
            <Car className={`w-5 h-5 ${activeTab === 'fleet' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>

          {/* Money Tab */}
          <button
            onClick={() => setActiveTab('money')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active ${
              activeTab === 'money'
                ? 'bg-[#DDF262] text-[#111827] shadow-glow-lime scale-105'
                : 'text-[#8A8782] hover:text-[#111827]'
            }`}
            title={t('navMoney')}
          >
            <Wallet className={`w-5 h-5 ${activeTab === 'money' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>

          {/* More Tab */}
          <button
            onClick={() => setActiveTab('more')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all tap-active ${
              activeTab === 'more'
                ? 'bg-[#DDF262] text-[#111827] shadow-glow-lime scale-105'
                : 'text-[#8A8782] hover:text-[#111827]'
            }`}
            title={t('navMore')}
          >
            <Menu className={`w-5 h-5 ${activeTab === 'more' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

