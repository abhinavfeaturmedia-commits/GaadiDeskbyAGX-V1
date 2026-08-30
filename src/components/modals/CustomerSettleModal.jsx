import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Receipt
} from 'lucide-react';

export const CustomerSettleModal = () => {
  const {
    customerSettlementData,
    setCustomerSettlementData,
    settleCustomerPayment,
    formatCurrency
  } = useApp();

  if (!customerSettlementData) return null;

  const [amount, setAmount] = useState(customerSettlementData.pendingBalance || 0);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(amount) <= 0) {
      alert("Please enter a valid amount greater than zero.");
      return;
    }

    settleCustomerPayment(customerSettlementData.id, amount, paymentMode, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                Record Customer Payment
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                {customerSettlementData.name} ({customerSettlementData.phone})
              </p>
            </div>
          </div>
          <button
            onClick={() => setCustomerSettlementData(null)}
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-white p-3 rounded-2xl border border-[#E5DFD3] flex justify-between items-center text-xs">
            <span className="font-bold text-[#4B5563]">Total Outstanding Due:</span>
            <span className="font-black text-rose-700">{formatCurrency(customerSettlementData.pendingBalance)}</span>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Payment Amount Received (₹) *
            </label>
            <input
              type="number"
              required
              max={customerSettlementData.pendingBalance}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full bg-white border-2 border-emerald-300 rounded-2xl px-3 py-2.5 text-xs font-mono font-black text-emerald-950 focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Payment Mode
            </label>
            <select
              value={paymentMode}
              onChange={e => setPaymentMode(e.target.value)}
              className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
            >
              <option value="UPI">⚡ UPI / GPay / PhonePe</option>
              <option value="Cash">💵 Cash</option>
              <option value="Bank">🏦 NetBanking / NEFT</option>
              <option value="Cheque">📄 Cheque</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[#111827] block mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Cleared pending bill for Goa trip"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setCustomerSettlementData(null)}
              className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] text-xs font-black text-[#4B5563] hover:bg-gray-50 tap-active"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black tap-active flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4F05B]" />
              <span>Record & Deduct</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
