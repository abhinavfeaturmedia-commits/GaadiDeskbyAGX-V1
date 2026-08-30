import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Printer,
  Share2,
  FileText,
  CheckCircle,
  Download,
  Building,
  Phone,
  Calendar,
  CreditCard
} from 'lucide-react';

export const InvoiceGenerator = ({ booking, onClose }) => {
  const { business, formatCurrency, setWhatsAppData } = useApp();
  const invoiceRef = useRef();

  if (!booking) return null;

  const isGst = booking.gstEnabled !== false && business.gstin;
  const taxableAmount = booking.taxableAmount || (booking.totalFare / 1.05);
  const cgstAmount = isGst ? Math.round(taxableAmount * 0.025) : 0;
  const sgstAmount = isGst ? Math.round(taxableAmount * 0.025) : 0;
  const totalAmount = booking.totalFare;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*TAX INVOICE - ${business.name}*\n` +
      `Invoice No: ${booking.invoiceNumber || 'GD/2026-27/0101'}\n` +
      `Customer: ${booking.customerName}\n` +
      `Vehicle: ${booking.vehiclePlate}\n` +
      `Trip: ${booking.pickupLocation} ➔ ${booking.dropLocation}\n` +
      `Dates: ${new Date(booking.startDateTime).toLocaleDateString()} to ${new Date(booking.endDateTime).toLocaleDateString()}\n` +
      `Taxable Value: ${formatCurrency(taxableAmount)}\n` +
      (isGst ? `CGST (2.5%): ${formatCurrency(cgstAmount)}\nSGST (2.5%): ${formatCurrency(sgstAmount)}\n` : '') +
      `*Total Amount: ${formatCurrency(totalAmount)}*\n` +
      `Advance Paid: ${formatCurrency(booking.advancePaid)}\n` +
      `*Balance Due: ${formatCurrency(booking.balancePending)}*\n\n` +
      `Thank you for traveling with ${business.name}!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-4xl max-w-[430px] w-full max-h-[92vh] flex flex-col shadow-2xl border border-card-border overflow-hidden print:max-w-none print:shadow-none print:border-none print:rounded-none">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-card-border flex items-center justify-between bg-[#FBF8F2] print:hidden">
          <div className="flex items-center space-x-2.5">
            <img src="/gaadidesk_logo.png" alt="GaadiDesk" className="w-6 h-6 rounded-lg object-cover shadow-xs" />
            <h3 className="text-sm font-extrabold text-[#1E232A]">
              {isGst ? 'GST Tax Invoice' : 'Trip Duty Slip & Bill'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Invoice Body */}
        <div ref={invoiceRef} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-gray-800 no-scrollbar">
          {/* Business Header */}
          <div className="border-b-2 border-gray-900 pb-3 space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base font-extrabold text-[#1E232A] uppercase">
                  {business.name}
                </h2>
                <p className="text-[10px] text-gray-600 max-w-[220px]">
                  {business.address}
                </p>
                <p className="text-[10px] text-gray-600">
                  Phone: {business.phone} • WhatsApp: {business.whatsapp}
                </p>
              </div>
              <div className="text-right">
                <span className="bg-gray-900 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  {isGst ? 'TAX INVOICE' : 'BILL OF SUPPLY'}
                </span>
                <p className="text-[11px] font-bold text-gray-900 mt-1">
                  {booking.invoiceNumber || 'GD/2026-27/0101'}
                </p>
                <p className="text-[10px] text-gray-500">
                  Date: {new Date().toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {business.gstin && (
              <p className="text-[11px] font-extrabold text-gray-900 pt-1">
                GSTIN: <span className="font-mono">{business.gstin}</span> (State: Maharashtra - 27)
              </p>
            )}
          </div>

          {/* Customer & Trip Details Box */}
          <div className="bg-[#FBF8F2] rounded-2xl p-3 border border-card-border space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Billed To:</span>
                <p className="font-extrabold text-gray-900 text-xs">{booking.customerName}</p>
                <p className="text-[10px] text-gray-600">{booking.customerPhone}</p>
                {booking.customerGstin && (
                  <p className="text-[10px] font-mono font-bold text-gray-800">GST: {booking.customerGstin}</p>
                )}
              </div>
              <div>
                <span className="text-[10px] text-text-secondary uppercase font-bold block">Vehicle & Driver:</span>
                <p className="font-bold text-gray-900 text-[11px]">{booking.vehiclePlate}</p>
                <p className="text-[10px] text-gray-600">Driver: {booking.driverName || 'Santosh More'}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-card-border text-[11px]">
              <p className="font-semibold text-gray-800">
                Route: <span className="font-normal">{booking.pickupLocation} ➔ {booking.dropLocation}</span>
              </p>
              <p className="text-[10px] text-gray-600">
                Period: {new Date(booking.startDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} to {new Date(booking.endDateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-gray-300 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-[10px] font-extrabold uppercase text-gray-700">
                <tr>
                  <th className="p-2 border-b border-gray-300">Description</th>
                  <th className="p-2 border-b border-gray-300">SAC</th>
                  <th className="p-2 border-b border-gray-300 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-[11px]">
                <tr>
                  <td className="p-2">
                    <p className="font-bold">{booking.tripType} Cab / Rental Service</p>
                    <p className="text-[10px] text-gray-500">Base package & hire charges</p>
                  </td>
                  <td className="p-2 font-mono text-[10px]">9966</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(booking.baseFare || taxableAmount)}</td>
                </tr>

                {booking.driverBata > 0 && (
                  <tr>
                    <td className="p-2">Driver Bata / Allowance</td>
                    <td className="p-2 font-mono text-[10px]">9966</td>
                    <td className="p-2 text-right">{formatCurrency(booking.driverBata)}</td>
                  </tr>
                )}

                {booking.nightHalt > 0 && (
                  <tr>
                    <td className="p-2">Night Halt Charge</td>
                    <td className="p-2 font-mono text-[10px]">9966</td>
                    <td className="p-2 text-right">{formatCurrency(booking.nightHalt)}</td>
                  </tr>
                )}

                {booking.tollParking > 0 && (
                  <tr>
                    <td className="p-2">Toll & Parking Reimbursable</td>
                    <td className="p-2 font-mono text-[10px]">9966</td>
                    <td className="p-2 text-right">{formatCurrency(booking.tollParking)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Calculation */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-600">Taxable Value:</span>
              <span className="font-bold">{formatCurrency(taxableAmount)}</span>
            </div>

            {isGst && (
              <>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-600">CGST @ 2.5%:</span>
                  <span className="font-bold">{formatCurrency(cgstAmount)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-600">SGST @ 2.5%:</span>
                  <span className="font-bold">{formatCurrency(sgstAmount)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t-2 border-gray-900">
              <span>Grand Total:</span>
              <span className="text-accent-amber">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="flex justify-between text-xs font-bold text-gray-700">
              <span>Advance Paid:</span>
              <span className="text-green-700">{formatCurrency(booking.advancePaid)}</span>
            </div>

            <div className="flex justify-between text-xs font-extrabold text-red-700 pt-1 border-t border-dashed border-gray-300">
              <span>Balance Payable:</span>
              <span>{formatCurrency(booking.balancePending)}</span>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="pt-3 border-t border-gray-200 text-[9px] text-gray-500 space-y-1">
            <p>1. Toll, parking and state entry tax as per actual receipts.</p>
            <p>2. Subject to Pune jurisdiction.</p>
            <div className="flex justify-between items-end pt-4">
              <div>
                <p className="font-bold text-gray-800">For {business.name}</p>
                <p className="text-[8px]">Authorized Signatory</p>
              </div>
              <div className="w-24 border-b border-gray-400"></div>
            </div>
          </div>

          {/* Powered by GaadiDesk Watermark Stamp */}
          <div className="pt-2.5 mt-2 border-t border-gray-100 flex items-center justify-between text-[8px] text-gray-400">
            <div className="flex items-center space-x-1">
              <img src="/gaadidesk_logo.png" alt="GaadiDesk" className="w-3.5 h-3.5 rounded-sm object-cover opacity-75" />
              <span>Generated via <b>GaadiDesk by AGX</b> • Indian Fleet OS</span>
            </div>
            <span>Verified Computer Generated Bill</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-5 py-3 border-t border-card-border bg-[#FBF8F2] flex items-center space-x-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 rounded-full border border-card-border bg-white text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 tap-active shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2 rounded-full bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:bg-emerald-700 tap-active"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
