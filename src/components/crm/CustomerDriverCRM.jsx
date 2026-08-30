import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  Plus,
  Phone,
  MessageSquare,
  Building,
  CreditCard,
  X,
  Search,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const CustomerDriverCRM = () => {
  const {
    t,
    customers,
    drivers,
    addCustomer,
    addDriver,
    formatCurrency,
    openNewBookingWithPrefill,
    setCustomerSettlementData,
    setRenewalModalData,
    setWhatsAppData
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('customers'); // 'customers' | 'drivers'
  const [search, setSearch] = useState('');
  const [isAddCustModal, setIsAddCustModal] = useState(false);
  const [isAddDrvModal, setIsAddDrvModal] = useState(false);

  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: '',
    phone: '',
    type: 'Personal',
    gstin: '',
    notes: '',
    address: ''
  });

  // New Driver Form State
  const [newDrv, setNewDrv] = useState({
    name: '',
    phone: '',
    dlNumber: '',
    dlExpiry: '2028-01-01',
    payoutType: 'Salary',
    monthlySalary: 18000,
    emergencyContact: ''
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const filteredDrivers = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search)
  );

  const handleAddCustSubmit = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;
    addCustomer(newCust);
    setIsAddCustModal(false);
    setNewCust({ name: '', phone: '', type: 'Personal', gstin: '', notes: '', address: '' });
  };

  const handleAddDrvSubmit = (e) => {
    e.preventDefault();
    if (!newDrv.name || !newDrv.phone) return;
    addDriver(newDrv);
    setIsAddDrvModal(false);
    setNewDrv({ name: '', phone: '', dlNumber: '', dlExpiry: '2028-01-01', payoutType: 'Salary', monthlySalary: 18000, emergencyContact: '' });
  };

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#111827]">
            {activeSubTab === 'customers' ? t('tileCustomers') : 'Driver Directory'}
          </h2>
          <p className="text-xs text-[#4B5563] font-semibold">
            {activeSubTab === 'customers' ? `${customers.length} registered parties & clients` : `${drivers.length} registered drivers`}
          </p>
        </div>
        <button
          onClick={() => {
            if (activeSubTab === 'customers') setIsAddCustModal(true);
            else setIsAddDrvModal(true);
          }}
          className="px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-xs font-black flex items-center gap-1 shadow-sm hover:bg-black tap-active"
        >
          <Plus className="w-4 h-4 text-[#D4F05B]" />
          <span>{activeSubTab === 'customers' ? 'Add Party' : 'Add Driver'}</span>
        </button>
      </div>

      {/* Sub-Tab Switcher & Search */}
      <div className="flex items-center space-x-2">
        <div className="flex bg-white p-1 rounded-full border-2 border-[#E5DFD3] shadow-xs">
          <button
            onClick={() => setActiveSubTab('customers')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
              activeSubTab === 'customers' ? 'bg-[#111827] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setActiveSubTab('drivers')}
            className={`px-3 py-1 rounded-full text-xs font-black transition-all ${
              activeSubTab === 'drivers' ? 'bg-[#111827] text-white shadow-xs' : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            🚖 Drivers
          </button>
        </div>

        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border-2 border-[#E5DFD3] rounded-full pl-8 pr-3 py-1.5 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>
      </div>

      {/* CUSTOMERS DIRECTORY */}
      {activeSubTab === 'customers' && (
        <div className="space-y-3">
          {filteredCustomers.map(cust => (
            <div
              key={cust.id}
              className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs">
                    {cust.type === 'Corporate' ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#111827]">{cust.name}</h3>
                    <p className="text-[11px] text-[#4B5563] font-semibold">
                      {cust.phone} • {cust.type}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#4B5563] block font-semibold">Pending Due</span>
                  <span className={`text-xs font-black ${cust.pendingBalance > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {formatCurrency(cust.pendingBalance)}
                  </span>
                </div>
              </div>

              {cust.address && (
                <p className="text-[11px] text-[#4B5563] bg-[#F8F6F0] p-2 rounded-xl border border-[#E5DFD3]">
                  📍 {cust.address} {cust.gstin ? `• GSTIN: ${cust.gstin}` : ''}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
                <button
                  onClick={() => openNewBookingWithPrefill({ customerName: cust.name, customerPhone: cust.phone, pickupLocation: cust.address })}
                  className="flex-1 py-1.5 rounded-full bg-[#111827] hover:bg-black text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs tap-active"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4F05B]" />
                  <span>Book Trip</span>
                </button>

                {cust.pendingBalance > 0 ? (
                  <button
                    onClick={() => setCustomerSettlementData(cust)}
                    className="flex-1 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow-xs tap-active"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Settle Due</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setWhatsAppData({ type: 'booking', booking: { customerName: cust.name, customerPhone: cust.phone, pickupLocation: cust.address, id: 'ENQUIRY' } })}
                    className="p-1.5 rounded-full bg-gray-100 text-[#111827] hover:bg-gray-200 tap-active"
                    title="WhatsApp Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DRIVERS DIRECTORY */}
      {activeSubTab === 'drivers' && (
        <div className="space-y-3">
          {filteredDrivers.map(drv => (
            <div
              key={drv.id}
              className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[#111827]">{drv.name}</h3>
                    <p className="text-[11px] text-[#4B5563] font-semibold">
                      {drv.phone}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                  drv.status === 'On Trip' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-800 border-gray-300'
                }`}>
                  {drv.status}
                </span>
              </div>

              <div className="bg-[#F8F6F0] p-2.5 rounded-2xl border border-[#E5DFD3] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#4B5563] font-bold block">License Expiry</span>
                  <span className="font-bold text-[#111827]">📅 {drv.dlExpiry || '2028-01-01'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#4B5563] font-bold block">Salary / Scheme</span>
                  <span className="font-black text-[#111827]">₹{drv.monthlySalary || 18000}/mo</span>
                </div>
              </div>

              {/* Driver Actions */}
              <div className="flex items-center space-x-2 pt-1 border-t border-gray-100">
                <button
                  onClick={() => setRenewalModalData({ driverId: drv.id, docType: 'Driver License', driverName: drv.name, currentExpiry: drv.dlExpiry })}
                  className="flex-1 py-1.5 rounded-full bg-white border-2 border-[#E5DFD3] text-[#111827] text-[11px] font-black flex items-center justify-center gap-1 hover:bg-gray-50 tap-active shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Update DL</span>
                </button>

                <a
                  href={`tel:${drv.phone}`}
                  className="px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-[11px] font-black flex items-center gap-1 shadow-xs hover:bg-black tap-active"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4F05B]" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#111827]">Add New Party / Customer</h3>
              <button onClick={() => setIsAddCustModal(false)} className="text-[#4B5563] hover:text-[#111827]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Customer / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Deshmukh / Tata Motors"
                  value={newCust.name}
                  onChange={e => setNewCust(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9822012345"
                  value={newCust.phone}
                  onChange={e => setNewCust(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Party Type</label>
                <select
                  value={newCust.type}
                  onChange={e => setNewCust(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="Personal">Personal / Retail Client</option>
                  <option value="Corporate">Corporate / B2B Client</option>
                  <option value="Hotel / Partner">Hotel / Agent Partner</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Address / City</label>
                <input
                  type="text"
                  placeholder="e.g. Hinjewadi Phase 1, Pune"
                  value={newCust.address}
                  onChange={e => setNewCust(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustModal(false)}
                  className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] text-xs font-black text-[#4B5563] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {isAddDrvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#F8F6F0] rounded-4xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#E5DFD3] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#111827]">Register New Driver</h3>
              <button onClick={() => setIsAddDrvModal(false)} className="text-[#4B5563] hover:text-[#111827]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDrvSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Driver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Shinde"
                  value={newDrv.name}
                  onChange={e => setNewDrv(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9822012345"
                  value={newDrv.phone}
                  onChange={e => setNewDrv(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">License Expiry Date</label>
                <input
                  type="date"
                  value={newDrv.dlExpiry}
                  onChange={e => setNewDrv(prev => ({ ...prev, dlExpiry: e.target.value }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111827] block mb-1">Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={newDrv.monthlySalary}
                  onChange={e => setNewDrv(prev => ({ ...prev, monthlySalary: Number(e.target.value) }))}
                  className="w-full bg-white border-2 border-[#E5DFD3] rounded-2xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddDrvModal(false)}
                  className="flex-1 py-2.5 rounded-full border-2 border-[#E5DFD3] text-xs font-black text-[#4B5563] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black shadow-md hover:bg-black"
                >
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
