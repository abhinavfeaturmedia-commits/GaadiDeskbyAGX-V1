import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MoneyAnalytics } from './MoneyAnalytics';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Plus,
  TrendingUp,
  X,
  CreditCard,
  Banknote,
  Fuel,
  Wrench,
  Receipt,
  UserCheck,
  MessageCircle,
  Clock,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export const MoneyDashboard = () => {
  const {
    t,
    business,
    customers,
    expenses,
    transactions,
    addExpense,
    getFinancialStats,
    formatCurrency,
    isNewExpenseOpen,
    setIsNewExpenseOpen,
    setCustomerSettlementData,
    setWhatsAppData,
    moneySubTab,
    setMoneySubTab
  } = useApp();

  const financialStats = getFinancialStats();
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrAmount, setQrAmount] = useState('2500');

  // Expense form
  const [expenseForm, setExpenseForm] = useState({
    category: 'Fuel',
    description: '',
    amount: '',
    paymentMode: 'Cash'
  });

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) {
      alert("Please enter expense amount and description.");
      return;
    }
    addExpense(expenseForm);
    setIsNewExpenseOpen(false);
    setExpenseForm({
      category: 'Fuel',
      description: '',
      amount: '',
      paymentMode: 'Cash'
    });
  };

  const pendingCustomersList = customers.filter(c => Number(c.pendingBalance || 0) > 0);

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#111827]">{t('tileMoney')}</h2>
          <p className="text-xs text-[#4B5563] font-semibold">
            {moneySubTab === 'analytics'
              ? 'Multi-period P&L, expense leaks & vehicle ROI'
              : "Today's collections, expenses & pending ledger"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3.5 py-1.5 rounded-full bg-white border-2 border-[#E5DFD3] text-[#111827] text-xs font-black flex items-center gap-1.5 shadow-xs hover:bg-gray-50 tap-active"
          >
            <QrCode className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>UPI QR</span>
          </button>
          <button
            onClick={() => setIsNewExpenseOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#111827] text-white text-xs font-black flex items-center gap-1 shadow-xs hover:bg-black tap-active"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4F05B]" />
            <span>Expense</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Segmented Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-full border border-[#E5DFD3] shadow-xs">
        <button
          onClick={() => setMoneySubTab('daily')}
          className={`flex-1 py-2 rounded-full text-xs font-black transition-all tap-active flex items-center justify-center space-x-1.5 ${
            moneySubTab === 'daily'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <span>💵 Today's Cashflow</span>
        </button>
        <button
          onClick={() => setMoneySubTab('analytics')}
          className={`flex-1 py-2 rounded-full text-xs font-black transition-all tap-active flex items-center justify-center space-x-1.5 ${
            moneySubTab === 'analytics'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#4B5563] hover:text-[#111827]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>📊 Money Analytics</span>
        </button>
      </div>

      {/* RENDER ANALYTICS SUBPAGE */}
      {moneySubTab === 'analytics' ? (
        <MoneyAnalytics />
      ) : (
        <>
          {/* Hero Financial Card */}
          <div className="bg-[#111827] rounded-3xl p-5 text-white shadow-md space-y-4 border border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="font-bold">{t('netProfit')}</span>
              <span className="bg-[#D4F05B] text-[#111827] font-black px-2.5 py-0.5 rounded-full text-[10px] shadow-xs">
                TODAY'S CASHFLOW
              </span>
            </div>

        <div>
          <h3 className="text-3xl font-black text-white tracking-tight">
            {formatCurrency(financialStats.netProfitToday)}
          </h3>
          <p className="text-[11px] text-gray-300 mt-0.5 font-semibold">
            Collected Today: {formatCurrency(financialStats.totalCollectedToday)} • Expenses: {formatCurrency(financialStats.totalExpensesToday)}
          </p>
        </div>

        {/* Collection Breakdown Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800 text-center">
          <div className="bg-white/10 rounded-2xl p-2">
            <span className="text-[10px] text-gray-300 block font-bold">💵 Cash</span>
            <span className="text-xs font-black text-green-300">
              {formatCurrency(financialStats.cashToday)}
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2">
            <span className="text-[10px] text-gray-300 block font-bold">⚡ UPI</span>
            <span className="text-xs font-black text-cyan-300">
              {formatCurrency(financialStats.upiToday)}
            </span>
          </div>
          <div className="bg-white/10 rounded-2xl p-2">
            <span className="text-[10px] text-gray-300 block font-bold">🏦 Bank</span>
            <span className="text-xs font-black text-yellow-300">
              {formatCurrency(financialStats.bankToday)}
            </span>
          </div>
        </div>
      </div>

      {/* Driver Cash-In-Hand Tracker */}
      {financialStats.driverCash > 0 && (
        <div className="bg-amber-50 rounded-3xl p-3.5 border-2 border-amber-300 shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
              💵
            </div>
            <div>
              <p className="text-xs font-black text-amber-950">Driver Cash-In-Hand</p>
              <p className="text-[11px] text-amber-800 font-semibold">
                {formatCurrency(financialStats.driverCash)} with on-trip drivers
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black bg-amber-200 text-amber-950 px-2.5 py-1 rounded-full">
            Active Trips
          </span>
        </div>
      )}

      {/* Outstanding Customer Dues (B2B Credit Ledger) */}
      <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
              Outstanding Customer Dues
            </h3>
            <p className="text-[11px] text-[#4B5563] font-semibold">
              Total Pending: <b className="text-rose-700">{formatCurrency(financialStats.pendingCustomers)}</b>
            </p>
          </div>
        </div>

        {pendingCustomersList.length === 0 ? (
          <div className="p-4 text-center text-xs text-emerald-800 bg-emerald-50 rounded-2xl border border-emerald-200 font-bold">
            ✓ All customer accounts are fully settled. Zero pending dues!
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingCustomersList.map(cust => (
              <div
                key={cust.id}
                className="p-3 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-black text-[#111827]">{cust.name}</h4>
                  <p className="text-[10px] text-[#4B5563] font-semibold">
                    {cust.phone} • {cust.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-rose-700 text-xs">
                    {formatCurrency(cust.pendingBalance)}
                  </span>
                  <button
                    onClick={() => setCustomerSettlementData(cust)}
                    className="px-2.5 py-1 rounded-full bg-[#111827] text-white text-[10px] font-black hover:bg-black tap-active"
                  >
                    Receive
                  </button>
                  <button
                    onClick={() => setWhatsAppData({ type: 'reminder', customer: cust })}
                    className="p-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 tap-active"
                    title="Send WhatsApp Balance Reminder"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Transaction Ledger Stream */}
      <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3">
        <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider">
          Transaction Activity Ledger
        </h3>

        <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
          {transactions.slice(0, 8).map(tx => {
            const isIncome = tx.type === 'Income';
            return (
              <div
                key={tx.id}
                className="p-3 rounded-2xl border border-[#E5DFD3] bg-[#F8F6F0] flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-black text-[#111827]">{tx.category}</h4>
                    <p className="text-[10px] text-[#4B5563] font-semibold">
                      {tx.customerName || tx.vehiclePlate || tx.notes} • {tx.paymentMode} ({tx.time || tx.date})
                    </p>
                  </div>
                </div>
                <span className={`font-black ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )}

      {/* New Expense Modal */}
      {isNewExpenseOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#111827]">
                Record Fleet Expense
              </h3>
              <button
                onClick={() => setIsNewExpenseOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Expense Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="Fuel">⛽ Fuel (Petrol/Diesel/CNG)</option>
                  <option value="Workshop / Maintenance">🔧 Workshop / Repair</option>
                  <option value="Driver Salary / Payout">👤 Driver Payout / Bata</option>
                  <option value="Toll & Fastag Recharge">🛣️ Fastag / Toll Recharge</option>
                  <option value="Office & Tea">☕ Office & Misc</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diesel 25L for Ertiga MH12 QX 9012"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Payment Mode</label>
                <select
                  value={expenseForm.paymentMode}
                  onChange={e => setExpenseForm(prev => ({ ...prev, paymentMode: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="Cash">💵 Cash</option>
                  <option value="UPI">⚡ UPI</option>
                  <option value="Bank">🏦 Bank</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewExpenseOpen(false)}
                  className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] text-xs font-black text-[#4B5563] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Dialog */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#F8F6F0] rounded-4xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl border-2 border-[#E5DFD3]">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-[#111827]">Instant UPI QR</h3>
              <button onClick={() => setShowQrModal(false)} className="text-[#4B5563] hover:text-[#111827]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border-2 border-[#E5DFD3] inline-block shadow-xs">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${business.upiId}%26pn=${encodeURIComponent(business.name)}%26am=${qrAmount}%26cu=INR`}
                alt="UPI QR Code"
                className="w-40 h-40 mx-auto"
              />
            </div>

            <div>
              <p className="text-xs font-black text-[#111827]">{business.name}</p>
              <p className="text-[11px] font-mono text-[#4B5563]">{business.upiId}</p>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4B5563] block mb-1">Set Dynamic Amount (₹)</label>
              <input
                type="number"
                value={qrAmount}
                onChange={e => setQrAmount(e.target.value)}
                className="w-full bg-white border-2 border-[#E5DFD3] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-center text-[#111827]"
              />
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
