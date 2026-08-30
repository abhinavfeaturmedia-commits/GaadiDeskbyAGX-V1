import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Fuel,
  Users,
  Gauge,
  Search,
  CheckCircle2,
  X,
  Clock,
  Filter
} from 'lucide-react';

export const FleetManager = () => {
  const {
    t,
    vehicles,
    addVehicle,
    checkVehicleClash,
    isNewVehicleOpen,
    setIsNewVehicleOpen
  } = useApp();

  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedVehicleForCheck, setSelectedVehicleForCheck] = useState(null);
  const [checkDate, setCheckDate] = useState(new Date().toISOString().slice(0, 10));
  const [checkStartTime, setCheckStartTime] = useState('09:00');
  const [checkEndTime, setCheckEndTime] = useState('20:00');
  const [clashResult, setClashResult] = useState(null);

  // New Vehicle Form State
  const [newVehicleForm, setNewVehicleForm] = useState({
    plate: '',
    brand: '',
    model: '',
    category: 'Sedan',
    fuel: 'Diesel',
    seats: 4,
    ownership: 'Own',
    odometer: 0,
    rcExpiry: '2030-01-01',
    insuranceExpiry: '2027-01-01',
    pucExpiry: '2027-01-01',
    fitnessExpiry: '2027-01-01',
    permitExpiry: '2027-01-01',
  });

  const categories = ['All', 'Sedan', 'MUV', 'SUV', 'Hatchback', 'Luxury'];

  const filteredVehicles = vehicles.filter(v => {
    return filterCategory === 'All' || v.category === filterCategory;
  });

  const handleClashCheck = () => {
    if (!selectedVehicleForCheck) return;
    const startStr = `${checkDate}T${checkStartTime}`;
    const endStr = `${checkDate}T${checkEndTime}`;
    const clash = checkVehicleClash(selectedVehicleForCheck.id, startStr, endStr);

    if (clash) {
      setClashResult({
        isAvailable: false,
        message: `❌ Booked for ${clash.customerName} (${clash.tripType}) from ${new Date(clash.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(clash.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
    } else {
      setClashResult({
        isAvailable: true,
        message: `✅ Car is 100% Free on ${checkDate} between ${checkStartTime} and ${checkEndTime}!`
      });
    }
  };

  const handleAddVehicleSubmit = (e) => {
    e.preventDefault();
    if (!newVehicleForm.plate || !newVehicleForm.model) {
      alert("Please enter number plate and model.");
      return;
    }

    addVehicle({
      ...newVehicleForm,
      documents: {
        rcExpiry: newVehicleForm.rcExpiry,
        insuranceExpiry: newVehicleForm.insuranceExpiry,
        pucExpiry: newVehicleForm.pucExpiry,
        fitnessExpiry: newVehicleForm.fitnessExpiry,
        permitExpiry: newVehicleForm.permitExpiry,
      }
    });

    setIsNewVehicleOpen(false);
    setNewVehicleForm({
      plate: '',
      brand: '',
      model: '',
      category: 'Sedan',
      fuel: 'Diesel',
      seats: 4,
      ownership: 'Own',
      odometer: 0,
      rcExpiry: '2030-01-01',
      insuranceExpiry: '2027-01-01',
      pucExpiry: '2027-01-01',
      fitnessExpiry: '2027-01-01',
      permitExpiry: '2027-01-01',
    });
  };

  return (
    <div className="space-y-4 pt-1 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E232A]">{t('tileFleet')}</h2>
          <p className="text-xs text-text-secondary font-medium">
            {vehicles.length} active vehicles in your fleet
          </p>
        </div>
        <button
          onClick={() => setIsNewVehicleOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#111827] text-white text-xs font-black flex items-center gap-1 shadow-sm tap-active"
        >
          <Plus className="w-4 h-4 text-[#D4F05B]" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => {
          const isActive = filterCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all tap-active ${
                isActive
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white border-2 border-[#E5DFD3] text-[#374151] hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Vehicle Grid */}
      <div className="space-y-3">
        {filteredVehicles.map(veh => {
          const isFree = veh.status === 'Free';
          const isOnTrip = veh.status === 'On Trip';
          const isWorkshop = veh.status === 'Workshop';

          return (
            <div
              key={veh.id}
              className="bg-white rounded-3xl p-4 border border-card-border shadow-soft space-y-3 hover:shadow-soft-lg transition-all"
            >
              {/* Top Row: Plate + Status Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-extrabold text-[#1E232A] tracking-wider">
                    {veh.plate}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {veh.ownership}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    isFree
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : isOnTrip
                      ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {veh.status}
                </span>
              </div>

              {/* Model & Specs */}
              <div>
                <h4 className="text-base font-extrabold text-[#1E232A]">
                  {veh.brand} {veh.model}
                </h4>
                <div className="flex items-center space-x-3 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-accent-amber" />
                    <span>{veh.fuel}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-sky-600" />
                    <span>{veh.seats} Seats</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-gray-600" />
                    <span>{veh.odometer?.toLocaleString()} KM</span>
                  </span>
                </div>
              </div>

              {/* Document Compliance Pills */}
              <div className="bg-[#FBF8F2] rounded-2xl p-2.5 border border-card-border space-y-1 text-[11px]">
                <div className="flex items-center justify-between font-semibold text-gray-800">
                  <span className="text-text-secondary">Insurance Expiry:</span>
                  <span className="font-bold">{veh.documents?.insuranceExpiry}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-gray-800">
                  <span className="text-text-secondary">PUC Expiry:</span>
                  <span className="font-bold">{veh.documents?.pucExpiry}</span>
                </div>
              </div>

              {/* Action: Check Free Slot */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setSelectedVehicleForCheck(veh);
                    setClashResult(null);
                  }}
                  className="w-full py-2 rounded-full bg-white border border-card-border text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-gray-50 tap-active shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-accent-amber" />
                  <span>{t('btnCheckFree')}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Date Clash Checker Modal */}
      {selectedVehicleForCheck && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-[380px] w-full p-5 shadow-2xl border border-card-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">
                🔍 Check Availability Slot
              </h3>
              <button
                onClick={() => setSelectedVehicleForCheck(null)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Vehicle: <b>{selectedVehicleForCheck.plate}</b> ({selectedVehicleForCheck.brand} {selectedVehicleForCheck.model})
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={e => setCheckDate(e.target.value)}
                  className="w-full bg-[#FBF8F2] border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={checkStartTime}
                    onChange={e => setCheckStartTime(e.target.value)}
                    className="w-full bg-[#FBF8F2] border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={checkEndTime}
                    onChange={e => setCheckEndTime(e.target.value)}
                    className="w-full bg-[#FBF8F2] border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleClashCheck}
                className="w-full py-2.5 rounded-full bg-accent-amber text-white text-xs font-extrabold shadow-glow-amber hover:bg-amber-600 tap-active"
              >
                Check Slot
              </button>

              {clashResult && (
                <div
                  className={`p-3 rounded-2xl text-xs font-bold ${
                    clashResult.isAvailable
                      ? 'bg-green-50 text-green-900 border border-green-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  {clashResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Vehicle Modal */}
      {isNewVehicleOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#FBF8F2] rounded-4xl max-w-[420px] w-full max-h-[90vh] flex flex-col shadow-2xl border border-card-border overflow-hidden">
            <div className="bg-white px-5 py-4 border-b border-card-border flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900">
                {t('btnAddNewCar')}
              </h3>
              <button
                onClick={() => setIsNewVehicleOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  Number Plate (e.g. MH 12 AB 1234) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="MH 12 AB 1234"
                  value={newVehicleForm.plate}
                  onChange={e => setNewVehicleForm(prev => ({ ...prev, plate: e.target.value.toUpperCase() }))}
                  className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Brand (e.g. Maruti)
                  </label>
                  <input
                    type="text"
                    placeholder="Maruti Suzuki"
                    value={newVehicleForm.brand}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Model (e.g. Dzire) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dzire VXi"
                    value={newVehicleForm.model}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newVehicleForm.category}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="MUV">MUV (Innova/Ertiga)</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Tempo">Tempo Traveller</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Fuel
                  </label>
                  <select
                    value={newVehicleForm.fuel}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, fuel: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Petrol">Petrol</option>
                    <option value="EV">Electric (EV)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newVehicleForm.insuranceExpiry}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    PUC Expiry Date
                  </label>
                  <input
                    type="date"
                    value={newVehicleForm.pucExpiry}
                    onChange={e => setNewVehicleForm(prev => ({ ...prev, pucExpiry: e.target.value }))}
                    className="w-full bg-white border border-card-border rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-accent-amber text-white text-xs font-extrabold shadow-glow-amber hover:bg-amber-600 tap-active"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
