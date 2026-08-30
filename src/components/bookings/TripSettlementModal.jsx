import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Gauge,
  IndianRupee,
  Receipt,
  FileText,
  MessageCircle,
  Car,
  User,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TripSettlementModal = ({ booking, onClose }) => {
  const {
    vehicles,
    drivers,
    completeTripAndSettle,
    formatCurrency,
    setSelectedInvoiceBooking,
    setWhatsAppData
  } = useApp();

  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
  const currentOdometer = vehicle?.odometer || booking.startKm || 64000;
  const estimatedKm = Number(booking.estimatedKm || 300);
  const ratePerKm = Number(booking.ratePerKm || 14);

  const [startKm, setStartKm] = useState(booking.startKm || currentOdometer);
  const [endKm, setEndKm] = useState(booking.startKm ? booking.startKm + estimatedKm : currentOdometer + estimatedKm);
  const [tollParking, setTollParking] = useState(booking.tollParking || 350);
  const [driverBata, setDriverBata] = useState(booking.driverBata || 400);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash'); // 'Cash' | 'UPI' | 'Bank' | 'Credit'
  const [notes, setNotes] = useState('');

  // Calculations
  const actualKm = Math.max(0, Number(endKm) - Number(startKm));
  const extraKm = Math.max(0, actualKm - estimatedKm);
  const extraKmCharges = extraKm * ratePerKm;

  // Base fare + Extras
  const baseFare = Number(booking.baseFare || 0);
  const taxableAmount = baseFare + extraKmCharges + Number(driverBata) - Number(discount);
  const gstAmount = booking.gstEnabled ? Math.round(taxableAmount * ((booking.gstPercent || 5) / 100)) : 0;
  const grossTotal = taxableAmount + gstAmount + Number(tollParking);
  
  const advancePaid = Number(booking.advancePaid || 0);
  const netDue = Math.max(0, grossTotal - advancePaid);
  const [collectedNow, setCollectedNow] = useState(netDue);

  const balanceRemaining = Math.max(0, netDue - Number(collectedNow));

  const handleSettle = (actionType = 'invoice') => {
    if (Number(endKm) < Number(startKm)) {
      alert("Ending Odometer reading cannot be less than Starting reading.");
      return;
    }

    const settlementData = {
      startKm: Number(startKm),
      endKm: Number(endKm),
      actualKm,
      extraKmCharges,
      tollParking: Number(tollParking),
      driverBata: Number(driverBata),
      discount: Number(discount),
      finalPaidAmount: Number(collectedNow),
      settlementPaymentMode: paymentMode,
      settlementNotes: notes || `Meter settled: ${startKm} KM to ${endKm} KM (${actualKm} KM total)`,
      balanceRemaining
    };

    const completedBooking = completeTripAndSettle(booking.id, settlementData);
    onClose();

    if (actionType === 'invoice') {
      setSelectedInvoiceBooking(completedBooking);
    } else if (actionType === 'whatsapp') {
      setWhatsAppData({
        type: 'invoice',
        booking: completedBooking
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#E5DFD3] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-[#E5DFD3] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black shadow-xs">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                Complete Trip & Settle Meter
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                Trip ID: {booking.id} • {booking.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Settlement Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          
          {/* Trip Summary Card */}
          <div className="bg-white rounded-3xl p-3.5 border border-[#E5DFD3] shadow-xs space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#4B5563]">Route:</span>
              <span className="font-black text-[#111827]">{booking.pickupLocation} ➔ {booking.dropLocation}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#4B5563]">Vehicle & Driver:</span>
              <span className="font-bold text-[#111827]">{booking.vehiclePlate || 'Car'} • {booking.driverName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#4B5563]">Package / Base KM:</span>
              <span className="font-bold text-blue-700">{estimatedKm} KM (Extra: ₹{ratePerKm}/km)</span>
            </div>
          </div>

          {/* Odometer Meter Reading Input */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3">
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Odometer Readings (KM)</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                  Start Odometer
                </label>
                <input
                  type="number"
                  value={startKm}
                  onChange={e => setStartKm(Number(e.target.value))}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                  End Odometer
                </label>
                <input
                  type="number"
                  value={endKm}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setEndKm(val);
                  }}
                  className="w-full bg-[#F8F6F0] border-2 border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Distance Ribbon */}
            <div className="bg-emerald-50 rounded-2xl p-2.5 border border-emerald-200 flex items-center justify-between text-xs font-black text-emerald-950">
              <span>Actual Run: {actualKm} KM</span>
              <span>{extraKm > 0 ? `+${extraKm} Extra KM (+₹${extraKmCharges})` : 'Within Package KM'}</span>
            </div>
          </div>

          {/* Extras & Toll Adjustments */}
          <div className="bg-white rounded-3xl p-4 border border-[#E5DFD3] shadow-xs space-y-3">
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Toll, Parking & Adjustments
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                  Toll & Parking (₹)
                </label>
                <input
                  type="number"
                  value={tollParking}
                  onChange={e => setTollParking(Number(e.target.value))}
                  className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                  Driver Allowance / Bata (₹)
                </label>
                <input
                  type="number"
                  value={driverBata}
                  onChange={e => setDriverBata(Number(e.target.value))}
                  className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                Discount (if any) (₹)
              </label>
              <input
                type="number"
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
              />
            </div>
          </div>

          {/* Final Billing & Payment Collection */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#111827] shadow-sm space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#4B5563] font-semibold">
                <span>Base Fare:</span>
                <span className="font-bold text-[#111827]">{formatCurrency(baseFare)}</span>
              </div>
              {extraKmCharges > 0 && (
                <div className="flex justify-between text-[#4B5563] font-semibold">
                  <span>Extra Distance ({extraKm} KM × ₹{ratePerKm}):</span>
                  <span className="font-bold text-amber-700">+{formatCurrency(extraKmCharges)}</span>
                </div>
              )}
              {tollParking > 0 && (
                <div className="flex justify-between text-[#4B5563] font-semibold">
                  <span>Toll & Parking:</span>
                  <span className="font-bold text-[#111827]">+{formatCurrency(tollParking)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Discount Applied:</span>
                  <span className="font-bold">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-[#111827] pt-2 border-t border-gray-200">
                <span>Gross Bill:</span>
                <span>{formatCurrency(grossTotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-800">
                <span>Advance Paid Earlier:</span>
                <span>-{formatCurrency(advancePaid)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#EA580C] pt-1 border-t border-gray-200">
                <span>Net Balance Due:</span>
                <span>{formatCurrency(netDue)}</span>
              </div>
            </div>

            {/* Collection Amount & Mode */}
            <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-black text-[#111827] block mb-1">
                  Amount Collected Now (₹)
                </label>
                <input
                  type="number"
                  value={collectedNow}
                  onChange={e => setCollectedNow(Number(e.target.value))}
                  className="w-full bg-[#F8F6F0] border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-[#111827] block mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={e => setPaymentMode(e.target.value)}
                  className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="Cash">💵 Cash (Driver)</option>
                  <option value="UPI">⚡ Direct UPI</option>
                  <option value="Bank">🏦 Bank Transfer</option>
                  <option value="Credit">⏳ Credit (Due)</option>
                </select>
              </div>
            </div>

            {balanceRemaining > 0 && (
              <p className="text-[10px] text-amber-800 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                ⚠️ ₹{balanceRemaining} remaining balance will be added to {booking.customerName}'s account ledger.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white px-4 py-3 border-t border-[#E5DFD3] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleSettle('whatsapp')}
            className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition tap-active flex items-center justify-center space-x-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Settle & WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSettle('invoice')}
            className="flex-1 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white font-black text-xs shadow-md transition tap-active flex items-center justify-center space-x-1.5"
          >
            <Receipt className="w-4 h-4 text-[#D4F05B]" />
            <span>Settle & GST Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
