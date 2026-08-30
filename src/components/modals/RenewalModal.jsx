import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  Calendar,
  FileCheck,
  CheckCircle2,
  Car,
  User
} from 'lucide-react';

export const RenewalModal = () => {
  const {
    renewalModalData,
    setRenewalModalData,
    renewVehicleDocument,
    renewDriverLicense
  } = useApp();

  if (!renewalModalData) return null;

  const isDriver = Boolean(renewalModalData.driverId);
  const defaultNextYear = new Date();
  defaultNextYear.setFullYear(defaultNextYear.getFullYear() + 1);
  const defaultExpiryStr = defaultNextYear.toISOString().split('T')[0];

  const [newExpiry, setNewExpiry] = useState(defaultExpiryStr);
  const [docNumber, setDocNumber] = useState('');

  const handleRenew = (e) => {
    e.preventDefault();
    if (!newExpiry) {
      alert("Please select a new expiry date.");
      return;
    }

    if (isDriver) {
      renewDriverLicense(renewalModalData.driverId, newExpiry, docNumber);
    } else {
      renewVehicleDocument(renewalModalData.vehicleId, renewalModalData.docType, newExpiry, docNumber);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                Renew {renewalModalData.docType}
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                {isDriver ? renewalModalData.driverName : `${renewalModalData.plate} (${renewalModalData.model})`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRenewalModalData(null)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRenew} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              New Expiry Date *
            </label>
            <input
              type="date"
              required
              value={newExpiry}
              onChange={e => setNewExpiry(e.target.value)}
              className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Document / Policy Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. POL-892301928 / PUC-9921"
              value={docNumber}
              onChange={e => setDocNumber(e.target.value)}
              className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <p className="text-[10px] text-emerald-800 bg-emerald-50 p-2.5 rounded-2xl border border-emerald-200 font-semibold">
            ✓ Renewing will immediately clear the alert from your Dashboard radar and RTO vault.
          </p>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setRenewalModalData(null)}
              className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] text-xs font-black text-[#4B5563] hover:bg-gray-50 tap-active"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black tap-active flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4F05B]" />
              <span>Update & Clear</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
