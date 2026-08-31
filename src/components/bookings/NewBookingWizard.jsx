import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  Phone,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Wand2,
  Plus,
  Trash2,
  ClipboardList
} from 'lucide-react';

export const NewBookingWizard = ({ onClose }) => {
  const {
    t,
    vehicles,
    drivers,
    customers,
    rateCards,
    checkBookingClash,
    saveBooking,
    formatCurrency,
    setWhatsAppData,
    newBookingPrefill,
    setNewBookingPrefill,
    parseWhatsAppBookingText,
    setInspectionModalBooking
  } = useApp();

  const [step, setStep] = useState(1);
  const [showParserDrawer, setShowParserDrawer] = useState(false);
  const [rawWhatsAppText, setRawWhatsAppText] = useState('');
  const [parserSuccess, setParserSuccess] = useState(false);

  // Day-wise itinerary state for multi-day tours
  const [showItinerary, setShowItinerary] = useState(false);
  const [itineraryDays, setItineraryDays] = useState([
    { day: 1, from: 'Pune', to: 'Mahabaleshwar', notes: 'Morning pickup & hotel transfer' },
    { day: 2, from: 'Mahabaleshwar', to: 'Pratapgad & Viewpoints', notes: 'Full day sightseeing' },
    { day: 3, from: 'Mahabaleshwar', to: 'Pune', notes: 'Evening return drop' }
  ]);

  // Form State with prefill support
  const [formData, setFormData] = useState({
    tripType: newBookingPrefill?.tripType || 'Outstation',
    isRoundTrip: true,
    pickupLocation: newBookingPrefill?.pickupLocation || '',
    dropLocation: newBookingPrefill?.dropLocation || '',
    startDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    customerName: newBookingPrefill?.customerName || '',
    customerPhone: newBookingPrefill?.customerPhone || '',
    vehicleId: newBookingPrefill?.vehicleId || '',
    driverId: '',
    estimatedKm: 300,
    ratePerKm: 14,
    baseFare: 4200,
    driverBata: 400,
    nightHalt: 300,
    tollParking: 350,
    discount: 0,
    gstEnabled: true,
    gstPercent: 5,
    advancePaid: 1500,
    advanceMode: 'UPI',
    notes: '',
    securityDeposit: 5000,
    fuelPolicy: 'Same to Same',
    customerAadhaarOrDl: ''
  });

  const [clashError, setClashError] = useState(null);

  // Clear prefill on unmount
  useEffect(() => {
    return () => {
      if (newBookingPrefill) setNewBookingPrefill(null);
    };
  }, []);

  // Auto-fill from rate cards when trip type OR vehicle changes
  useEffect(() => {
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    const category = selectedVehicle?.category || 'Sedan';

    // Find rate card matching both tripType and category, or fallback to tripType
    const matchingRc = rateCards.find(r => r.tripType === formData.tripType && r.category === category)
      || rateCards.find(r => r.tripType === formData.tripType)
      || rateCards[0];

    if (matchingRc) {
      if (formData.tripType === 'Local' || formData.tripType === 'Airport') {
        setFormData(prev => ({
          ...prev,
          baseFare: matchingRc.basePrice || 1800,
          ratePerKm: matchingRc.extraKmRate || 14,
          driverBata: 0,
          nightHalt: 0,
          gstPercent: matchingRc.defaultGstPercent || 5
        }));
      } else if (formData.tripType === 'Outstation') {
        setFormData(prev => ({
          ...prev,
          ratePerKm: matchingRc.perKmRate || 14,
          driverBata: matchingRc.driverBata || 400,
          nightHalt: matchingRc.nightHalt || 300,
          baseFare: (matchingRc.perKmRate || 14) * (prev.estimatedKm || 250),
          gstPercent: matchingRc.defaultGstPercent || 5
        }));
      } else if (formData.tripType === 'Rental') {
        setFormData(prev => ({
          ...prev,
          baseFare: matchingRc.basePrice || 2000,
          ratePerKm: matchingRc.extraKmRate || 10,
          securityDeposit: matchingRc.securityDeposit || 5000,
          fuelPolicy: matchingRc.fuelPolicy || 'Same to Same',
          driverBata: 0,
          nightHalt: 0,
          gstPercent: matchingRc.defaultGstPercent || 5
        }));
      }
    }
  }, [formData.tripType, formData.vehicleId, rateCards, vehicles]);

  // Recalculate Totals
  const calculateTotals = () => {
    const kmFare = formData.tripType === 'Outstation'
      ? Number(formData.estimatedKm || 0) * Number(formData.ratePerKm || 0)
      : Number(formData.baseFare || 0);

    const subTotal = kmFare + Number(formData.driverBata || 0) + Number(formData.nightHalt || 0) + Number(formData.tollParking || 0);
    const discounted = Math.max(0, subTotal - Number(formData.discount || 0));
    const taxableAmount = discounted;
    const gstAmount = formData.gstEnabled ? Math.round(taxableAmount * ((formData.gstPercent || 5) / 100)) : 0;
    const totalFare = taxableAmount + gstAmount;
    const balancePending = Math.max(0, totalFare - Number(formData.advancePaid || 0));

    return { taxableAmount, gstAmount, totalFare, balancePending };
  };

  const { taxableAmount, gstAmount, totalFare, balancePending } = calculateTotals();

  // Clash Check when vehicle or driver or dates change
  const runClashCheck = (vId, dId, start, end) => {
    const { vehicleConflict, driverConflict } = checkBookingClash(vId, dId, start, end, null, formData.tripType);
    
    if (vehicleConflict || driverConflict) {
      setClashError({
        vehicle: vehicleConflict ? {
          plate: vehicleConflict.vehiclePlate,
          start: new Date(vehicleConflict.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          end: new Date(vehicleConflict.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          bookingId: vehicleConflict.id
        } : null,
        driver: driverConflict ? {
          driverName: driverConflict.driverName,
          start: new Date(driverConflict.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          end: new Date(driverConflict.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
          bookingId: driverConflict.id
        } : null
      });
    } else {
      setClashError(null);
    }
  };

  const handleVehicleSelect = (vId) => {
    setFormData(prev => ({ ...prev, vehicleId: vId }));
    runClashCheck(vId, formData.driverId, formData.startDateTime, formData.endDateTime);
  };

  const handleDriverSelect = (dId) => {
    setFormData(prev => ({ ...prev, driverId: dId }));
    runClashCheck(formData.vehicleId, dId, formData.startDateTime, formData.endDateTime);
  };

  // Submit Booking
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customerName || !formData.pickupLocation || !formData.vehicleId) {
      alert("Please fill in customer name, pickup location, and select a car.");
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    const selectedDriver = drivers.find(d => d.id === formData.driverId);

    const newBookingData = {
      ...formData,
      vehiclePlate: selectedVehicle ? `${selectedVehicle.plate} (${selectedVehicle.brand} ${selectedVehicle.model})` : '',
      driverName: selectedDriver ? selectedDriver.name : 'Driver Assigned Soon',
      driverPhone: selectedDriver ? selectedDriver.phone : '',
      taxableAmount,
      gstAmount,
      totalFare,
      balancePending,
      status: formData.driverId ? 'Driver Assigned' : 'Confirmed'
    };

    const saved = saveBooking(newBookingData);
    onClose();
    // Open formatted WhatsApp modal
    setWhatsAppData({ type: 'booking', booking: saved });
  };

  const tripTypes = [
    { id: 'Outstation', label: t('tripTypeOutstationRound'), icon: '🛣️' },
    { id: 'Local', label: t('tripTypeLocal'), icon: '🏙️' },
    { id: 'Airport', label: t('tripTypeAirport'), icon: '✈️' },
    { id: 'Rental', label: t('tripTypeRental'), icon: '🔑' },
    { id: 'Tour', label: t('tripTypeTour'), icon: '🌄' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-[#F8F6F0] rounded-4xl max-w-[440px] w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#E5DFD3] overflow-hidden">
        {/* Header */}
        <div className="bg-white px-5 py-4 border-b border-[#E5DFD3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center text-xs font-black">
              {step}/4
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111827]">
                {step === 1 && t('step1Title')}
                {step === 2 && t('step2Title')}
                {step === 3 && t('step3Title')}
                {step === 4 && t('step4Title')}
              </h3>
              <p className="text-[11px] text-[#4B5563] font-semibold">4-Step Fleet Dispatch Wizard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#111827] hover:bg-gray-200 tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {/* STEP 1: TRIP TYPE & CUSTOMER */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Quick WhatsApp Text Parser Drawer */}
              <div className="bg-white rounded-3xl p-3.5 border-2 border-[#E5DFD3] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#111827]">
                    <Wand2 className="w-4 h-4 text-[#EA580C]" />
                    <span>Paste WhatsApp Inquiry</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowParserDrawer(!showParserDrawer)}
                    className="text-[11px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full tap-active"
                  >
                    {showParserDrawer ? 'Hide Parser' : '⚡ Quick Auto-Fill'}
                  </button>
                </div>

                {showParserDrawer && (
                  <div className="space-y-2 pt-1 border-t border-[#E5DFD3] animate-fade-in">
                    <textarea
                      rows="3"
                      placeholder="Paste WhatsApp text message... e.g. 'Pune to Shirdi Innova 2 days, 15 Oct, guest Dr. Deshmukh 9881234567, rate 12500'"
                      value={rawWhatsAppText}
                      onChange={e => setRawWhatsAppText(e.target.value)}
                      className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-2xl p-2.5 text-xs font-medium text-[#111827] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const parsed = parseWhatsAppBookingText(rawWhatsAppText);
                        if (parsed) {
                          setFormData(prev => ({
                            ...prev,
                            customerName: parsed.customerName || prev.customerName,
                            customerPhone: parsed.customerPhone || prev.customerPhone,
                            pickupLocation: parsed.pickupLocation || prev.pickupLocation,
                            dropLocation: parsed.dropLocation || prev.dropLocation,
                            tripType: parsed.tripType || prev.tripType,
                            baseFare: parsed.baseFare || prev.baseFare,
                            startDateTime: parsed.startDateTime || prev.startDateTime,
                            endDateTime: parsed.endDateTime || prev.endDateTime,
                            notes: parsed.notes || prev.notes
                          }));
                          setParserSuccess(true);
                          setTimeout(() => {
                            setParserSuccess(false);
                            setShowParserDrawer(false);
                          }, 1200);
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-[#111827] text-white text-xs font-black flex items-center justify-center gap-1.5 tap-active shadow-xs"
                    >
                      {parserSuccess ? <Check className="w-3.5 h-3.5 text-[#D4F05B]" /> : <Sparkles className="w-3.5 h-3.5 text-[#D4F05B]" />}
                      <span>{parserSuccess ? 'Booking Details Auto-Filled!' : 'Parse & Auto-Fill Form'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-[#111827] uppercase tracking-wider block mb-2">
                  Select Trip Category
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {tripTypes.map(tt => (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, tripType: tt.id }))}
                      className={`p-3 rounded-2xl border-2 text-left flex items-center space-x-2.5 transition-all tap-active ${
                        formData.tripType === tt.id
                          ? 'bg-[#111827] border-[#111827] text-white font-black shadow-xs'
                          : 'bg-white border-[#E5DFD3] text-[#374151] hover:bg-gray-50 font-bold'
                      }`}
                    >
                      <span className="text-xl">{tt.icon}</span>
                      <span className="text-xs">{tt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Customer Information
                </h4>
                <div>
                  <label className="text-[11px] font-bold text-[#111827] block mb-1">
                    {t('customerName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Aniket Deshmukh"
                    value={formData.customerName}
                    onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#111827] block mb-1">
                    {t('customerPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822012345"
                    value={formData.customerPhone}
                    onChange={e => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ROUTE & TIMING */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Route & Destination
                </h4>

                <div>
                  <label className="text-[11px] font-bold text-[#111827] block mb-1">
                    {t('pickupLocation')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swargate, Pune / Airport Terminal 2"
                    value={formData.pickupLocation}
                    onChange={e => setFormData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#111827] block mb-1">
                    {t('dropLocation')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shirdi Temple / Mahabaleshwar"
                    value={formData.dropLocation}
                    onChange={e => setFormData(prev => ({ ...prev, dropLocation: e.target.value }))}
                    className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Schedule Dates & Times
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startDateTime}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, startDateTime: e.target.value }));
                        runClashCheck(formData.vehicleId, formData.driverId, e.target.value, formData.endDateTime);
                      }}
                      className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-xl px-2 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Return / End Time *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.endDateTime}
                      onChange={e => {
                        setFormData(prev => ({ ...prev, endDateTime: e.target.value }));
                        runClashCheck(formData.vehicleId, formData.driverId, formData.startDateTime, e.target.value);
                      }}
                      className="w-full bg-[#F8F6F0] border border-[#E5DFD3] rounded-xl px-2 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Multi-Day Outstation Tour Itinerary Planner */}
              {(formData.tripType === 'Outstation' || formData.tripType === 'Tour') && (
                <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-[#EA580C]" />
                      <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                        Multi-Day Tour Itinerary
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowItinerary(!showItinerary)}
                      className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 tap-active"
                    >
                      {showItinerary ? 'Hide Itinerary' : `+ ${itineraryDays.length} Days Stops`}
                    </button>
                  </div>

                  {showItinerary && (
                    <div className="space-y-2 pt-1 border-t border-[#E5DFD3] animate-fade-in">
                      {itineraryDays.map((it, idx) => (
                        <div key={idx} className="p-2.5 bg-[#F8F6F0] rounded-2xl border border-[#E5DFD3] space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-black text-[#111827]">
                            <span>Day {it.day}: {it.from} ➔ {it.to}</span>
                            {itineraryDays.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setItineraryDays(prev => prev.filter((_, i) => i !== idx))}
                                className="text-rose-600 hover:text-rose-800"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              type="text"
                              value={it.from}
                              onChange={e => {
                                const val = e.target.value;
                                setItineraryDays(prev => prev.map((item, i) => i === idx ? { ...item, from: val } : item));
                              }}
                              placeholder="From"
                              className="bg-white border border-[#E5DFD3] rounded-lg px-2 py-1 text-[10px] font-semibold"
                            />
                            <input
                              type="text"
                              value={it.to}
                              onChange={e => {
                                const val = e.target.value;
                                setItineraryDays(prev => prev.map((item, i) => i === idx ? { ...item, to: val } : item));
                              }}
                              placeholder="To"
                              className="bg-white border border-[#E5DFD3] rounded-lg px-2 py-1 text-[10px] font-semibold"
                            />
                          </div>
                          <input
                            type="text"
                            value={it.notes}
                            onChange={e => {
                              const val = e.target.value;
                              setItineraryDays(prev => prev.map((item, i) => i === idx ? { ...item, notes: val } : item));
                            }}
                            placeholder="Sightseeing / Hotel note"
                            className="w-full bg-white border border-[#E5DFD3] rounded-lg px-2 py-1 text-[10px]"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const nextDay = itineraryDays.length + 1;
                          const lastTo = itineraryDays[itineraryDays.length - 1]?.to || 'Destination';
                          setItineraryDays(prev => [
                            ...prev,
                            { day: nextDay, from: lastTo, to: formData.dropLocation || 'Next City', notes: 'Sightseeing / Transfer' }
                          ]);
                          setFormData(prev => ({
                            ...prev,
                            driverBata: nextDay * 400,
                            nightHalt: (nextDay - 1) * 300,
                            estimatedKm: Math.max(prev.estimatedKm, nextDay * 250)
                          }));
                        }}
                        className="w-full py-1.5 rounded-xl bg-white border border-dashed border-[#111827] text-[#111827] text-[11px] font-black flex items-center justify-center gap-1 hover:bg-gray-50 tap-active"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Next Day Stop</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CAR & DRIVER WITH CLASH ENGINE */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Dual Clash Alert Banner if any conflict */}
              {clashError && (
                <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-3.5 space-y-2 text-rose-950 shadow-xs animate-shake">
                  <div className="flex items-center space-x-2 font-black text-xs">
                    <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>Double Booking Collision Warning!</span>
                  </div>
                  {clashError.vehicle && (
                    <p className="text-[11px] font-bold bg-white/80 p-2 rounded-xl border border-rose-200">
                      🚗 Car <b>{clashError.vehicle.plate}</b> is already booked for trip <b>{clashError.vehicle.bookingId}</b> ({clashError.vehicle.start} to {clashError.vehicle.end}).
                    </p>
                  )}
                  {clashError.driver && (
                    <p className="text-[11px] font-bold bg-white/80 p-2 rounded-xl border border-rose-200">
                      👤 Driver <b>{clashError.driver.driverName}</b> is already on trip <b>{clashError.driver.bookingId}</b> ({clashError.driver.start} to {clashError.driver.end}).
                    </p>
                  )}
                </div>
              )}

              {/* Vehicle Picker */}
              <div>
                <label className="text-xs font-black text-[#111827] uppercase tracking-wider block mb-2">
                  Select Vehicle *
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                  {vehicles.map(v => (
                    <div
                      key={v.id}
                      onClick={() => handleVehicleSelect(v.id)}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all tap-active ${
                        formData.vehicleId === v.id
                          ? 'bg-[#111827] border-[#111827] text-white shadow-xs'
                          : 'bg-white border-[#E5DFD3] hover:bg-gray-50 text-[#111827]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-xl">🚗</span>
                        <div>
                          <p className="text-xs font-black">{v.plate}</p>
                          <p className={`text-[10px] ${formData.vehicleId === v.id ? 'text-white/80' : 'text-[#4B5563]'}`}>
                            {v.brand} {v.model} • {v.fuel} ({v.seats} Seater)
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        formData.vehicleId === v.id ? 'bg-[#D4F05B] text-[#111827]' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Picker */}
              <div>
                <label className="text-xs font-black text-[#111827] uppercase tracking-wider block mb-2">
                  Assign Driver (Optional)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {drivers.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleDriverSelect(d.id)}
                      className={`p-2.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all tap-active ${
                        formData.driverId === d.id
                          ? 'bg-[#111827] border-[#111827] text-white shadow-xs'
                          : 'bg-white border-[#E5DFD3] hover:bg-gray-50 text-[#111827]'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="text-xs font-black">{d.name}</p>
                          <p className={`text-[10px] ${formData.driverId === d.id ? 'text-white/80' : 'text-[#4B5563]'}`}>
                            {d.phone} • DL: {d.dlExpiry}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold ${formData.driverId === d.id ? 'text-white' : 'text-[#4B5563]'}`}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental 6-Point Inspection Checklist Trigger */}
              {formData.tripType === 'Rental' && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between shadow-xs">
                  <div>
                    <span className="text-[11px] font-black text-amber-950 block">Vehicle Inspection Protocol</span>
                    <span className="text-[10px] text-amber-800">Record scratch & fuel condition before key handover</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInspectionModalBooking({ id: 'NEW_RENTAL', vehicleId: formData.vehicleId, vehiclePlate: 'Rental Car' })}
                    className="px-3 py-1.5 rounded-full bg-[#111827] text-white text-[10px] font-black tap-active shadow-xs"
                  >
                    📷 6-Pt Check
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: RATES, GST & ADVANCE */}
          {step === 4 && (
            <div className="space-y-3.5">
              <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Pricing & Distance
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Estimated KM
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedKm}
                      onChange={e => setFormData(prev => ({ ...prev, estimatedKm: Number(e.target.value) }))}
                      className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Rate / KM (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.ratePerKm}
                      onChange={e => setFormData(prev => ({ ...prev, ratePerKm: Number(e.target.value) }))}
                      className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Self-Drive Rental Specifics (if Rental) */}
              {formData.tripType === 'Rental' && (
                <div className="bg-amber-50 rounded-3xl p-4 border-2 border-amber-300 space-y-3 shadow-xs">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1">
                    <span>🔑 Self-Drive Rental Terms</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">
                        Security Deposit (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.securityDeposit}
                        onChange={e => setFormData(prev => ({ ...prev, securityDeposit: Number(e.target.value) }))}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-amber-900 block mb-1">
                        Fuel Policy
                      </label>
                      <select
                        value={formData.fuelPolicy}
                        onChange={e => setFormData(prev => ({ ...prev, fuelPolicy: e.target.value }))}
                        className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none"
                      >
                        <option value="Same to Same">Same to Same</option>
                        <option value="Full to Full">Full to Full</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-900 block mb-1">
                      Customer Driving License / Aadhaar No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MH12 20180091283"
                      value={formData.customerAadhaarOrDl}
                      onChange={e => setFormData(prev => ({ ...prev, customerAadhaarOrDl: e.target.value }))}
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Advance & Payment Settlement */}
              <div className="bg-white rounded-3xl p-4 border-2 border-[#E5DFD3] space-y-3 shadow-xs">
                <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider">
                  Advance & Payment Mode
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Advance Received (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.advancePaid}
                      onChange={e => setFormData(prev => ({ ...prev, advancePaid: Number(e.target.value) }))}
                      className="w-full bg-[#F8F6F0] border-2 border-emerald-400 rounded-xl px-3 py-2 text-xs font-mono font-black text-emerald-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#4B5563] block mb-1">
                      Advance Payment Mode
                    </label>
                    <select
                      value={formData.advanceMode}
                      onChange={e => setFormData(prev => ({ ...prev, advanceMode: e.target.value }))}
                      className="w-full bg-[#F8F6F0] border-2 border-[#E5DFD3] rounded-xl px-3 py-2 text-xs font-bold text-[#111827] focus:outline-none"
                    >
                      <option value="UPI">⚡ UPI</option>
                      <option value="Cash">💵 Cash</option>
                      <option value="Bank">🏦 Bank</option>
                    </select>
                  </div>
                </div>

                {/* Live Bill Summary */}
                <div className="bg-[#F8F6F0] rounded-2xl p-3 border border-[#E5DFD3] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#4B5563] font-semibold">
                    <span>Taxable Base:</span>
                    <span className="font-bold text-[#111827]">{formatCurrency(taxableAmount)}</span>
                  </div>
                  {formData.gstEnabled && (
                    <div className="flex justify-between text-[#4B5563] font-semibold">
                      <span>GST (5%):</span>
                      <span className="font-bold text-[#111827]">{formatCurrency(gstAmount)}</span>
                    </div>
                  )}
                  {formData.tripType === 'Rental' && formData.securityDeposit > 0 && (
                    <div className="flex justify-between text-amber-800 font-semibold">
                      <span>Refundable Deposit:</span>
                      <span className="font-bold">{formatCurrency(formData.securityDeposit)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-[#111827] pt-1 border-t border-[#E5DFD3]">
                    <span>Total Trip Fare:</span>
                    <span className="text-[#EA580C]">{formatCurrency(totalFare)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-800">
                    <span>Balance Pending:</span>
                    <span>{formatCurrency(balancePending)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Wizard Controls */}
        <div className="bg-white px-5 py-3.5 border-t border-[#E5DFD3] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 rounded-full border-2 border-[#E5DFD3] text-xs font-bold text-[#4B5563] flex items-center gap-1 hover:bg-gray-50 tap-active"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!formData.customerName || !formData.customerPhone)) {
                  alert("Please enter customer name and phone number.");
                  return;
                }
                if (step === 2 && (!formData.pickupLocation || !formData.dropLocation)) {
                  alert("Please enter pickup and drop addresses.");
                  return;
                }
                if (step === 3 && !formData.vehicleId) {
                  alert("Please select a vehicle.");
                  return;
                }
                setStep(prev => prev + 1);
              }}
              className="px-6 py-2.5 rounded-full bg-[#111827] text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:bg-black tap-active"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4F05B]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md tap-active"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & WhatsApp Slip</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
