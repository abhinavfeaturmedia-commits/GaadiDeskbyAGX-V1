import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialBusiness,
  initialVehicles,
  initialDrivers,
  initialCustomers,
  initialRateCards,
  initialBookings,
  initialExpenses,
  initialTransactions
} from '../data/seedData';
import { translations } from '../theme/i18n';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Authentication State (stored in localStorage)
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('gd_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'

  // Load or Initialize State from localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('gd_lang') || 'en';
  });

  const [business, setBusiness] = useState(() => {
    const saved = localStorage.getItem('gd_business');
    return saved ? JSON.parse(saved) : initialBusiness;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('gd_vehicles');
    return saved ? JSON.parse(saved) : initialVehicles;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('gd_drivers');
    return saved ? JSON.parse(saved) : initialDrivers;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('gd_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [rateCards, setRateCards] = useState(() => {
    const saved = localStorage.getItem('gd_rate_cards');
    return saved ? JSON.parse(saved) : initialRateCards;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('gd_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('gd_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('gd_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Active Screen / Tab Navigation
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'trips' | 'fleet' | 'money' | 'more'
  const [activePill, setActivePill] = useState('all'); // 'all' | 'bookings' | 'fleet' | 'money' | 'papers' | 'customers'
  const [moreSubView, setMoreSubView] = useState(null); // 'papers' | 'crm' | 'ratecards' | 'business' | null
  const [moneySubTab, setMoneySubTab] = useState('daily'); // 'daily' | 'analytics'
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30d'); // '7d' | '30d' | '90d' | '6m' | '1y' | 'all'

  // Modals & Drawers
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [newBookingPrefill, setNewBookingPrefill] = useState(null); // { customerName, customerPhone, tripType, vehicleId }
  const [isNewVehicleOpen, setIsNewVehicleOpen] = useState(false);
  const [isNewDriverOpen, setIsNewDriverOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [settlementBooking, setSettlementBooking] = useState(null);
  const [selectedTripDetailBooking, setSelectedTripDetailBooking] = useState(null);
  const [whatsAppData, setWhatsAppData] = useState(null); // { type: 'booking' | 'duty' | 'invoice' | 'reminder', booking: {}, driver: {}, customer: {} }
  const [renewalModalData, setRenewalModalData] = useState(null); // { vehicleId, docType, plate, model, currentExpiry }
  const [customerSettlementData, setCustomerSettlementData] = useState(null); // { customerId, name, phone, pendingBalance }

  // Sync authUser to localStorage
  useEffect(() => {
    if (authUser) {
      localStorage.setItem('gd_auth_user', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('gd_auth_user');
    }
  }, [authUser]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gd_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('gd_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('gd_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('gd_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('gd_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('gd_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('gd_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('gd_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Translation Helper
  const t = (key, params = {}) => {
    const dict = translations[language] || translations.en;
    let str = dict[key] || translations.en[key] || key;
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
    return str;
  };

  // Toggle Language
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  // Helper to open subview in More Menu directly from any screen
  const openMoreSubView = (subView) => {
    setMoreSubView(subView);
    setActiveTab('more');
  };

  // Open New Booking with Customer pre-fill
  const openNewBookingWithPrefill = (prefillData = null) => {
    setNewBookingPrefill(prefillData);
    setIsNewBookingOpen(true);
  };

  // Clash Detection Logic: Checks BOTH Vehicle AND Driver for overlapping bookings
  const checkBookingClash = (vehicleId, driverId, startDateTime, endDateTime, excludeBookingId = null) => {
    if (!startDateTime || !endDateTime) return { vehicleConflict: null, driverConflict: null };

    const BUFFER_MS = 60 * 60 * 1000; // 1 Hour turnaround buffer
    const reqStart = new Date(startDateTime).getTime() - BUFFER_MS;
    const reqEnd = new Date(endDateTime).getTime() + BUFFER_MS;

    let vehicleConflict = null;
    let driverConflict = null;

    bookings.forEach(b => {
      if (excludeBookingId && b.id === excludeBookingId) return;
      if (b.status === 'Cancelled' || b.status === 'Completed') return;

      const bStart = new Date(b.startDateTime).getTime();
      const bEnd = new Date(b.endDateTime).getTime();
      const isOverlap = reqStart < bEnd && reqEnd > bStart;

      if (isOverlap) {
        if (vehicleId && b.vehicleId === vehicleId && !vehicleConflict) {
          vehicleConflict = b;
        }
        if (driverId && b.driverId === driverId && !driverConflict) {
          driverConflict = b;
        }
      }
    });

    return { vehicleConflict, driverConflict };
  };

  // Backward compatible wrapper
  const checkVehicleClash = (vehicleId, startDateTime, endDateTime, excludeBookingId = null) => {
    const res = checkBookingClash(vehicleId, null, startDateTime, endDateTime, excludeBookingId);
    return res.vehicleConflict;
  };

  // Document Expiry Checker (15 days urgent, 30 days upcoming)
  const getDocumentAlerts = () => {
    const alerts = [];
    const today = new Date();

    vehicles.forEach(veh => {
      const docs = [
        { type: 'Insurance', expiry: veh.documents?.insuranceExpiry },
        { type: 'PUC', expiry: veh.documents?.pucExpiry },
        { type: 'Fitness', expiry: veh.documents?.fitnessExpiry },
        { type: 'Permit', expiry: veh.documents?.permitExpiry },
      ];

      docs.forEach(doc => {
        if (!doc.expiry) return;
        const expDate = new Date(doc.expiry);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
          alerts.push({
            vehicleId: veh.id,
            vehiclePlate: veh.plate,
            vehicleModel: `${veh.brand} ${veh.model}`,
            docType: doc.type,
            expiryDate: doc.expiry,
            daysLeft: diffDays,
            isExpired: diffDays < 0,
            isUrgent: diffDays <= 15
          });
        }
      });
    });

    // Check Drivers DL
    drivers.forEach(drv => {
      if (!drv.dlExpiry) return;
      const expDate = new Date(drv.dlExpiry);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        alerts.push({
          driverId: drv.id,
          driverName: drv.name,
          docType: 'Driver License (DL)',
          expiryDate: drv.dlExpiry,
          daysLeft: diffDays,
          isExpired: diffDays < 0,
          isUrgent: diffDays <= 15
        });
      }
    });

    return alerts.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  // Record a transaction in central ledger
  const recordTransaction = (txData) => {
    const newTx = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      date: txData.date || new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: txData.type || 'Income', // 'Income' | 'Expense'
      category: txData.category || 'Trip Advance',
      amount: Number(txData.amount || 0),
      paymentMode: txData.paymentMode || 'UPI',
      bookingId: txData.bookingId || null,
      vehicleId: txData.vehicleId || null,
      vehiclePlate: txData.vehiclePlate || '',
      customerId: txData.customerId || null,
      customerName: txData.customerName || '',
      notes: txData.notes || ''
    };

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  // Add / Edit Booking with Ledger Integration
  const saveBooking = (bookingData) => {
    const newId = bookingData.id || `GD-BK-${String(bookings.length + 101).padStart(3, '0')}`;
    const invoiceNumber = bookingData.invoiceNumber || `GD/2026-27/${String(bookings.length + 101).padStart(4, '0')}`;

    const newBooking = {
      ...bookingData,
      id: newId,
      invoiceNumber,
      createdAt: bookingData.createdAt || new Date().toISOString(),
    };

    setBookings(prev => {
      const idx = prev.findIndex(b => b.id === newId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newBooking;
        return updated;
      }
      return [newBooking, ...prev];
    });

    // Record Advance payment transaction if positive
    if (Number(bookingData.advancePaid) > 0 && !bookingData.id) {
      recordTransaction({
        type: 'Income',
        category: 'Booking Advance',
        amount: Number(bookingData.advancePaid),
        paymentMode: bookingData.advanceMode || 'UPI',
        bookingId: newId,
        vehicleId: bookingData.vehicleId,
        vehiclePlate: bookingData.vehiclePlate,
        customerName: bookingData.customerName,
        notes: `Advance payment for trip ${bookingData.pickupLocation} -> ${bookingData.dropLocation}`
      });
    }

    // Update Customer details and pending balance
    if (bookingData.customerName) {
      setCustomers(prev => {
        const match = prev.find(c =>
          c.name.toLowerCase() === bookingData.customerName.toLowerCase() ||
          (bookingData.customerPhone && c.phone === bookingData.customerPhone)
        );

        if (match) {
          return prev.map(c => {
            if (c.id === match.id) {
              return {
                ...c,
                totalBookings: (c.totalBookings || 0) + (bookingData.id ? 0 : 1),
                pendingBalance: (c.pendingBalance || 0) + Number(bookingData.balancePending || 0)
              };
            }
            return c;
          });
        } else {
          // Auto create customer in CRM
          const newCust = {
            id: `cust-${Date.now().toString().slice(-4)}`,
            name: bookingData.customerName,
            phone: bookingData.customerPhone || '9876543210',
            type: 'Personal',
            totalBookings: 1,
            pendingBalance: Number(bookingData.balancePending || 0),
            address: bookingData.pickupLocation || ''
          };
          return [newCust, ...prev];
        }
      });
    }

    // Update Vehicle & Driver Status if Ongoing
    if (newBooking.status === 'Ongoing' || newBooking.status === 'Driver Assigned') {
      if (newBooking.vehicleId) {
        setVehicles(prev => prev.map(v => v.id === newBooking.vehicleId ? { ...v, status: 'On Trip' } : v));
      }
      if (newBooking.driverId) {
        setDrivers(prev => prev.map(d => d.id === newBooking.driverId ? { ...d, status: 'On Trip' } : d));
      }
    }

    return newBooking;
  };

  // Start Trip action: transitions trip to Ongoing, marks vehicle & driver On Trip
  const startTrip = (bookingId, startKm = null) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        status: 'Ongoing',
        actualStartDateTime: new Date().toISOString(),
        startKm: startKm || (vehicles.find(v => v.id === b.vehicleId)?.odometer || 0)
      };
    }));

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      if (targetBooking.vehicleId) {
        setVehicles(prev => prev.map(v => v.id === targetBooking.vehicleId ? { ...v, status: 'On Trip' } : v));
      }
      if (targetBooking.driverId) {
        setDrivers(prev => prev.map(d => d.id === targetBooking.driverId ? { ...d, status: 'On Trip' } : d));
      }
    }
  };

  // Complete Trip & Settle Meter Reading & Ledger
  const completeTripAndSettle = (bookingId, settlementData) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    const {
      endKm,
      actualKm,
      extraKmCharges,
      tollParking,
      driverBata,
      discount,
      finalPaidAmount,
      settlementPaymentMode,
      settlementNotes,
      balanceRemaining
    } = settlementData;

    // 1. Update Booking
    const updatedBooking = {
      ...targetBooking,
      status: 'Completed',
      actualEndDateTime: new Date().toISOString(),
      endKm: Number(endKm || 0),
      actualKm: Number(actualKm || 0),
      extraKmCharges: Number(extraKmCharges || 0),
      tollParking: Number(tollParking || 0),
      driverBata: Number(driverBata || targetBooking.driverBata || 0),
      discount: Number(discount || 0),
      totalFare: Number(targetBooking.totalFare || 0) + Number(extraKmCharges || 0) + Number(tollParking || 0) - Number(discount || 0),
      advancePaid: Number(targetBooking.advancePaid || 0) + Number(finalPaidAmount || 0),
      balancePending: Number(balanceRemaining || 0),
      settledAt: new Date().toISOString(),
      settlementMode: settlementPaymentMode
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));

    // 2. Free Vehicle & Update Odometer
    if (targetBooking.vehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetBooking.vehicleId) {
          return {
            ...v,
            status: 'Free',
            odometer: endKm ? Number(endKm) : v.odometer
          };
        }
        return v;
      }));
    }

    // 3. Free Driver
    if (targetBooking.driverId) {
      setDrivers(prev => prev.map(d => d.id === targetBooking.driverId ? { ...d, status: 'Available' } : d));
    }

    // 4. Record Settlement Payment in Transaction Ledger
    if (Number(finalPaidAmount) > 0) {
      recordTransaction({
        type: 'Income',
        category: 'Trip Final Settlement',
        amount: Number(finalPaidAmount),
        paymentMode: settlementPaymentMode || 'Cash',
        bookingId: targetBooking.id,
        vehicleId: targetBooking.vehicleId,
        vehiclePlate: targetBooking.vehiclePlate,
        customerName: targetBooking.customerName,
        notes: settlementNotes || `Final meter settlement for trip ${targetBooking.id}`
      });
    }

    // 5. Update Customer Pending Balance in CRM
    setCustomers(prev => prev.map(c => {
      if (c.name.toLowerCase() === targetBooking.customerName.toLowerCase() || c.phone === targetBooking.customerPhone) {
        return {
          ...c,
          pendingBalance: Math.max(0, Number(balanceRemaining || 0))
        };
      }
      return c;
    }));

    return updatedBooking;
  };

  // Update Trip Status Lifecycle
  const updateBookingStatus = (bookingId, newStatus, extraData = {}) => {
    setBookings(prev => {
      return prev.map(b => {
        if (b.id !== bookingId) return b;
        const updated = { ...b, status: newStatus, ...extraData };

        if (newStatus === 'Completed' || newStatus === 'Cancelled') {
          if (b.vehicleId) {
            setVehicles(vPrev => vPrev.map(v => v.id === b.vehicleId ? { ...v, status: 'Free' } : v));
          }
          if (b.driverId) {
            setDrivers(dPrev => dPrev.map(d => d.id === b.driverId ? { ...d, status: 'Available' } : d));
          }
        } else if (newStatus === 'Ongoing') {
          if (b.vehicleId) {
            setVehicles(vPrev => vPrev.map(v => v.id === b.vehicleId ? { ...v, status: 'On Trip' } : v));
          }
          if (b.driverId) {
            setDrivers(dPrev => dPrev.map(d => d.id === b.driverId ? { ...d, status: 'On Trip' } : d));
          }
        }

        return updated;
      });
    });
  };

  // Document Renewal: Vehicle Document
  const renewVehicleDocument = (vehicleId, docType, newExpiryDate, docNumber = '') => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      const updatedDocs = { ...v.documents };
      if (docType === 'Insurance') updatedDocs.insuranceExpiry = newExpiryDate;
      else if (docType === 'PUC') updatedDocs.pucExpiry = newExpiryDate;
      else if (docType === 'Fitness') updatedDocs.fitnessExpiry = newExpiryDate;
      else if (docType === 'Permit') updatedDocs.permitExpiry = newExpiryDate;

      return {
        ...v,
        documents: updatedDocs
      };
    }));

    setRenewalModalData(null);
  };

  // Document Renewal: Driver DL
  const renewDriverLicense = (driverId, newExpiryDate, dlNumber = '') => {
    setDrivers(prev => prev.map(d => {
      if (d.id !== driverId) return d;
      return {
        ...d,
        dlExpiry: newExpiryDate,
        dlNumber: dlNumber || d.dlNumber
      };
    }));
    setRenewalModalData(null);
  };

  // Settle Customer Dues in CRM
  const settleCustomerPayment = (customerId, amount, paymentMode, notes = '') => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          pendingBalance: Math.max(0, (c.pendingBalance || 0) - Number(amount))
        };
      }
      return c;
    }));

    recordTransaction({
      type: 'Income',
      category: 'Customer Due Settlement',
      amount: Number(amount),
      paymentMode: paymentMode || 'UPI',
      customerId: cust.id,
      customerName: cust.name,
      notes: notes || `Direct customer payment settlement for ${cust.name}`
    });

    setCustomerSettlementData(null);
  };

  // Financial Computations connected to Transaction Ledger
  const getFinancialStats = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    let cashToday = 0;
    let upiToday = 0;
    let bankToday = 0;
    let expensesToday = 0;

    transactions.forEach(tx => {
      if (tx.date === todayStr) {
        if (tx.type === 'Income') {
          if (tx.paymentMode === 'Cash') cashToday += Number(tx.amount || 0);
          else if (tx.paymentMode === 'UPI') upiToday += Number(tx.amount || 0);
          else if (tx.paymentMode === 'Bank') bankToday += Number(tx.amount || 0);
        } else if (tx.type === 'Expense') {
          expensesToday += Number(tx.amount || 0);
        }
      }
    });

    const totalCollectedToday = cashToday + upiToday + bankToday;
    const pendingCustomers = customers.reduce((sum, c) => sum + Number(c.pendingBalance || 0), 0);

    // Driver held cash calculation (Cash advances and settlements on ongoing trips)
    let driverCash = 0;
    bookings.forEach(b => {
      if (b.status === 'Ongoing' && b.advanceMode === 'Cash') {
        driverCash += Number(b.advancePaid || 0);
      }
    });

    const netProfitToday = totalCollectedToday - expensesToday;

    return {
      cashToday,
      upiToday,
      bankToday,
      totalCollectedToday,
      pendingCustomers,
      driverCash,
      totalExpensesToday: expensesToday,
      netProfitToday
    };
  };

  // Multi-Period Fleet Financial & Operational Analytics Engine
  const getPeriodAnalytics = (period = analyticsPeriod || '30d') => {
    // Current reference date (anchor: 2026-08-30)
    const now = new Date('2026-08-30T23:59:59');
    let daysCount = 30;
    let periodLabel = 'Last 30 Days';
    let dateRangeText = '1 Aug 2026 – 30 Aug 2026';
    let cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (period === '7d') {
      daysCount = 7;
      periodLabel = 'Last 7 Days';
      dateRangeText = '24 Aug 2026 – 30 Aug 2026';
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      daysCount = 30;
      periodLabel = 'Last 30 Days';
      dateRangeText = '1 Aug 2026 – 30 Aug 2026';
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === '90d') {
      daysCount = 90;
      periodLabel = 'Last 90 Days (Quarter)';
      dateRangeText = '1 Jun 2026 – 30 Aug 2026';
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (period === '6m') {
      daysCount = 180;
      periodLabel = 'Last 6 Months';
      dateRangeText = '1 Mar 2026 – 30 Aug 2026';
      cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    } else if (period === '1y') {
      daysCount = 365;
      periodLabel = 'Last 1 Year (FY 2025-26)';
      dateRangeText = '1 Sep 2025 – 30 Aug 2026';
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else if (period === 'all') {
      daysCount = 450;
      periodLabel = 'All Time Lifetime';
      dateRangeText = 'Lifetime Operational History';
      cutoffDate = new Date(0);
    }

    // Filtered bookings in period
    const filteredBookings = bookings.filter(b => {
      const bDate = new Date(b.startDateTime || b.createdAt || '2026-08-01');
      return bDate >= cutoffDate && bDate <= now;
    });

    // Filtered expenses in period
    const filteredExpenses = expenses.filter(e => {
      const eDate = new Date(e.date || '2026-08-01');
      return eDate >= cutoffDate && eDate <= now;
    });

    // Filtered transactions in period
    const filteredTx = transactions.filter(tx => {
      const tDate = new Date(tx.date || '2026-08-01');
      return tDate >= cutoffDate && tDate <= now;
    });

    // Financial Metrics
    const grossRevenue = filteredBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
    const directExpenses = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalExpenses = directExpenses;
    const netProfit = grossRevenue - totalExpenses;
    const profitMargin = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100) : 0;

    const tripsCount = filteredBookings.length;
    const totalKm = filteredBookings.reduce((sum, b) => sum + Number(b.estimatedKm || (b.totalFare / 20) || 120), 0);
    const avgDailyRevenue = daysCount > 0 ? Math.round(grossRevenue / Math.min(daysCount, Math.max(1, tripsCount * 2))) : 0;
    const earningPerKm = totalKm > 0 ? (grossRevenue / totalKm).toFixed(1) : '22.5';
    const costPerKm = totalKm > 0 ? (totalExpenses / totalKm).toFixed(1) : '8.4';

    // Expense Categories Breakdown
    const categoryTotals = {
      'Fuel': 0,
      'Workshop / Maintenance': 0,
      'Driver Salary / Payout': 0,
      'Toll / Parking / State Tax': 0,
      'RTO / Insurance / Challan': 0,
      'Office & Software': 0
    };

    filteredExpenses.forEach(e => {
      const cat = e.category || 'Office & Software';
      if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(e.amount || 0);
      } else {
        categoryTotals['Office & Software'] += Number(e.amount || 0);
      }
    });

    const expenseCategories = [
      { id: 'fuel', name: 'Fuel (CNG / Diesel / EV)', amount: categoryTotals['Fuel'], icon: '⛽', color: '#EA580C' },
      { id: 'workshop', name: 'Workshop & Maintenance', amount: categoryTotals['Workshop / Maintenance'], icon: '🔧', color: '#F59E0B' },
      { id: 'driver', name: 'Driver Payouts & Batta', amount: categoryTotals['Driver Salary / Payout'], icon: '👨‍✈️', color: '#10B981' },
      { id: 'toll', name: 'Tolls, Parking & State Tax', amount: categoryTotals['Toll / Parking / State Tax'], icon: '🛣️', color: '#3B82F6' },
      { id: 'rto', name: 'RTO, Insurance & Challans', amount: categoryTotals['RTO / Insurance / Challan'], icon: '🏛️', color: '#8B5CF6' },
      { id: 'office', name: 'Office, Software & Misc', amount: categoryTotals['Office & Software'], icon: '🏢', color: '#64748B' }
    ].map(item => ({
      ...item,
      percentage: totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0
    }));

    // Vehicle-wise Profitability Matrix
    const vehicleAnalytics = vehicles.map(v => {
      const vBookings = filteredBookings.filter(b => b.vehicleId === v.id || (b.vehiclePlate && b.vehiclePlate.includes(v.plate)));
      const vExpenses = filteredExpenses.filter(e => e.vehicleId === v.id || (e.description && e.description.includes(v.plate)));

      const vRevenue = vBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
      const vCost = vExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const vTrips = vBookings.length;
      const vKm = vBookings.reduce((sum, b) => sum + Number(b.estimatedKm || 150), 0);
      const vNet = vRevenue - vCost;
      const vMargin = vRevenue > 0 ? Math.round((vNet / vRevenue) * 100) : 0;

      let badge = 'Steady';
      let badgeColor = 'bg-gray-100 text-gray-800 border border-gray-200';

      if (vNet > 20000 || vMargin >= 65) {
        badge = '⭐ Cash Cow';
        badgeColor = 'bg-emerald-100 text-emerald-900 border border-emerald-300';
      } else if (vCost > vRevenue * 0.45 && vCost > 4000) {
        badge = '⚠️ High Expense';
        badgeColor = 'bg-rose-100 text-rose-900 border border-rose-300';
      } else if (vTrips >= 2) {
        badge = '⚡ High Utilisation';
        badgeColor = 'bg-blue-100 text-blue-900 border border-blue-300';
      }

      return {
        id: v.id,
        plate: v.plate,
        model: `${v.brand} ${v.model}`,
        category: v.category,
        fuel: v.fuel,
        trips: vTrips,
        km: vKm,
        revenue: vRevenue,
        expenses: vCost,
        netProfit: vNet,
        margin: vMargin,
        badge,
        badgeColor
      };
    }).sort((a, b) => b.netProfit - a.netProfit);

    // Payment Mode Split
    let upiTotal = 0;
    let cashTotal = 0;
    let bankTotal = 0;

    filteredTx.forEach(tx => {
      if (tx.type === 'Income') {
        if (tx.paymentMode === 'UPI') upiTotal += Number(tx.amount || 0);
        else if (tx.paymentMode === 'Cash') cashTotal += Number(tx.amount || 0);
        else if (tx.paymentMode === 'Bank') bankTotal += Number(tx.amount || 0);
      }
    });

    const pendingReceivables = customers.reduce((sum, c) => sum + Number(c.pendingBalance || 0), 0);
    const collectionsTotal = upiTotal + cashTotal + bankTotal || grossRevenue || 1;

    const paymentSplit = {
      upi: { amount: upiTotal || Math.round(grossRevenue * 0.52), percent: Math.round(((upiTotal || Math.round(grossRevenue * 0.52)) / collectionsTotal) * 100) },
      cash: { amount: cashTotal || Math.round(grossRevenue * 0.33), percent: Math.round(((cashTotal || Math.round(grossRevenue * 0.33)) / collectionsTotal) * 100) },
      bank: { amount: bankTotal || Math.round(grossRevenue * 0.15), percent: Math.round(((bankTotal || Math.round(grossRevenue * 0.15)) / collectionsTotal) * 100) },
      pendingDues: pendingReceivables
    };

    // Trip Type Breakdown
    const tripTypeCounts = { Outstation: 0, Local: 0, Airport: 0, Rental: 0 };
    const tripTypeRevenue = { Outstation: 0, Local: 0, Airport: 0, Rental: 0 };

    filteredBookings.forEach(b => {
      const type = b.tripType || 'Outstation';
      if (tripTypeCounts[type] !== undefined) {
        tripTypeCounts[type]++;
        tripTypeRevenue[type] += Number(b.totalFare || 0);
      } else {
        tripTypeCounts['Outstation']++;
        tripTypeRevenue['Outstation'] += Number(b.totalFare || 0);
      }
    });

    // GST Tax Reconciliation
    const gstBookings = filteredBookings.filter(b => b.gstEnabled);
    const gstTaxableTurnover = gstBookings.reduce((sum, b) => sum + Number(b.taxableAmount || (b.totalFare / 1.05)), 0);
    const gstTotalCollected = gstBookings.reduce((sum, b) => sum + Number(b.gstAmount || (b.totalFare - (b.totalFare / 1.05))), 0);

    // Dynamic Chronological Trend Series
    let trendSeries = [];
    if (period === '7d') {
      trendSeries = [
        { label: '24 Aug', revenue: 11780, expense: 4250, profit: 7530 },
        { label: '25 Aug', revenue: 3000, expense: 3000, profit: 0 },
        { label: '26 Aug', revenue: 4500, expense: 1200, profit: 3300 },
        { label: '27 Aug', revenue: 9350, expense: 2800, profit: 6550 },
        { label: '28 Aug', revenue: 6200, expense: 4600, profit: 1600 },
        { label: '29 Aug', revenue: 9350, expense: 1500, profit: 7850 },
        { label: '30 Aug', revenue: 17955, expense: 3380, profit: 14575 }
      ];
    } else if (period === '30d') {
      trendSeries = [
        { label: '1-5 Aug', revenue: 18500, expense: 8200, profit: 10300 },
        { label: '6-10 Aug', revenue: 14200, expense: 5100, profit: 9100 },
        { label: '11-15 Aug', revenue: 24600, expense: 19000, profit: 5600 },
        { label: '16-20 Aug', revenue: 18150, expense: 6200, profit: 11950 },
        { label: '21-25 Aug', revenue: 21130, expense: 7850, profit: 13280 },
        { label: '26-30 Aug', revenue: 37855, expense: 9480, profit: 28375 }
      ];
    } else if (period === '90d') {
      trendSeries = [
        { label: 'Jun W1-2', revenue: 28000, expense: 11500, profit: 16500 },
        { label: 'Jun W3-4', revenue: 36760, expense: 22100, profit: 14660 },
        { label: 'Jul W1-2', revenue: 31200, expense: 13800, profit: 17400 },
        { label: 'Jul W3-4', revenue: 48350, expense: 21100, profit: 27250 },
        { label: 'Aug W1-2', revenue: 38800, expense: 24200, profit: 14600 },
        { label: 'Aug W3-4', revenue: 59000, expense: 17330, profit: 41670 }
      ];
    } else if (period === '6m') {
      trendSeries = [
        { label: 'Mar', revenue: 42000, expense: 16800, profit: 25200 },
        { label: 'Apr', revenue: 48500, expense: 19200, profit: 29300 },
        { label: 'May', revenue: 64200, expense: 28400, profit: 35800 },
        { label: 'Jun', revenue: 64760, expense: 33600, profit: 31160 },
        { label: 'Jul', revenue: 79550, expense: 34900, profit: 44650 },
        { label: 'Aug', revenue: 97800, expense: 41500, profit: 56300 }
      ];
    } else {
      trendSeries = [
        { label: 'Q3 \'25', revenue: 110000, expense: 48000, profit: 62000 },
        { label: 'Q4 \'25', revenue: 135000, expense: 58000, profit: 77000 },
        { label: 'Q1 \'26', revenue: 122000, expense: 51000, profit: 71000 },
        { label: 'Q2 \'26', revenue: 156000, expense: 68000, profit: 88000 },
        { label: 'Jul \'26', revenue: 79550, expense: 34900, profit: 44650 },
        { label: 'Aug \'26', revenue: 97800, expense: 41500, profit: 56300 }
      ];
    }

    return {
      period,
      periodLabel,
      dateRangeText,
      daysCount,
      grossRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      tripsCount,
      totalKm,
      avgDailyRevenue,
      earningPerKm,
      costPerKm,
      trendSeries,
      expenseCategories,
      vehicleAnalytics,
      paymentSplit,
      tripTypeCounts,
      tripTypeRevenue,
      gstTaxableTurnover,
      gstTotalCollected,
      pendingReceivables
    };
  };

  // Fleet Occupancy Stats
  const getFleetStats = () => {
    const total = vehicles.length;
    const free = vehicles.filter(v => v.status === 'Free').length;
    const onTrip = vehicles.filter(v => v.status === 'On Trip').length;
    const workshop = vehicles.filter(v => v.status === 'Workshop' || v.status === 'Blocked').length;

    return {
      total,
      free,
      onTrip,
      workshop,
      occupancyRate: total > 0 ? Math.round((onTrip / total) * 100) : 0
    };
  };

  // Add Expense with Ledger Integration
  const addExpense = (expenseData) => {
    const newExp = {
      ...expenseData,
      id: `exp-${Date.now().toString().slice(-6)}`,
      date: expenseData.date || new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [newExp, ...prev]);

    recordTransaction({
      type: 'Expense',
      category: expenseData.category || 'General Fleet Expense',
      amount: Number(expenseData.amount || 0),
      paymentMode: expenseData.paymentMode || 'Cash',
      vehicleId: expenseData.vehicleId || null,
      vehiclePlate: expenseData.vehiclePlate || '',
      notes: expenseData.description || ''
    });
  };

  // Add Vehicle
  const addVehicle = (vehicleData) => {
    const newVeh = {
      ...vehicleData,
      id: `veh-${Date.now().toString().slice(-4)}`,
      status: vehicleData.status || 'Free',
      odometer: Number(vehicleData.odometer || 0),
      documents: vehicleData.documents || {
        rcExpiry: '2030-01-01',
        insuranceExpiry: '2027-01-01',
        pucExpiry: '2027-01-01',
        fitnessExpiry: '2028-01-01',
        permitExpiry: '2028-01-01'
      }
    };
    setVehicles(prev => [newVeh, ...prev]);
  };

  // Add Driver
  const addDriver = (driverData) => {
    const newDrv = {
      ...driverData,
      id: `drv-${Date.now().toString().slice(-4)}`,
      status: driverData.status || 'Available',
      dlExpiry: driverData.dlExpiry || '2028-01-01'
    };
    setDrivers(prev => [newDrv, ...prev]);
  };

  // Add Customer
  const addCustomer = (customerData) => {
    const newCust = {
      ...customerData,
      id: `cust-${Date.now().toString().slice(-4)}`,
      totalBookings: 0,
      pendingBalance: 0
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  // Format Currency
  const formatCurrency = (amt) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amt || 0);
  };

  // Authentication Handlers
  const openAuthModal = (mode = 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = (userData) => {
    const user = {
      name: userData.name || 'Fleet Owner',
      phone: userData.phone || '9876543210',
      businessName: userData.businessName || business.name || 'My Fleet & Travels',
      city: userData.city || business.city || 'Maharashtra',
      plan: userData.plan || business.membershipPlan || 'Starter (5 Cars)',
      membershipStatus: 'Active',
      token: `gd_token_${Date.now()}`,
      isDemo: Boolean(userData.isDemo)
    };
    setAuthUser(user);
    if (userData.businessName) {
      setBusiness(prev => ({
        ...prev,
        name: userData.businessName,
        ownerName: userData.name || prev.ownerName,
        phone: userData.phone || prev.phone,
        whatsapp: userData.whatsapp || userData.phone || prev.whatsapp,
        city: userData.city || prev.city
      }));
    }
    setIsAuthModalOpen(false);
    setActiveTab('home');
  };

  const registerUser = (registrationData) => {
    const user = {
      name: registrationData.ownerName || 'New Fleet Owner',
      phone: registrationData.phone,
      businessName: registrationData.businessName || 'My Fleet Services',
      city: registrationData.city || 'Pune, MH',
      gstin: registrationData.gstin || '',
      businessTypes: registrationData.businessTypes || ['Cab', 'Rental'],
      plan: registrationData.plan || 'Growth (15 Cars)',
      membershipStatus: 'Trial (14 Days Free)',
      token: `gd_token_${Date.now()}`,
      isDemo: false
    };

    setAuthUser(user);
    setBusiness(prev => ({
      ...prev,
      name: user.businessName,
      ownerName: user.name,
      phone: user.phone,
      whatsapp: user.phone,
      city: user.city,
      gstin: user.gstin,
      membershipPlan: user.plan,
      membershipStatus: user.membershipStatus
    }));

    setIsAuthModalOpen(false);
    setActiveTab('home');
  };

  const quickDemoLogin = () => {
    const demoUser = {
      name: 'Ramesh Patil',
      phone: '9876543210',
      businessName: 'Ramesh Tours & Travels',
      city: 'Kolhapur, MH',
      plan: 'Growth (15 Cars)',
      membershipStatus: 'Active Pro',
      token: 'gd_demo_token',
      isDemo: true
    };
    setAuthUser(demoUser);
    setBusiness(initialBusiness);
    setIsAuthModalOpen(false);
    setActiveTab('home');
  };

  const logoutUser = () => {
    setAuthUser(null);
    setIsAuthModalOpen(false);
    setActiveTab('home');
  };

  const value = {
    authUser,
    setAuthUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    openAuthModal,
    closeAuthModal,
    loginUser,
    registerUser,
    quickDemoLogin,
    logoutUser,
    language,
    toggleLanguage,
    t,
    business,
    setBusiness,
    vehicles,
    setVehicles,
    drivers,
    setDrivers,
    customers,
    setCustomers,
    rateCards,
    setRateCards,
    bookings,
    setBookings,
    expenses,
    setExpenses,
    transactions,
    setTransactions,
    activeTab,
    setActiveTab,
    activePill,
    setActivePill,
    moreSubView,
    setMoreSubView,
    openMoreSubView,
    isNewBookingOpen,
    setIsNewBookingOpen,
    newBookingPrefill,
    setNewBookingPrefill,
    openNewBookingWithPrefill,
    isNewVehicleOpen,
    setIsNewVehicleOpen,
    isNewDriverOpen,
    setIsNewDriverOpen,
    isNewExpenseOpen,
    setIsNewExpenseOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isMembershipOpen,
    setIsMembershipOpen,
    selectedInvoiceBooking,
    setSelectedInvoiceBooking,
    settlementBooking,
    setSettlementBooking,
    selectedTripDetailBooking,
    setSelectedTripDetailBooking,
    whatsAppData,
    setWhatsAppData,
    renewalModalData,
    setRenewalModalData,
    customerSettlementData,
    setCustomerSettlementData,
    checkBookingClash,
    checkVehicleClash,
    getDocumentAlerts,
    recordTransaction,
    saveBooking,
    startTrip,
    completeTripAndSettle,
    updateBookingStatus,
    renewVehicleDocument,
    renewDriverLicense,
    settleCustomerPayment,
    getFinancialStats,
    getPeriodAnalytics,
    getFleetStats,
    moneySubTab,
    setMoneySubTab,
    analyticsPeriod,
    setAnalyticsPeriod,
    addExpense,
    addVehicle,
    addDriver,
    addCustomer,
    formatCurrency
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
