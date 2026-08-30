import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageSquare,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Car,
  User,
  CheckCircle2
} from 'lucide-react';

export const WhatsAppModal = ({ data, onClose }) => {
  const { business, formatCurrency } = useApp();
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const type = data.type || 'booking'; // 'booking' | 'duty' | 'invoice' | 'reminder'
  const b = data.booking || {};
  const c = data.customer || {};

  let targetName = data.targetName || b.customerName || c.name || 'Client';
  let targetPhone = data.targetPhone || b.customerPhone || c.phone || '';

  if (type === 'duty') {
    targetName = b.driverName || 'Driver';
    targetPhone = b.driverPhone || '';
  }

  const generateWhatsAppMessage = () => {
    if (data.customMessage) {
      return data.customMessage;
    }

    if (type === 'duty') {
      return `*🚖 DRIVER DUTY SLIP - ${business.name.toUpperCase()}*\n\n` +
        `Hello *${b.driverName || 'Driver'}*,\n` +
        `You have been assigned the following duty:\n\n` +
        `📌 *Trip ID:* ${b.id}\n` +
        `🚗 *Vehicle:* ${b.vehiclePlate}\n` +
        `📍 *Pickup Address:* ${b.pickupLocation}\n` +
        `🏁 *Destination:* ${b.dropLocation}\n` +
        `🗓️ *Reporting Time:* ${new Date(b.startDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}\n\n` +
        `👤 *Passenger Name:* ${b.customerName}\n` +
        `📞 *Passenger Phone:* ${b.customerPhone}\n\n` +
        `💵 *Total Trip Fare:* ${formatCurrency(b.totalFare)}\n` +
        `✅ *Advance Collected:* ${formatCurrency(b.advancePaid)}\n` +
        `💰 *Cash to Collect from Customer:* ${formatCurrency(b.balancePending)}\n\n` +
        `⚠️ *Important Instructions:*\n` +
        `• Keep vehicle clean & wear uniform.\n` +
        `• Record Start KM and End KM in GaadiDesk App.\n` +
        `• Collect balance cash and deposit at office at trip end.\n\n` +
        `📞 *Office Support:* ${business.phone}`;
    }

    if (type === 'reminder') {
      return `*💳 PAYMENT DUE REMINDER - ${business.name.toUpperCase()}*\n\n` +
        `Dear *${c.name}*,\n\n` +
        `This is a gentle reminder regarding your outstanding balance with ${business.name}.\n\n` +
        `💰 *Outstanding Balance:* ${formatCurrency(c.pendingBalance)}\n` +
        `⚡ *UPI ID:* ${business.upiId}\n\n` +
        `Please clear the pending dues via UPI or Bank Transfer.\n` +
        `For questions, reply to this message or call ${business.phone}.\n\n` +
        `_Thank you for your business!_`;
    }

    if (type === 'invoice') {
      return `*🧾 TRIP SETTLEMENT & TAX RECEIPT - ${business.name.toUpperCase()}*\n\n` +
        `Dear *${b.customerName}*,\n` +
        `Thank you for traveling with ${business.name}! Here is your trip summary:\n\n` +
        `📌 *Invoice / Trip ID:* ${b.invoiceNumber || b.id}\n` +
        `📍 *Route:* ${b.pickupLocation} ➔ ${b.dropLocation}\n` +
        `🚗 *Vehicle:* ${b.vehiclePlate}\n` +
        `🛣️ *Distance Covered:* ${b.actualKm || b.estimatedKm} KM\n\n` +
        `💵 *Gross Trip Fare:* ${formatCurrency(b.totalFare)}\n` +
        `✅ *Total Amount Paid:* ${formatCurrency(b.advancePaid)}\n` +
        `⏳ *Remaining Balance:* ${formatCurrency(b.balancePending)}\n\n` +
        `_We look forward to serving you again!_`;
    }

    // Default Customer Booking Confirmation
    return `*🚖 BOOKING CONFIRMATION - ${business.name.toUpperCase()}*\n\n` +
      `Dear *${b.customerName}*,\n` +
      `Your booking is confirmed with details below:\n\n` +
      `📌 *Booking ID:* ${b.id}\n` +
      `🛣️ *Trip Type:* ${b.tripType}\n` +
      `📍 *Pickup:* ${b.pickupLocation}\n` +
      `🏁 *Drop:* ${b.dropLocation}\n` +
      `🗓️ *Date & Time:* ${new Date(b.startDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}\n\n` +
      `🚗 *Vehicle:* ${b.vehiclePlate}\n` +
      `👤 *Driver:* ${b.driverName || 'Will be assigned 2 hours prior'} (${b.driverPhone || 'Shared soon'})\n\n` +
      `💵 *Total Estimated Fare:* ${formatCurrency(b.totalFare)}\n` +
      `✅ *Advance Paid:* ${formatCurrency(b.advancePaid)}\n` +
      `⏳ *Balance Due:* ${formatCurrency(b.balancePending)}\n\n` +
      `📞 *Office Support:* ${business.phone}\n` +
      `_Thank you for choosing ${business.name}!_`;
  };

  const messageText = generateWhatsAppMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectWhatsApp = () => {
    let cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    // Ensure 91 country code prefix if 10-digit Indian number
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                {data.title || (type === 'duty' ? 'Driver Duty Slip' : type === 'reminder' ? 'Payment Reminder' : 'WhatsApp Slip')}
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">
                Send to {targetName} {targetPhone ? `(${targetPhone})` : ''}
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

        {/* Message Preview in WhatsApp Green Bubble */}
        <div className="bg-[#E7F7ED] rounded-3xl p-3.5 border border-emerald-300 space-y-2 text-xs font-mono text-[#111827] max-h-64 overflow-y-auto no-scrollbar shadow-inner leading-relaxed whitespace-pre-wrap">
          {messageText}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] bg-white text-[#111827] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 tap-active shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-700" /> : <Copy className="w-3.5 h-3.5 text-[#111827]" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleDirectWhatsApp}
            className="flex-1 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 tap-active"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Open WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
