import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  ShieldAlert,
  Calendar,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const NotificationModal = ({ onClose }) => {
  const { t, getDocumentAlerts, setRenewalModalData } = useApp();
  const alerts = getDocumentAlerts();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                RTO Expiry Radar Alerts
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                {alerts.length} urgent document notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
          {alerts.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 text-center border border-[#E5DFD3] shadow-xs space-y-1.5">
              <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-[#111827]">All Documents Compliant!</p>
              <p className="text-[11px] text-[#4B5563]">All vehicle & driver papers are fully valid.</p>
            </div>
          ) : (
            alerts.map((alt, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-3xl border-2 flex items-center justify-between shadow-xs ${
                  alt.isExpired
                    ? 'bg-rose-50 border-rose-300'
                    : alt.isUrgent
                    ? 'bg-amber-50 border-amber-300'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{alt.isExpired ? '⚠️' : '⏳'}</span>
                  <div>
                    <h4 className="text-xs font-black text-[#111827]">
                      {alt.driverName || alt.vehiclePlate}
                    </h4>
                    <p className="text-[10px] text-[#374151] font-bold">
                      {alt.docType} (Expires {alt.expiryDate})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    setRenewalModalData(alt);
                  }}
                  className="px-3 py-1 rounded-full bg-[#111827] text-white text-[10px] font-black shadow-xs hover:bg-black tap-active"
                >
                  Renew
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-white border-2 border-[#E5DFD3] text-xs font-black text-[#111827] hover:bg-gray-50 tap-active shadow-xs"
        >
          Close Alerts
        </button>
      </div>
    </div>
  );
};
