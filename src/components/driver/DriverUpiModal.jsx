import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  X,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';

export const DriverUpiModal = () => {
  const {
    driverUpiModalData,
    setDriverUpiModalData,
    business,
    completeDriverTrip,
    formatCurrency
  } = useApp();

  if (!driverUpiModalData) return null;

  const { booking, amount } = driverUpiModalData;
  const ownerUpiId = business.upiId || 'shreeganesh.tours@okhdfcbank';
  const ownerBizName = business.name || 'Shree Ganesh Tours & Travels';

  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ownerUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePaymentConfirmed = () => {
    completeDriverTrip(booking.id, {
      endKm: Number(booking.endKm || (booking.startKm ? booking.startKm + 250 : 64250)),
      tollParking: Number(booking.tollParking || 0),
      driverBata: Number(booking.driverBata || 0),
      paymentMode: 'UPI',
      finalPaidAmount: Number(amount),
      notes: `Direct UPI payment of ${formatCurrency(amount)} verified by passenger.`
    });

    setDriverUpiModalData(null);
  };

  // Generate standard UPI QR URL via external QR provider with pre-filled amount & business name
  const upiIntent = `upi://pay?pa=${encodeURIComponent(ownerUpiId)}&pn=${encodeURIComponent(ownerBizName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`GaadiDesk Trip ${booking.id}`)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiIntent)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3.5xl p-6 border-2 border-[#E5DFD3] shadow-2xl max-w-sm w-full space-y-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                Scan & Pay Owner Bank
              </h3>
              <p className="text-[10px] text-[#4B5563] font-semibold">
                Direct to {ownerBizName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDriverUpiModalData(null)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] font-black hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount to Pay Banner */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
            Amount Due to Pay
          </span>
          <span className="text-2xl font-black text-emerald-950">
            {formatCurrency(amount)}
          </span>
        </div>

        {/* Dynamic UPI QR Image */}
        <div className="p-4 bg-white border-2 border-dashed border-[#E5DFD3] rounded-3xl shadow-inner inline-block mx-auto">
          <img
            src={qrUrl}
            alt="Owner UPI QR Code"
            className="w-48 h-48 mx-auto rounded-2xl object-contain"
          />
          <div className="flex items-center justify-center space-x-2 mt-2 text-[10px] font-bold text-[#4B5563]">
            <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
          </div>
        </div>

        {/* UPI ID Pill with Copy */}
        <div className="flex items-center justify-between p-2.5 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] text-xs">
          <div className="text-left truncate">
            <span className="text-[9px] text-[#4B5563] font-bold block">Fleet UPI ID:</span>
            <span className="font-mono font-black text-[#111827] text-[11px] truncate block">{ownerUpiId}</span>
          </div>
          <button
            onClick={handleCopyUpi}
            className="px-2.5 py-1 rounded-xl bg-white border border-[#E5DFD3] text-[10px] font-black text-[#111827] hover:bg-gray-50 shrink-0"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Confirmation Button */}
        <button
          onClick={handlePaymentConfirmed}
          className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md tap-active flex items-center justify-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Customer Paid {formatCurrency(amount)} Online</span>
        </button>
      </div>
    </div>
  );
};
