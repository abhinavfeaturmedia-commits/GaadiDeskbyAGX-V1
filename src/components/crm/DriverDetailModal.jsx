import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  UserCheck,
  Phone,
  MessageSquare,
  Calendar,
  CreditCard,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Navigation,
  ArrowRight,
  Car,
  ChevronRight,
  Receipt,
  User,
  Gauge,
  Wallet
} from 'lucide-react';

export const DriverDetailModal = ({ driver, onClose }) => {
  const {
    bookings,
    formatCurrency,
    setSelectedTripDetailBooking,
    setRenewalModalData,
    setWhatsAppData
  } = useApp();

  const [dutyFilter, setDutyFilter] = useState('All'); // 'All' | 'Completed' | 'Ongoing'

  if (!driver) return null;

  // Filter bookings assigned to this driver by ID or name
  const driverTrips = bookings.filter(b =>
    (b.driverId && b.driverId === driver.id) ||
    (b.driverName && b.driverName.toLowerCase().includes(driver.name.toLowerCase()))
  );

  const completedTrips = driverTrips.filter(b => b.status === 'Completed');
  const ongoingTrips = driverTrips.filter(b => b.status === 'Ongoing' || b.status === 'Driver Assigned' || b.status === 'Confirmed');

  const totalKmDriven = driverTrips
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + Number(b.actualKm || b.estimatedKm || 120), 0);

  const totalBataEarned = driverTrips
    .filter(b => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + Number(b.driverBata || 400), 0);

  const filteredTrips = driverTrips.filter(b => {
    if (dutyFilter === 'All') return true;
    if (dutyFilter === 'Ongoing') return b.status === 'Ongoing' || b.status === 'Driver Assigned' || b.status === 'Confirmed';
    return b.status === dutyFilter;
  });

  // Calculate DL expiry urgency
  const today = new Date();
  const dlExp = driver.dlExpiry ? new Date(driver.dlExpiry) : new Date('2028-01-01');
  const daysUntilExpiry = Math.ceil((dlExp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isDlUrgent = daysUntilExpiry <= 30;

  const handleOpenTrip = (trip) => {
    onClose();
    setSelectedTripDetailBooking(trip);
  };

  const handleRenewDl = () => {
    onClose();
    setRenewalModalData({
      type: 'Driver DL',
      title: `Renew Driver's License — ${driver.name}`,
      entityId: driver.id,
      entityName: driver.name,
      currentExpiry: driver.dlExpiry,
      docType: 'Driver License (DL)'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] w-full max-w-xl rounded-t-3xl sm:rounded-4xl max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#E5DFD3] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-[#E5DFD3] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#111827]">{driver.name}</h3>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  driver.status === 'On Trip'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse'
                    : 'bg-gray-100 text-gray-800 border-gray-300'
                }`}>
                  {driver.status || 'Available'}
                </span>
              </div>
              <p className="text-xs text-[#4B5563] font-semibold mt-0.5">
                📞 +91 {driver.phone}
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Performance & Payout Summary */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border-2 border-[#E5DFD3] shadow-xs">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Trips Driven
              </span>
              <span className="text-lg font-black text-[#111827] mt-0.5 block">
                {driverTrips.length}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                {completedTrips.length} Completed
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border-2 border-[#E5DFD3] shadow-xs">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Odometer KM
              </span>
              <span className="text-lg font-black text-[#111827] mt-0.5 block">
                {totalKmDriven.toLocaleString()} KM
              </span>
              <span className="text-[10px] text-blue-700 font-bold">
                Logged on Road
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border-2 border-[#E5DFD3] shadow-xs">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider block">
                Driver Bata / Payout
              </span>
              <span className="text-lg font-black text-amber-900 mt-0.5 block">
                {formatCurrency(totalBataEarned)}
              </span>
              <span className="text-[10px] text-amber-700 font-bold">
                Trip Allowance
              </span>
            </div>
          </div>

          {/* License & Employment Dossier Card */}
          <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
            <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>License & Employment Terms</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E5DFD3]">
                <span className="text-[10px] font-bold text-gray-500 block">Driving License No.</span>
                <span className="font-mono font-black text-[#111827]">
                  {driver.dlNumber || 'MH12 20190014298'}
                </span>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isDlUrgent
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-[#F8F6F0] border-[#E5DFD3] text-[#111827]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 block">DL Expiry</span>
                  {isDlUrgent && <span className="text-[9px] font-black bg-rose-600 text-white px-1.5 py-0.2 rounded">Urgent</span>}
                </div>
                <span className="font-black">
                  📅 {driver.dlExpiry || '2028-01-01'}
                </span>
              </div>

              <div className="bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E5DFD3]">
                <span className="text-[10px] font-bold text-gray-500 block">Salary / Scheme</span>
                <span className="font-black text-[#111827]">
                  ₹{driver.monthlySalary || 18000}/mo ({driver.payoutType || 'Salary'})
                </span>
              </div>

              <div className="bg-[#F8F6F0] p-2.5 rounded-xl border border-[#E5DFD3]">
                <span className="text-[10px] font-bold text-gray-500 block">Emergency Contact</span>
                <span className="font-semibold text-[#111827]">
                  {driver.emergencyContact || '+91 9822001122'}
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
              <a
                href={`tel:${driver.phone}`}
                className="py-2 rounded-xl bg-white border border-[#E5DFD3] text-[#111827] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 tap-active shadow-xs"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Call Driver</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setWhatsAppData({
                    type: 'duty',
                    booking: driverTrips[0] || {
                      customerName: 'Assigned Duty',
                      customerPhone: '9876543210',
                      pickupLocation: 'Pune Station',
                      dropLocation: 'Mumbai Airport',
                      startDateTime: new Date().toISOString(),
                      driverName: driver.name,
                      driverPhone: driver.phone,
                      vehiclePlate: 'MH12 AB 1234',
                      id: 'DUTY-DISPATCH'
                    }
                  });
                }}
                className="py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-100 tap-active shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleRenewDl}
                className="py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-black flex items-center justify-center gap-1 shadow-xs tap-active border border-amber-300"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Renew DL</span>
              </button>
            </div>
          </div>

          {/* Assigned Duties & History Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Assigned Duties & Trips ({driverTrips.length})</span>
                </h4>
                <p className="text-[10px] text-[#4B5563] font-semibold">
                  Click on any duty to inspect full route, passenger & meter info
                </p>
              </div>

              {/* Duty Filter Pills */}
              <div className="flex space-x-1 bg-white p-1 rounded-full border border-[#E5DFD3]">
                {['All', 'Completed', 'Ongoing'].map(f => (
                  <button
                    key={f}
                    onClick={() => setDutyFilter(f)}
                    className={`px-2 py-0.5 text-[10px] font-black rounded-full transition-all ${
                      dutyFilter === f ? 'bg-[#111827] text-white shadow-xs' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Duties List */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-[#E5DFD3] text-center space-y-2 shadow-xs">
                <Car className="w-8 h-8 text-gray-400 mx-auto" />
                <h5 className="text-xs font-black text-[#111827]">No assigned duties</h5>
                <p className="text-[11px] text-gray-500 font-semibold">
                  This driver does not have any {dutyFilter !== 'All' ? dutyFilter.toLowerCase() : ''} trips logged yet.
                </p>
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
                      {/* Top Bar: Trip ID, Vehicle & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs text-[#111827] group-hover:text-blue-600">
                            {trip.id}
                          </span>
                          <span className="text-[10px] bg-blue-50 text-blue-900 font-black px-2 py-0.5 rounded-full border border-blue-200">
                            🚘 {trip.vehiclePlate?.split(' ')[0] || 'Assigned Car'}
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

                      {/* Passenger & Bata Allowance Row */}
                      <div className="flex items-center justify-between text-[11px] text-[#4B5563] pt-1 border-t border-gray-100 font-semibold">
                        <div className="flex items-center gap-2 truncate">
                          <span>👤 {trip.customerName || 'Passenger'}</span>
                          <span>•</span>
                          <span>📅 {new Date(trip.startDateTime || trip.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-800 block">
                            Bata: {formatCurrency(trip.driverBata || 400)}
                          </span>
                        </div>
                      </div>

                      {/* View details prompt */}
                      <div className="flex items-center justify-between pt-1 border-t border-dashed border-gray-200 text-[11px]">
                        <span className="text-[#EA580C] font-black group-hover:underline flex items-center gap-0.5">
                          <span>Inspect Trip Duty Slip</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>

                        <span className="text-gray-500 font-mono text-[10px]">
                          {trip.actualKm || trip.estimatedKm || 150} KM
                        </span>
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

          <a
            href={`tel:${driver.phone}`}
            className="px-5 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-md tap-active"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4F05B]" />
            <span>Call Driver Now</span>
          </a>
        </div>
      </div>
    </div>
  );
};
