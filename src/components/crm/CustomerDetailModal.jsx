import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Users,
  Building,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
  MapPin,
  FileText,
  Navigation,
  ArrowRight,
  CheckCircle2,
  Clock,
  Car,
  Receipt,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const CustomerDetailModal = ({ customer, onClose }) => {
  const {
    bookings,
    formatCurrency,
    openNewBookingWithPrefill,
    setCustomerSettlementData,
    setSelectedTripDetailBooking,
    setSelectedInvoiceBooking,
    setWhatsAppData
  } = useApp();

  const [tripFilter, setTripFilter] = useState('All'); // 'All' | 'Completed' | 'Ongoing' | 'Confirmed' | 'Cancelled'

  if (!customer) return null;

  // Filter bookings associated with this customer by name or phone
  const customerTrips = bookings.filter(b =>
    (b.customerName && b.customerName.toLowerCase() === customer.name.toLowerCase()) ||
    (b.customerPhone && customer.phone && b.customerPhone.includes(customer.phone))
  );

  // Financial calculations from actual trips
  const totalBilled = customerTrips
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + Number(b.totalFare || 0), 0);

  const completedTripsCount = customerTrips.filter(b => b.status === 'Completed').length;
  const ongoingTripsCount = customerTrips.filter(b => b.status === 'Ongoing' || b.status === 'Driver Assigned' || b.status === 'Confirmed').length;

  const filteredTrips = customerTrips.filter(b => {
    if (tripFilter === 'All') return true;
    if (tripFilter === 'Ongoing') return b.status === 'Ongoing' || b.status === 'Driver Assigned' || b.status === 'Confirmed';
    return b.status === tripFilter;
  });

  const handleBookNewTrip = () => {
    onClose();
    openNewBookingWithPrefill({
      customerName: customer.name,
      customerPhone: customer.phone,
      pickupLocation: customer.address || ''
    });
  };

  const handleSettleDue = () => {
    onClose();
    setCustomerSettlementData(customer);
  };

  const handleOpenTrip = (trip) => {
    onClose();
    setSelectedTripDetailBooking(trip);
  };

  const handleViewInvoice = (trip, e) => {
    e.stopPropagation();
    onClose();
    setSelectedInvoiceBooking(trip);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] w-full max-w-xl rounded-t-3xl sm:rounded-4xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#E5DFD3] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-[#E5DFD3] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black shadow-xs">
              {customer.type === 'Corporate' ? <Building className="w-5 h-5" /> : <Users className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#111827]">{customer.name}</h3>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                  customer.type === 'Corporate'
                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                    : 'bg-blue-100 text-blue-900 border-blue-300'
                }`}>
                  {customer.type || 'Personal'}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] font-semibold mt-0.5">
                📞 +91 {customer.phone}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border-2 border-[#E5DFD3] shadow-xs">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Total Bookings
              </span>
              <span className="text-lg font-black text-[#111827] mt-0.5 block">
                {customerTrips.length}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                {completedTripsCount} Completed
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border-2 border-[#E5DFD3] shadow-xs">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Lifetime Spend
              </span>
              <span className="text-lg font-black text-[#111827] mt-0.5 block">
                {formatCurrency(totalBilled)}
              </span>
              <span className="text-[10px] text-blue-700 font-bold">
                Gross Billed
              </span>
            </div>

            <div className={`rounded-2xl p-3 border-2 shadow-xs ${
              customer.pendingBalance > 0
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block">
                Pending Balance
              </span>
              <span className={`text-lg font-black mt-0.5 block ${
                customer.pendingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {formatCurrency(customer.pendingBalance || 0)}
              </span>
              <span className="text-[10px] font-bold">
                {customer.pendingBalance > 0 ? '⚠️ Due Pending' : '✓ All Cleared'}
              </span>
            </div>
          </div>

          {/* Customer Address & Business Notes */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-2.5 shadow-xs">
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Contact & Billing Information</span>
            </h4>

            <div className="space-y-1.5 text-xs text-[#374151]">
              {customer.address ? (
                <div className="flex items-start gap-2 bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E5DFD3]">
                  <span className="font-bold text-gray-500 shrink-0">Address:</span>
                  <span className="font-semibold">{customer.address}</span>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 italic">No address registered.</p>
              )}

              {customer.gstin && (
                <div className="flex items-center justify-between bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E5DFD3]">
                  <span className="font-bold text-gray-500">GSTIN No:</span>
                  <span className="font-mono font-black text-[#111827]">{customer.gstin}</span>
                </div>
              )}

              {customer.notes && (
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-950 text-[11px]">
                  <span className="font-bold block">Operator Notes:</span>
                  <span>{customer.notes}</span>
                </div>
              )}
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
              <a
                href={`tel:${customer.phone}`}
                className="py-2 rounded-xl bg-white border border-[#E5DFD3] text-[#111827] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 tap-active shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Party</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setWhatsAppData({
                    type: 'booking',
                    booking: {
                      customerName: customer.name,
                      customerPhone: customer.phone,
                      pickupLocation: customer.address || 'Pune Hub',
                      id: 'ENQUIRY'
                    }
                  });
                }}
                className="py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 tap-active shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              {customer.pendingBalance > 0 ? (
                <button
                  type="button"
                  onClick={handleSettleDue}
                  className="py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center gap-1 shadow-xs tap-active"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Settle Due</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBookNewTrip}
                  className="py-2 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-1 shadow-xs tap-active"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4F05B]" />
                  <span>Book Trip</span>
                </button>
              )}
            </div>
          </div>

          {/* Customer Trips History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trip History & Duty Logs ({customerTrips.length})</span>
                </h4>
                <p className="text-[10px] text-[#4B5563] font-semibold">
                  Tap any trip to open detailed timeline, maps & tax invoice
                </p>
              </div>

              {/* Trip Filter Pills */}
              <div className="flex space-x-1 bg-white p-1 rounded-full border border-[#E5DFD3]">
                {['All', 'Completed', 'Ongoing'].map(f => (
                  <button
                    key={f}
                    onClick={() => setTripFilter(f)}
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-all ${
                      tripFilter === f ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Trips List */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-[#E5DFD3] text-center space-y-2 shadow-xs">
                <Car className="w-8 h-8 text-gray-400 mx-auto" />
                <h5 className="text-xs font-black text-[#111827]">No trips found</h5>
                <p className="text-[11px] text-gray-500 font-semibold">
                  No {tripFilter !== 'All' ? tripFilter.toLowerCase() : ''} bookings registered for this customer yet.
                </p>
                <button
                  onClick={handleBookNewTrip}
                  className="mt-2 px-4 py-1.5 rounded-full bg-[#111827] text-white text-xs font-black inline-flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3 text-[#D4F05B]" />
                  <span>Create First Booking</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTrips.map(trip => {
                  const isCompleted = trip.status === 'Completed';
                  const isOngoing = trip.status === 'Ongoing' || trip.status === 'Driver Assigned';
                  const isCancelled = trip.status === 'Cancelled';

                  return (
                    <div
                      key={trip.id}
                      onClick={() => handleOpenTrip(trip)}
                      className="bg-white rounded-2xl p-3.5 border-2 border-[#E5DFD3] hover:border-[#111827] cursor-pointer transition-all space-y-2 shadow-xs group"
                    >
                      {/* Top Bar: Trip ID, Type & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-[#111827] group-hover:text-blue-600">
                            {trip.id}
                          </span>
                          <span className="text-[10px] bg-[#F8F6F0] text-[#374151] font-black px-2 py-0.5 rounded-full border border-[#E5DFD3]">
                            {trip.tripType || 'Outstation'}
                          </span>
                        </div>

                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isOngoing
                            ? 'bg-amber-50 text-amber-900 border-amber-300 animate-pulse'
                            : isCancelled
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-blue-50 text-blue-900 border-blue-300'
                        }`}>
                          {trip.status}
                        </span>
                      </div>

                      {/* Route */}
                      <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
                        <span className="truncate">{trip.pickupLocation}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate text-gray-600">{trip.dropLocation}</span>
                      </div>

                      {/* Details row: Car, Driver, Date */}
                      <div className="flex items-center justify-between text-[11px] text-[#4B5563] pt-1 border-t border-gray-100 font-semibold">
                        <div className="flex items-center gap-2 truncate">
                          <span>📅 {new Date(trip.startDateTime || trip.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
                          <span>•</span>
                          <span className="truncate">🚘 {trip.vehiclePlate?.split(' ')[0] || 'Assigned Car'}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#111827] block">
                            {formatCurrency(trip.totalFare)}
                          </span>
                          {trip.balancePending > 0 ? (
                            <span className="text-[10px] font-bold text-rose-600">
                              {formatCurrency(trip.balancePending)} Due
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700">
                              Paid in Full
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions Footer inside trip card */}
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200 text-[11px]">
                        <span className="text-[#EA580C] font-black group-hover:underline flex items-center gap-0.5">
                          <span>View Full Trip Dossier</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => handleViewInvoice(trip, e)}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-[#111827] rounded-md font-bold flex items-center gap-1 text-[10px]"
                        >
                          <Receipt className="w-3 h-3 text-[#EA580C]" />
                          <span>Tax Invoice</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="bg-white p-4 border-t border-[#E5DFD3] flex items-center justify-between sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#374151] text-xs font-bold tap-active"
          >
            Close
          </button>

          <button
            onClick={handleBookNewTrip}
            className="px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-md tap-active"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4F05B]" />
            <span>Book New Trip For Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
