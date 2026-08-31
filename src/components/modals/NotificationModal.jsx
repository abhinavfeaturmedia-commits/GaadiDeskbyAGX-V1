import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Car,
  IndianRupee,
  FileText,
  Wrench,
  Clock,
  CheckCheck,
  Check,
  Zap,
  ArrowRight,
  UserCheck
} from 'lucide-react';

export const NotificationModal = ({ onClose }) => {
  const {
    t,
    language,
    authUser,
    currentStaffRole,
    getSmartNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    setRenewalModalData,
    setSelectedTripDetailBooking,
    setCustomerSettlementData,
    setSelectedInvoiceBooking,
    setServiceModalVehicle,
    setDriverUpiModalData,
    setDriverActiveTab,
    setActiveTab
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all' | 'urgent' | 'trips' | 'compliance' | 'money'

  const isDriver = authUser?.role === 'driver';
  const roleName = isDriver ? 'Driver' : (currentStaffRole || authUser?.role || 'Fleet Owner');
  const allNotifications = getSmartNotifications();

  // Filter based on selected pill
  const filteredNotifications = allNotifications.filter(notif => {
    if (activeTabFilter === 'urgent') return notif.severity === 'critical' || notif.severity === 'urgent';
    if (activeTabFilter === 'trips') return notif.category === 'trips';
    if (activeTabFilter === 'compliance') return notif.category === 'compliance';
    if (activeTabFilter === 'money') return notif.category === 'money';
    return true;
  });

  const unreadCount = allNotifications.filter(n => !n.isRead).length;
  const urgentCount = allNotifications.filter(n => (n.severity === 'critical' || n.severity === 'urgent') && !n.isRead).length;
  const tripsCount = allNotifications.filter(n => n.category === 'trips' && !n.isRead).length;
  const complianceCount = allNotifications.filter(n => n.category === 'compliance' && !n.isRead).length;
  const moneyCount = allNotifications.filter(n => n.category === 'money' && !n.isRead).length;

  const handleAction = (notif) => {
    markNotificationAsRead(notif.id);
    onClose();

    switch (notif.actionType) {
      case 'RENEW_DOC':
        setRenewalModalData(notif.actionPayload);
        break;
      case 'SERVICE_VEHICLE':
        setServiceModalVehicle(notif.actionPayload);
        break;
      case 'ASSIGN_DRIVER':
      case 'VIEW_TRIP':
        setSelectedTripDetailBooking(notif.actionPayload);
        break;
      case 'VIEW_DRIVER_DUTY':
        if (setDriverActiveTab) setDriverActiveTab('duty');
        break;
      case 'COLLECT_CASH':
        if (setDriverUpiModalData) setDriverUpiModalData(notif.actionPayload);
        break;
      case 'SETTLE_CUSTOMER':
        setCustomerSettlementData(notif.actionPayload);
        break;
      case 'GENERATE_INVOICE':
        setSelectedInvoiceBooking(notif.actionPayload);
        break;
      default:
        break;
    }
  };

  const getCategoryIcon = (category, severity) => {
    if (severity === 'critical') return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    switch (category) {
      case 'trips':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'compliance':
        return <ShieldAlert className="w-4 h-4 text-amber-600" />;
      case 'money':
        return <IndianRupee className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-md w-full p-4.5 shadow-2xl border-2 border-[#E5DFD3] space-y-3.5 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5DFD3]/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="relative w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-bold shadow-xs">
              <Bell className="w-4.5 h-4.5 text-amber-900" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-[#111827]">
                  {t('notifCenterTitle')}
                </h3>
                <span className="text-[9px] font-black bg-[#111827] text-white px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  {roleName}
                </span>
              </div>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                {unreadCount > 0 ? `${unreadCount} unread radar alerts` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsAsRead(allNotifications)}
                className="px-2 py-1 rounded-full bg-white border border-[#E5DFD3] text-[10px] font-black text-gray-700 hover:bg-gray-100 flex items-center gap-1 tap-active shadow-xs"
                title={t('notifMarkAllRead')}
              >
                <CheckCheck className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">{t('notifMarkAllRead')}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: t('notifAllTab'), count: allNotifications.length },
            { id: 'urgent', label: t('notifUrgentTab'), count: urgentCount, isUrgent: true },
            { id: 'trips', label: t('notifTripsTab'), count: tripsCount },
            { id: 'compliance', label: t('notifComplianceTab'), count: complianceCount },
            { id: 'money', label: t('notifMoneyTab'), count: moneyCount }
          ].map(tab => {
            const isActive = activeTabFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 tap-active ${
                  isActive
                    ? 'bg-[#111827] text-white shadow-xs scale-102'
                    : 'bg-white border border-[#E5DFD3] text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    isActive
                      ? tab.isUrgent ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'
                      : tab.isUrgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications Scrollable List */}
        <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1 pr-0.5 min-h-[220px] max-h-[360px]">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl p-7 text-center border-2 border-[#E5DFD3] shadow-xs space-y-2 my-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-[#111827]">{t('notifEmptyTitle')}</h4>
              <p className="text-xs text-[#4B5563] max-w-xs mx-auto">
                {t('notifEmptyDesc')}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUrgentSeverity = notif.severity === 'critical' || notif.severity === 'urgent';
              return (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-3xl border-2 transition-all relative shadow-xs flex flex-col justify-between space-y-2.5 ${
                    notif.isRead
                      ? 'bg-white/70 border-gray-200 opacity-80'
                      : notif.severity === 'critical'
                      ? 'bg-rose-50/90 border-rose-300'
                      : notif.severity === 'urgent'
                      ? 'bg-amber-50/90 border-amber-300'
                      : notif.category === 'trips'
                      ? 'bg-blue-50/80 border-blue-200'
                      : notif.category === 'money'
                      ? 'bg-emerald-50/80 border-emerald-200'
                      : 'bg-yellow-50/90 border-yellow-200'
                  }`}
                >
                  {/* Top line with category tag, title and dismiss button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start space-x-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                        notif.severity === 'critical'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : notif.severity === 'urgent'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : notif.category === 'trips'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : notif.category === 'money'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getCategoryIcon(notif.category, notif.severity)}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                            isUrgentSeverity ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {notif.timestamp}
                          </span>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" title="Unread" />
                          )}
                        </div>

                        <h4 className="text-xs font-black text-[#111827] leading-snug">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-[#4B5563] font-semibold leading-normal">
                          {notif.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Mark read button */}
                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationAsRead(notif.id)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 tap-active shrink-0"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* 1-Click Action Button */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/5">
                    <span className="text-[10px] text-gray-500 font-bold capitalize">
                      {notif.category} • {notif.targetRole}
                    </span>

                    <button
                      onClick={() => handleAction(notif)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-xs flex items-center gap-1 tap-active transition-all ${
                        isUrgentSeverity
                          ? 'bg-[#111827] text-white hover:bg-black'
                          : 'bg-white border border-[#E5DFD3] text-[#111827] hover:bg-gray-50'
                      }`}
                    >
                      <span>{notif.actionLabel || 'View Action'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E5DFD3]/80 flex items-center justify-between gap-2">
          {unreadCount > 0 ? (
            <button
              onClick={() => markAllNotificationsAsRead(allNotifications)}
              className="py-2.5 px-4 rounded-full bg-white border-2 border-[#E5DFD3] text-xs font-black text-[#111827] hover:bg-gray-50 tap-active shadow-xs flex-1 text-center"
            >
              {t('notifMarkAllRead')}
            </button>
          ) : (
            <button
              onClick={() => clearAllNotifications(allNotifications)}
              className="py-2.5 px-4 rounded-full bg-white border-2 border-[#E5DFD3] text-xs font-black text-gray-600 hover:bg-gray-50 tap-active shadow-xs flex-1 text-center"
            >
              Clear Dismissed
            </button>
          )}

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-full bg-[#111827] text-white text-xs font-black hover:bg-black tap-active shadow-xs flex-1 text-center"
          >
            Close Radar
          </button>
        </div>

      </div>
    </div>
  );
};
