import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Navigation,
  Clock,
  Wallet,
  User,
  Languages,
  Car,
  Bell
} from 'lucide-react';

export const DriverShell = ({ children }) => {
  const {
    authUser,
    t,
    language,
    toggleLanguage,
    driverActiveTab,
    setDriverActiveTab,
    drivers,
    getDriverVehicle,
    getDriverActiveTrip,
    getUnreadNotificationCount,
    setIsNotificationsOpen,
    quickDemoLogin
  } = useApp();

  const notifCounts = getUnreadNotificationCount ? getUnreadNotificationCount('driver') : { total: 0, urgent: 0 };
  const badgeCount = notifCounts.total;
  const isUrgent = notifCounts.urgent > 0;

  const currentDriver = drivers.find(d => d.id === authUser?.driverId) || {
    name: authUser?.name || 'Driver',
    phone: authUser?.phone || '+91 98901 44321',
    status: 'Available'
  };

  const assignedVehicle = getDriverVehicle(authUser?.driverId);
  const activeTrip = getDriverActiveTrip(authUser?.driverId);
  const isOnTrip = Boolean(activeTrip && activeTrip.status === 'Ongoing');

  return (
    <div className="phone-shell font-sans text-text-primary bg-canvas selection:bg-accent-lime selection:text-[#111827]">
      {/* Driver Top Header Bar */}
      <div className="px-5 pt-4 pb-2.5 flex items-center justify-between border-b border-[#E5DFD3]/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        {/* Left: Driver Avatar & Status */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-500/50 shadow-sm bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center font-black text-emerald-950 text-base">
              {currentDriver.name?.charAt(0) || 'D'}
            </div>
            {/* Live Status Dot */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isOnTrip ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`} />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                isOnTrip
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}>
                {isOnTrip ? t('driverOnDuty') : t('driverReadyForDuty')}
              </span>
            </div>
            <h2 className="text-sm font-black text-[#111827] leading-tight truncate max-w-[150px]">
              {currentDriver.name}
            </h2>
          </div>
        </div>

        {/* Right Controls: Vehicle Pill, Language Switcher & SOS */}
        <div className="flex items-center space-x-2">
          {/* Assigned Car Pill */}
          {assignedVehicle && (
            <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-gray-50 border border-[#E5DFD3] rounded-full text-[11px] font-black text-[#111827]">
              <Car className="w-3 h-3 text-[#EA580C]" />
              <span className="truncate max-w-[90px]">{assignedVehicle.plate.split(' ')[0]}</span>
            </div>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full bg-white border border-card-border shadow-soft text-xs font-bold flex items-center gap-1 text-gray-800 hover:bg-gray-50 tap-active"
            title="Switch Language / भाषा बदलें"
          >
            <Languages className="w-3.5 h-3.5 text-accent-peach" />
            <span className="text-[11px] font-extrabold">{language === 'en' ? 'हिन्दी' : 'ENG'}</span>
          </button>

          {/* Driver Notifications */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-9 h-9 rounded-full bg-white border border-card-border shadow-soft flex items-center justify-center text-gray-800 hover:bg-gray-50 tap-active"
            title="Driver Alerts"
          >
            <Bell className="w-4 h-4" />
            {badgeCount > 0 && (
              <span className={`absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs ${
                isUrgent ? 'bg-red-500 badge-pulse' : 'bg-emerald-600'
              }`}>
                {badgeCount}
              </span>
            )}
          </button>

          {/* Switch to Fleet Owner Demo Mode (Quick testing helper) */}
          <button
            onClick={quickDemoLogin}
            className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 shadow-soft flex items-center justify-center text-amber-900 hover:bg-amber-100 tap-active"
            title="Switch to Owner View (Demo)"
          >
            <span className="text-xs">🏢</span>
          </button>
        </div>
      </div>

      {/* Main Content View with Smooth Scroll */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-3 no-scrollbar">
        {children}
      </div>

      {/* Driver Floating Bottom Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[440px] mx-auto px-5 pb-5 pt-2 pointer-events-none z-30">
        <div className="frosted-dock rounded-full px-3 py-2 flex items-center justify-between pointer-events-auto shadow-dock border-2 border-emerald-500/20">
          {/* Duty Cockpit Tab */}
          <button
            onClick={() => setDriverActiveTab('duty')}
            className={`flex items-center space-x-1.5 transition-all tap-active ${
              driverActiveTab === 'duty'
                ? 'bg-[#111827] text-white font-black px-4 py-2 rounded-full shadow-md scale-105'
                : 'text-[#4B5563] hover:text-[#111827] px-3 py-2'
            }`}
          >
            <Navigation className={`w-4 h-4 ${driverActiveTab === 'duty' ? 'text-[#D4F05B] stroke-[2.5]' : ''}`} />
            <span className="text-xs font-black">{t('navDriverDuty')}</span>
          </button>

          {/* Trip History Tab */}
          <button
            onClick={() => setDriverActiveTab('trips')}
            className={`flex items-center space-x-1.5 transition-all tap-active ${
              driverActiveTab === 'trips'
                ? 'bg-[#111827] text-white font-black px-4 py-2 rounded-full shadow-md scale-105'
                : 'text-[#4B5563] hover:text-[#111827] px-3 py-2'
            }`}
          >
            <Clock className={`w-4 h-4 ${driverActiveTab === 'trips' ? 'text-[#D4F05B] stroke-[2.5]' : ''}`} />
            <span className="text-xs font-black">{t('navDriverTrips')}</span>
          </button>

          {/* Cash & Bata Wallet Tab */}
          <button
            onClick={() => setDriverActiveTab('wallet')}
            className={`flex items-center space-x-1.5 transition-all tap-active ${
              driverActiveTab === 'wallet'
                ? 'bg-[#111827] text-white font-black px-4 py-2 rounded-full shadow-md scale-105'
                : 'text-[#4B5563] hover:text-[#111827] px-3 py-2'
            }`}
          >
            <Wallet className={`w-4 h-4 ${driverActiveTab === 'wallet' ? 'text-[#D4F05B] stroke-[2.5]' : ''}`} />
            <span className="text-xs font-black">{t('navDriverWallet')}</span>
          </button>

          {/* Profile & DL Tab */}
          <button
            onClick={() => setDriverActiveTab('profile')}
            className={`flex items-center space-x-1.5 transition-all tap-active ${
              driverActiveTab === 'profile'
                ? 'bg-[#111827] text-white font-black px-4 py-2 rounded-full shadow-md scale-105'
                : 'text-[#4B5563] hover:text-[#111827] px-3 py-2'
            }`}
          >
            <User className={`w-4 h-4 ${driverActiveTab === 'profile' ? 'text-[#D4F05B] stroke-[2.5]' : ''}`} />
            <span className="text-xs font-black">{t('navDriverProfile')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
