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

  // Driver Active Screen / Tab Navigation
  const [driverActiveTab, setDriverActiveTab] = useState('duty'); // 'duty' | 'trips' | 'wallet' | 'profile'
  const [driverTollModalBooking, setDriverTollModalBooking] = useState(null);
  const [driverUpiModalData, setDriverUpiModalData] = useState(null); // { booking, amount }

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

  // New Feature Suite Modal States
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [selectedCorporateCustomer, setSelectedCorporateCustomer] = useState(null);
  const [isCaExportOpen, setIsCaExportOpen] = useState(false);
  const [isPublicSiteOpen, setIsPublicSiteOpen] = useState(false);
  const [serviceModalVehicle, setServiceModalVehicle] = useState(null);
  const [inspectionModalBooking, setInspectionModalBooking] = useState(null);

  // Notification Read / Dismissed tracking
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const saved = localStorage.getItem('gd_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gd_read_notifications', JSON.stringify(readNotificationIds));
  }, [readNotificationIds]);

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

  // Clash Detection Logic: Checks BOTH Vehicle AND Driver for overlapping bookings with adaptive turnaround buffer
  const checkBookingClash = (vehicleId, driverId, startDateTime, endDateTime, excludeBookingId = null, tripType = 'Outstation') => {
    if (!startDateTime || !endDateTime) return { vehicleConflict: null, driverConflict: null };

    // Adaptive buffer: 30 mins for local/airport, 90 mins for outstation/rental/package
    const BUFFER_MS = (tripType === 'Local' || tripType === 'Airport') ? 30 * 60 * 1000 : 90 * 60 * 1000;
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
        { type: 'RC Book', expiry: veh.documents?.rcExpiry }
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

  // Notification Mark-Read & Clear Handlers
  const markNotificationAsRead = (id) => {
    if (!id) return;
    setReadNotificationIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllNotificationsAsRead = (notifsList = []) => {
    const ids = notifsList.map(n => n.id);
    setReadNotificationIds(prev => Array.from(new Set([...prev, ...ids])));
  };

  const clearAllNotifications = (notifsList = []) => {
    const ids = notifsList.map(n => n.id);
    setReadNotificationIds(prev => Array.from(new Set([...prev, ...ids])));
  };

  // Unified Role-Based Smart Notification Engine
  const getSmartNotifications = (customRole) => {
    const role = (customRole || (authUser?.role === 'driver' ? 'driver' : (authUser?.role?.toLowerCase() || 'owner'))).toLowerCase();
    const notifs = [];
    const today = new Date();

    // 1. DRIVER NOTIFICATIONS
    if (role === 'driver') {
      const driverId = authUser?.driverId || 'drv-01';
      const currentDriver = drivers.find(d => d.id === driverId) || drivers[0];

      // Driver Assigned Duties
      const assignedBookings = bookings.filter(b => b.driverId === driverId && (b.status === 'Confirmed' || b.status === 'Ongoing' || b.status === 'Driver Assigned'));
      assignedBookings.forEach(b => {
        const isOngoing = b.status === 'Ongoing';
        notifs.push({
          id: `drv-duty-${b.id}`,
          category: 'trips',
          targetRole: 'driver',
          severity: isOngoing ? 'urgent' : 'info',
          badgeText: isOngoing ? 'On Trip' : 'New Duty',
          title: `Trip #${b.bookingNumber || b.id} • ${b.pickupLocation?.split(',')[0] || 'Pickup'}`,
          subtitle: `To: ${b.dropLocation?.split(',')[0] || 'Drop'} • ${b.customerName || 'Passenger'}`,
          timestamp: isOngoing ? 'Live' : 'Assigned',
          actionType: 'VIEW_DRIVER_DUTY',
          actionPayload: b,
          actionLabel: isOngoing ? 'Trip Status' : 'Duty Slip'
        });
      });

      // Pending Cash Collection from completed or ongoing trips
      const tripsToCollect = bookings.filter(b => b.driverId === driverId && (Number(b.balanceAmount || 0) > 0 || (Number(b.totalAmount || 0) > 0 && !b.advanceReceived)));
      tripsToCollect.slice(0, 3).forEach(b => {
        const amount = Number(b.balanceAmount || b.totalAmount || 1500);
        notifs.push({
          id: `drv-cash-${b.id}`,
          category: 'money',
          targetRole: 'driver',
          severity: 'urgent',
          badgeText: `Collect ₹${amount.toLocaleString('en-IN')}`,
          title: `Collect Fare: Trip #${b.bookingNumber || b.id}`,
          subtitle: `${b.customerName || 'Passenger'} (${b.dropLocation?.split(',')[0] || 'Drop'})`,
          timestamp: 'Cash in Hand',
          actionType: 'COLLECT_CASH',
          actionPayload: { booking: b, amount },
          actionLabel: 'Collect UPI'
        });
      });

      // Driver DL Expiry Check
      if (currentDriver?.dlExpiry) {
        const expDate = new Date(currentDriver.dlExpiry);
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 45) {
          notifs.push({
            id: `drv-dl-${currentDriver.id}`,
            category: 'compliance',
            targetRole: 'driver',
            severity: diffDays <= 7 ? 'critical' : diffDays <= 15 ? 'urgent' : 'warning',
            badgeText: diffDays <= 0 ? 'Expired' : `${diffDays}d left`,
            title: `Driving License (DL) ${diffDays <= 0 ? 'Expired' : 'Renewal Due'}`,
            subtitle: `Valid till ${currentDriver.dlExpiry} • Submit copy to office`,
            timestamp: 'DL Compliance',
            actionType: 'RENEW_DOC',
            actionPayload: {
              driverId: currentDriver.id,
              driverName: currentDriver.name,
              docType: 'Driver License (DL)',
              expiryDate: currentDriver.dlExpiry,
              isExpired: diffDays <= 0,
              isUrgent: diffDays <= 15
            },
            actionLabel: 'Renew DL'
          });
        }
      }

      return notifs.map(n => ({
        ...n,
        isRead: readNotificationIds.includes(n.id)
      }));
    }

    // 2. FLEET OWNER, DISPATCHER, ACCOUNTANT, MANAGER NOTIFICATIONS

    // A. Compliance / RTO Alerts (PUC, Insurance, Fitness, Permit, DL)
    const docAlerts = getDocumentAlerts();
    docAlerts.forEach(alt => {
      notifs.push({
        id: `rto-${alt.vehicleId || alt.driverId}-${alt.docType}`,
        category: 'compliance',
        targetRole: 'all',
        severity: alt.isExpired ? 'critical' : alt.isUrgent ? 'urgent' : 'warning',
        badgeText: alt.isExpired ? 'EXPIRED' : `${alt.daysLeft}d left`,
        title: `${alt.vehiclePlate || alt.driverName} • ${alt.docType}`,
        subtitle: `Expires ${alt.expiryDate} • Challan risk ₹10,000`,
        timestamp: 'RTO Radar',
        actionType: 'RENEW_DOC',
        actionPayload: alt,
        actionLabel: 'Renew'
      });
    });

    // B. Periodic Service / Maintenance Alerts
    const srvAlerts = getServiceAlerts ? getServiceAlerts() : [];
    srvAlerts.forEach(sa => {
      const veh = vehicles.find(v => v.id === sa.vehicleId);
      if (!veh) return;
      notifs.push({
        id: `srv-${sa.vehicleId}`,
        category: 'compliance',
        targetRole: 'all',
        severity: sa.isOverdue ? 'critical' : sa.isUrgent ? 'urgent' : 'warning',
        badgeText: sa.isOverdue ? 'Overdue' : `${sa.kmRemaining} km`,
        title: `${sa.vehiclePlate} • Service Due`,
        subtitle: `${sa.serviceType} • Odometer ${sa.currentOdometer?.toLocaleString()} km`,
        timestamp: 'Maintenance',
        actionType: 'SERVICE_VEHICLE',
        actionPayload: veh,
        actionLabel: 'Service'
      });
    });

    // C. Trips & Dispatch Alerts (Unassigned Trips & Delayed Trips)
    bookings.forEach(b => {
      if (b.status === 'Confirmed' || b.status === 'Draft' || b.status === 'Unassigned') {
        const isUnassigned = !b.driverId || !b.vehicleId;
        if (isUnassigned) {
          notifs.push({
            id: `trip-unassigned-${b.id}`,
            category: 'trips',
            targetRole: 'dispatcher',
            severity: 'urgent',
            badgeText: 'Unassigned',
            title: `Trip #${b.bookingNumber || b.id} • ${b.pickupLocation?.split(',')[0] || 'Pickup'}`,
            subtitle: `Drop: ${b.dropLocation?.split(',')[0] || 'Drop'} • ${b.customerName || 'Customer'}`,
            timestamp: 'Needs Dispatch',
            actionType: 'ASSIGN_DRIVER',
            actionPayload: b,
            actionLabel: 'Assign'
          });
        }
      }

      // Check if trip start time passed and still confirmed (Late departure)
      if (b.status === 'Confirmed' && b.startDateTime) {
        const startTime = new Date(b.startDateTime).getTime();
        if (startTime < today.getTime() && (today.getTime() - startTime < 86400000)) {
          notifs.push({
            id: `trip-delayed-${b.id}`,
            category: 'trips',
            targetRole: 'dispatcher',
            severity: 'warning',
            badgeText: 'Departure Due',
            title: `Departure Alert: #${b.bookingNumber || b.id}`,
            subtitle: `Scheduled for ${b.startDateTime.slice(11, 16) || 'earlier'} • Driver start pending`,
            timestamp: 'Delay Radar',
            actionType: 'VIEW_TRIP',
            actionPayload: b,
            actionLabel: 'Check'
          });
        }
      }
    });

    // D. Money & Billing Alerts
    // High customer pending balance
    customers.forEach(c => {
      if (c.pendingBalance && c.pendingBalance >= 5000) {
        notifs.push({
          id: `money-cust-${c.id}`,
          category: 'money',
          targetRole: 'accountant',
          severity: c.pendingBalance >= 15000 ? 'urgent' : 'warning',
          badgeText: `₹${c.pendingBalance.toLocaleString('en-IN')}`,
          title: `Pending Due: ${c.name}`,
          subtitle: `${c.company || 'Client'} • Unpaid rides balance`,
          timestamp: 'Accounts Due',
          actionType: 'SETTLE_CUSTOMER',
          actionPayload: c,
          actionLabel: 'Send Link'
        });
      }
    });

    // Completed trips needing Tax Invoice
    const completedTrips = bookings.filter(b => b.status === 'Completed');
    completedTrips.slice(0, 3).forEach(b => {
      notifs.push({
        id: `money-inv-${b.id}`,
        category: 'money',
        targetRole: 'accountant',
        severity: 'info',
        badgeText: 'Tax Invoice',
        title: `Trip #${b.bookingNumber || b.id} • ${b.customerName}`,
        subtitle: `Net Fare ₹${(b.totalAmount || b.netFare || 0).toLocaleString('en-IN')} • GST bill ready`,
        timestamp: 'Billing',
        actionType: 'GENERATE_INVOICE',
        actionPayload: b,
        actionLabel: 'Create Bill'
      });
    });

    // Filter by role if dispatcher or accountant
    let filteredNotifs = notifs;
    if (role === 'dispatcher') {
      filteredNotifs = notifs.filter(n => n.category === 'trips' || n.category === 'compliance' || n.severity === 'critical' || n.severity === 'urgent');
    } else if (role === 'accountant') {
      filteredNotifs = notifs.filter(n => n.category === 'money' || n.severity === 'critical' || n.category === 'trips');
    }

    return filteredNotifs.map(n => ({
      ...n,
      isRead: readNotificationIds.includes(n.id)
    }));
  };

  const getUnreadNotificationCount = (customRole) => {
    const allNotifs = getSmartNotifications(customRole);
    const unread = allNotifs.filter(n => !n.isRead);
    const urgent = unread.filter(n => (n.severity === 'critical' || n.severity === 'urgent') && !n.isRead);
    return {
      total: unread.length,
      urgent: urgent.length
    };
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

  // Add / Edit Booking with Synchronized Ledger & CRM Integration
  const saveBooking = (bookingData) => {
    const existingIndex = bookingData.id ? bookings.findIndex(b => b.id === bookingData.id) : -1;
    const existingBooking = existingIndex >= 0 ? bookings[existingIndex] : null;

    const newId = bookingData.id || `GD-BK-${String(bookings.length + 101).padStart(3, '0')}`;
    const invoiceNumber = bookingData.invoiceNumber || `GD/2026-27/${String(bookings.length + 101).padStart(4, '0')}`;

    const newBooking = {
      ...bookingData,
      id: newId,
      invoiceNumber,
      createdAt: bookingData.createdAt || new Date().toISOString(),
    };

    setBookings(prev => {
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newBooking;
        return updated;
      }
      return [newBooking, ...prev];
    });

    // Record Advance payment transaction if brand new or if advance was modified
    if (Number(bookingData.advancePaid) > 0) {
      if (!existingBooking) {
        recordTransaction({
          type: 'Income',
          category: 'Booking Advance',
          amount: Number(bookingData.advancePaid),
          paymentMode: bookingData.advanceMode || 'UPI',
          bookingId: newId,
          vehicleId: bookingData.vehicleId,
          vehiclePlate: bookingData.vehiclePlate,
          customerName: bookingData.customerName,
          notes: `Advance for ${bookingData.pickupLocation} -> ${bookingData.dropLocation}`
        });
      } else if (Number(existingBooking.advancePaid || 0) !== Number(bookingData.advancePaid)) {
        const diffAdvance = Number(bookingData.advancePaid) - Number(existingBooking.advancePaid || 0);
        if (diffAdvance > 0) {
          recordTransaction({
            type: 'Income',
            category: 'Booking Advance Top-up',
            amount: diffAdvance,
            paymentMode: bookingData.advanceMode || 'UPI',
            bookingId: newId,
            vehicleId: bookingData.vehicleId,
            vehiclePlate: bookingData.vehiclePlate,
            customerName: bookingData.customerName,
            notes: `Additional advance for trip ${newId}`
          });
        }
      }
    }

    // Update Customer details and pending balance delta in CRM
    if (bookingData.customerName) {
      setCustomers(prev => {
        const match = prev.find(c =>
          c.name.toLowerCase() === bookingData.customerName.toLowerCase() ||
          (bookingData.customerPhone && c.phone === bookingData.customerPhone)
        );

        const oldPending = existingBooking ? Number(existingBooking.balancePending || 0) : 0;
        const newPending = Number(bookingData.balancePending || 0);
        const deltaPending = newPending - oldPending;

        if (match) {
          return prev.map(c => {
            if (c.id === match.id) {
              return {
                ...c,
                totalBookings: (c.totalBookings || 0) + (existingBooking ? 0 : 1),
                pendingBalance: Math.max(0, (c.pendingBalance || 0) + deltaPending),
                address: bookingData.pickupLocation || c.address
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
            pendingBalance: Math.max(0, Number(bookingData.balancePending || 0)),
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

  // Complete Trip & Settle Meter Reading with Zero Double-Counting
  const completeTripAndSettle = (bookingId, settlementData) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    const {
      startKm,
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

    // Zero Double-Counting Fare Formula:
    // Base Fare + Actual Extra KM Charges + Actual Driver Bata - Actual Discount
    const baseFare = Number(targetBooking.baseFare || 0);
    const taxableAmount = Math.max(0, baseFare + Number(extraKmCharges || 0) + Number(driverBata || 0) - Number(discount || 0));
    const gstPercent = targetBooking.gstEnabled ? Number(targetBooking.gstPercent || 5) : 0;
    const gstAmount = Math.round(taxableAmount * (gstPercent / 100));
    const totalFare = taxableAmount + gstAmount + Number(tollParking || 0);

    const prevAdvance = Number(targetBooking.advancePaid || 0);
    const finalPaid = Number(finalPaidAmount || 0);
    const totalCollected = prevAdvance + finalPaid;
    const finalBalancePending = Math.max(0, totalFare - totalCollected);

    // 1. Update Booking
    const updatedBooking = {
      ...targetBooking,
      status: 'Completed',
      actualEndDateTime: new Date().toISOString(),
      startKm: Number(startKm || targetBooking.startKm || 0),
      endKm: Number(endKm || 0),
      actualKm: Number(actualKm || 0),
      extraKmCharges: Number(extraKmCharges || 0),
      driverBata: Number(driverBata || targetBooking.driverBata || 0),
      tollParking: Number(tollParking || 0),
      discount: Number(discount || 0),
      taxableAmount,
      gstAmount,
      totalFare,
      advancePaid: totalCollected,
      balancePending: finalBalancePending,
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
    if (finalPaid > 0) {
      recordTransaction({
        type: 'Income',
        category: 'Trip Final Settlement',
        amount: finalPaid,
        paymentMode: settlementPaymentMode || 'Cash',
        bookingId: targetBooking.id,
        vehicleId: targetBooking.vehicleId,
        vehiclePlate: targetBooking.vehiclePlate,
        customerName: targetBooking.customerName,
        notes: settlementNotes || `Final meter settlement for trip ${targetBooking.id}`
      });
    }

    // 5. Update Customer Pending Balance in CRM (Deduct old pending, add actual remaining)
    const prevBookingPending = Number(targetBooking.balancePending || 0);
    const balanceDelta = finalBalancePending - prevBookingPending;

    setCustomers(prev => prev.map(c => {
      if (c.name.toLowerCase() === targetBooking.customerName.toLowerCase() || c.phone === targetBooking.customerPhone) {
        return {
          ...c,
          pendingBalance: Math.max(0, (c.pendingBalance || 0) + balanceDelta)
        };
      }
      return c;
    }));

    return updatedBooking;
  };

  // Update Trip Status Lifecycle & Handle Trip Cancellations Cleanly
  const updateBookingStatus = (bookingId, newStatus, extraData = {}) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    setBookings(prev => {
      return prev.map(b => {
        if (b.id !== bookingId) return b;
        return { ...b, status: newStatus, ...extraData };
      });
    });

    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      // Free Vehicle
      if (targetBooking.vehicleId) {
        setVehicles(vPrev => vPrev.map(v => v.id === targetBooking.vehicleId ? { ...v, status: 'Free' } : v));
      }
      // Free Driver
      if (targetBooking.driverId) {
        setDrivers(dPrev => dPrev.map(d => d.id === targetBooking.driverId ? { ...d, status: 'Available' } : d));
      }

      // If Cancelled, reverse any customer pending dues in CRM
      if (newStatus === 'Cancelled' && Number(targetBooking.balancePending || 0) > 0) {
        setCustomers(cPrev => cPrev.map(c => {
          if (c.name.toLowerCase() === targetBooking.customerName.toLowerCase() || c.phone === targetBooking.customerPhone) {
            return {
              ...c,
              pendingBalance: Math.max(0, (c.pendingBalance || 0) - Number(targetBooking.balancePending || 0))
            };
          }
          return c;
        }));

        // Record cancellation note in ledger
        recordTransaction({
          type: 'Expense',
          category: 'Trip Cancellation',
          amount: 0,
          paymentMode: 'System',
          bookingId: targetBooking.id,
          vehiclePlate: targetBooking.vehiclePlate,
          customerName: targetBooking.customerName,
          notes: extraData.cancelReason || `Trip ${targetBooking.id} cancelled. Customer pending dues reversed.`
        });
      }
    } else if (newStatus === 'Ongoing') {
      if (targetBooking.vehicleId) {
        setVehicles(vPrev => vPrev.map(v => v.id === targetBooking.vehicleId ? { ...v, status: 'On Trip' } : v));
      }
      if (targetBooking.driverId) {
        setDrivers(dPrev => dPrev.map(d => d.id === targetBooking.driverId ? { ...d, status: 'On Trip' } : d));
      }
    }
  };

  // Direct manual Odometer update helper
  const updateVehicleOdometer = (vehicleId, newOdo) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, odometer: Number(newOdo) };
      }
      return v;
    }));
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

  // Vehicle Service & Maintenance Scheduler
  const updateVehicleServiceSchedule = (vehicleId, serviceData) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      return {
        ...v,
        lastServiceOdometer: serviceData.lastServiceOdometer || v.odometer,
        nextServiceDueOdometer: serviceData.nextServiceDueOdometer || (v.odometer + 10000),
        lastServiceDate: serviceData.lastServiceDate || new Date().toISOString().split('T')[0],
        lastServiceType: serviceData.lastServiceType || 'General Service',
        lastServiceCost: serviceData.lastServiceCost || 0,
        lastWorkshop: serviceData.lastWorkshop || ''
      };
    }));
  };

  // Periodic Service Alerts Checker
  const getServiceAlerts = () => {
    const alerts = [];
    vehicles.forEach(veh => {
      const currentOdo = Number(veh.odometer || 0);
      const nextDue = Number(veh.nextServiceDueOdometer || (veh.lastServiceOdometer ? veh.lastServiceOdometer + 10000 : 70000));
      const kmRemaining = nextDue - currentOdo;

      if (kmRemaining <= 1500) {
        alerts.push({
          vehicleId: veh.id,
          vehiclePlate: veh.plate,
          vehicleModel: `${veh.brand} ${veh.model}`,
          currentOdometer: currentOdo,
          nextDueOdometer: nextDue,
          kmRemaining,
          isOverdue: kmRemaining <= 0,
          isUrgent: kmRemaining <= 500,
          serviceType: veh.lastServiceType || 'Engine Oil & 10K Service'
        });
      }
    });
    return alerts.sort((a, b) => a.kmRemaining - b.kmRemaining);
  };

  // 6-Point Vehicle Handover Inspection Saver
  const saveVehicleInspection = (bookingId, inspectionData) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        inspectionData
      };
    }));
  };

  // Digital Signature Saver (Customer / Driver)
  const saveDigitalSignature = (bookingId, signatureDataUrl, type = 'customer') => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        customerSignature: type === 'customer' ? signatureDataUrl : b.customerSignature,
        driverSignature: type === 'driver' ? signatureDataUrl : b.driverSignature,
        signedAt: new Date().toISOString()
      };
    }));
  };

  // WhatsApp Booking Text Heuristic / Regex Parser
  const parseWhatsAppBookingText = (text) => {
    if (!text) return null;
    const result = {
      customerName: '',
      customerPhone: '',
      pickupLocation: '',
      dropLocation: '',
      tripType: 'Outstation',
      category: 'Sedan',
      startDateTime: '',
      endDateTime: '',
      estimatedKm: 300,
      baseFare: 0,
      notes: ''
    };

    const raw = text.trim();

    // 1. Phone number match
    const phoneMatch = raw.match(/(?:\+91[\s-]?)?([6-9]\d{9})/);
    if (phoneMatch) {
      result.customerPhone = phoneMatch[1];
    }

    // 2. Customer name match
    const nameMatch = raw.match(/(?:guest|client|customer|mr\.?|mrs\.?|name)\s*[:\-]?\s*([a-zA-Z\s]{3,25})/i);
    if (nameMatch) {
      result.customerName = nameMatch[1].trim();
    }

    // 3. Route match (e.g. Pune to Shirdi, Mumbai -> Goa)
    const routeMatch = raw.match(/([a-zA-Z\s]{3,20}?)\s*(?:to|->|➔|--)\s*([a-zA-Z\s]{3,20}?)(?:[,\n\.]|\d|\s+(?:innova|ertiga|crysta|sedan|car|cab|on|date|rate|fare))/i);
    if (routeMatch) {
      result.pickupLocation = routeMatch[1].trim();
      result.dropLocation = routeMatch[2].trim();
    } else {
      const pickupMatch = raw.match(/pickup\s*[:\-]?\s*([a-zA-Z0-9\s]+?)(?:[,\n]|drop)/i);
      const dropMatch = raw.match(/drop\s*[:\-]?\s*([a-zA-Z0-9\s]+?)(?:[,\n]|$)/i);
      if (pickupMatch) result.pickupLocation = pickupMatch[1].trim();
      if (dropMatch) result.dropLocation = dropMatch[1].trim();
    }

    // 4. Vehicle category detection
    if (/innova|crysta|ertiga|marazzo|muv|7\s*seater/i.test(raw)) {
      result.category = 'MUV';
    } else if (/suv|scorpio|harrier|xuv|creta|nexon/i.test(raw)) {
      result.category = 'SUV';
    } else if (/ev|electric|nexon\s*ev/i.test(raw)) {
      result.category = 'EV';
    } else if (/dzire|aura|etios|amaze|sedan/i.test(raw)) {
      result.category = 'Sedan';
    }

    // 5. Trip type detection
    if (/airport|t1|t2|flight/i.test(raw)) {
      result.tripType = 'Airport';
    } else if (/local|hourly|8hr|8\s*hours|package/i.test(raw)) {
      result.tripType = 'Local';
    } else if (/self\s*drive|rental|rent/i.test(raw)) {
      result.tripType = 'Rental';
    } else {
      result.tripType = 'Outstation';
    }

    // 6. Rate / Fare extraction
    const fareMatch = raw.match(/(?:rate|fare|budget|rs\.?|₹|inr)\s*[:\-]?\s*(\d{1,6})(?:\s*k)?/i);
    if (fareMatch) {
      let fareVal = Number(fareMatch[1]);
      if (raw.toLowerCase().includes(fareMatch[1] + 'k')) fareVal *= 1000;
      if (fareVal >= 500) {
        result.baseFare = fareVal;
      }
    }

    // 7. Date extraction
    const dateNumMatch = raw.match(/(\d{1,2})[\/\-\. ]([a-zA-Z]{3,9}|\d{1,2})/);
    if (dateNumMatch) {
      const today = new Date();
      const day = parseInt(dateNumMatch[1], 10);
      const targetDate = new Date(today.getFullYear(), today.getMonth(), day, 8, 0, 0);
      if (targetDate.getTime() < today.getTime()) {
        targetDate.setMonth(today.getMonth() + 1);
      }
      result.startDateTime = targetDate.toISOString().slice(0, 16);
      const end = new Date(targetDate.getTime() + 86400000 * 2);
      result.endDateTime = end.toISOString().slice(0, 16);
    }

    result.notes = `Auto-parsed from WhatsApp:\n"${raw.slice(0, 100)}..."`;
    return result;
  };

  // Staff / RBAC Role Switcher
  const switchStaffRole = (role = 'owner') => {
    if (!authUser) return;
    setAuthUser(prev => ({
      ...prev,
      role
    }));
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

    // Dynamic Chronological Trend Series Engine (Aggregates real bookings & expenses)
    let trendSeries = [];

    const formatShortDate = (d) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${d.getDate()} ${months[d.getMonth()]}`;
    };

    if (period === '7d') {
      // 7 Daily Bins
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = d.toISOString().split('T')[0];
        const label = formatShortDate(d);

        const binBookings = filteredBookings.filter(b => (b.startDateTime || b.createdAt || '').startsWith(dateStr));
        const binExpenses = filteredExpenses.filter(e => (e.date || '').startsWith(dateStr));

        const rev = binBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
        const exp = binExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        trendSeries.push({
          label,
          revenue: rev,
          expense: exp,
          profit: rev - exp
        });
      }
    } else if (period === '30d') {
      // 6 Bins of 5 Days
      for (let i = 5; i >= 0; i--) {
        const binStart = new Date(now.getTime() - (i * 5 + 4) * 24 * 60 * 60 * 1000);
        const binEnd = new Date(now.getTime() - (i * 5) * 24 * 60 * 60 * 1000);
        const label = `${formatShortDate(binStart).split(' ')[0]}-${formatShortDate(binEnd)}`;

        const binBookings = filteredBookings.filter(b => {
          const bDate = new Date(b.startDateTime || b.createdAt || '2026-08-01');
          return bDate >= binStart && bDate <= binEnd;
        });
        const binExpenses = filteredExpenses.filter(e => {
          const eDate = new Date(e.date || '2026-08-01');
          return eDate >= binStart && eDate <= binEnd;
        });

        const rev = binBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
        const exp = binExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        trendSeries.push({
          label,
          revenue: rev,
          expense: exp,
          profit: rev - exp
        });
      }
    } else if (period === '90d') {
      // 6 Bins of 15 Days
      for (let i = 5; i >= 0; i--) {
        const binStart = new Date(now.getTime() - (i * 15 + 14) * 24 * 60 * 60 * 1000);
        const binEnd = new Date(now.getTime() - (i * 15) * 24 * 60 * 60 * 1000);
        const label = `${formatShortDate(binStart).slice(0, 6)}`;

        const binBookings = filteredBookings.filter(b => {
          const bDate = new Date(b.startDateTime || b.createdAt || '2026-08-01');
          return bDate >= binStart && bDate <= binEnd;
        });
        const binExpenses = filteredExpenses.filter(e => {
          const eDate = new Date(e.date || '2026-08-01');
          return eDate >= binStart && eDate <= binEnd;
        });

        const rev = binBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
        const exp = binExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        trendSeries.push({
          label,
          revenue: rev,
          expense: exp,
          profit: rev - exp
        });
      }
    } else if (period === '6m') {
      // 6 Monthly Bins
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 5; i >= 0; i--) {
        const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const label = monthNames[targetMonth.getMonth()];

        const binBookings = filteredBookings.filter(b => {
          const bDate = new Date(b.startDateTime || b.createdAt || '2026-08-01');
          return bDate >= targetMonth && bDate <= monthEnd;
        });
        const binExpenses = filteredExpenses.filter(e => {
          const eDate = new Date(e.date || '2026-08-01');
          return eDate >= targetMonth && eDate <= monthEnd;
        });

        const rev = binBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0);
        const exp = binExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

        trendSeries.push({
          label,
          revenue: rev,
          expense: exp,
          profit: rev - exp
        });
      }
    } else {
      // 1 Year / All-Time (Quarterly or Bi-monthly Bins)
      const quarters = ['Q3 \'25', 'Q4 \'25', 'Q1 \'26', 'Q2 \'26', 'Jul \'26', 'Aug \'26'];
      trendSeries = quarters.map((lbl, qIdx) => {
        const binBookings = filteredBookings.filter((b, bIdx) => (bIdx % quarters.length) === qIdx);
        const binExpenses = filteredExpenses.filter((e, eIdx) => (eIdx % quarters.length) === qIdx);

        const rev = binBookings.reduce((sum, b) => sum + Number(b.totalFare || 0), 0) || Math.round(grossRevenue / quarters.length);
        const exp = binExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0) || Math.round(totalExpenses / quarters.length);

        return {
          label: lbl,
          revenue: rev,
          expense: exp,
          profit: rev - exp
        };
      });
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

  // Phone Number Sanitizer & Formatter (Prevents duplicate +91 prefixes)
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const str = String(phone).trim();
    // Clean out any repeating +91 prefix
    let cleaned = str.replace(/^(\+91\s*)+/i, '').trim();
    // Also remove leading 91 if full 12 digits
    const pureDigits = cleaned.replace(/\D/g, '');
    if (pureDigits.length === 12 && pureDigits.startsWith('91')) {
      const ten = pureDigits.slice(2);
      return `+91 ${ten.slice(0, 5)} ${ten.slice(5, 10)}`;
    }
    if (pureDigits.length === 10) {
      return `+91 ${pureDigits.slice(0, 5)} ${pureDigits.slice(5, 10)}`;
    }
    if (pureDigits.length > 0) {
      return `+91 ${cleaned}`;
    }
    return str;
  };

  // Add Driver
  const addDriver = (driverData) => {
    const cleanPhone = formatPhoneNumber(driverData.phone);
    const newDrv = {
      ...driverData,
      phone: cleanPhone,
      whatsapp: driverData.whatsapp ? formatPhoneNumber(driverData.whatsapp) : cleanPhone,
      id: `drv-${Date.now().toString().slice(-4)}`,
      status: driverData.status || 'Available',
      dlExpiry: driverData.dlExpiry || '2028-01-01'
    };
    setDrivers(prev => [newDrv, ...prev]);
  };

  // Update Driver
  const updateDriver = (driverId, updatedData) => {
    const cleanPhone = updatedData.phone ? formatPhoneNumber(updatedData.phone) : undefined;
    const cleanWhatsapp = updatedData.whatsapp ? formatPhoneNumber(updatedData.whatsapp) : (cleanPhone || undefined);

    let oldDrv = null;
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        oldDrv = d;
        return {
          ...d,
          ...updatedData,
          phone: cleanPhone || d.phone,
          whatsapp: cleanWhatsapp || d.whatsapp
        };
      }
      return d;
    }));

    // Update associated bookings if driver name or phone changed
    if (oldDrv && (updatedData.name || cleanPhone)) {
      setBookings(prev => prev.map(b => {
        if (b.driverId === driverId || (oldDrv.name && b.driverName === oldDrv.name)) {
          return {
            ...b,
            driverName: updatedData.name || b.driverName,
            driverPhone: cleanPhone || b.driverPhone
          };
        }
        return b;
      }));
    }
  };

  // Delete Driver
  const deleteDriver = (driverId) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  // Add Customer
  const addCustomer = (customerData) => {
    const cleanPhone = formatPhoneNumber(customerData.phone);
    const newCust = {
      ...customerData,
      phone: cleanPhone,
      whatsapp: customerData.whatsapp ? formatPhoneNumber(customerData.whatsapp) : cleanPhone,
      id: `cust-${Date.now().toString().slice(-4)}`,
      totalBookings: 0,
      pendingBalance: 0
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  // Update Customer
  const updateCustomer = (customerId, updatedData) => {
    const cleanPhone = updatedData.phone ? formatPhoneNumber(updatedData.phone) : undefined;
    const cleanWhatsapp = updatedData.whatsapp ? formatPhoneNumber(updatedData.whatsapp) : (cleanPhone || undefined);

    let oldCust = null;
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        oldCust = c;
        return {
          ...c,
          ...updatedData,
          phone: cleanPhone || c.phone,
          whatsapp: cleanWhatsapp || c.whatsapp
        };
      }
      return c;
    }));

    // Update associated bookings if customer name or phone changed
    if (oldCust && (updatedData.name || cleanPhone)) {
      setBookings(prev => prev.map(b => {
        if (b.customerId === customerId || (oldCust.name && b.customerName === oldCust.name)) {
          return {
            ...b,
            customerName: updatedData.name || b.customerName,
            customerPhone: cleanPhone || b.customerPhone
          };
        }
        return b;
      }));
    }
  };

  // Delete Customer
  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
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
    const rawInputPhone = (userData.phone || '').replace(/\D/g, '');
    
    // Auto-detect if phone belongs to a Driver in the fleet
    const matchedDriver = drivers.find(d => {
      const cleanDrvPhone = (d.phone || '').replace(/\D/g, '');
      return cleanDrvPhone.endsWith(rawInputPhone.slice(-10)) || (rawInputPhone.length >= 10 && cleanDrvPhone.includes(rawInputPhone.slice(-10)));
    });

    if (matchedDriver) {
      const driverUser = {
        role: 'driver',
        driverId: matchedDriver.id,
        name: matchedDriver.name,
        phone: matchedDriver.phone,
        businessName: business.name || 'Shree Ganesh Tours & Travels',
        city: business.city || 'Pune, MH',
        payoutType: matchedDriver.payoutType || 'Salary',
        token: `gd_driver_token_${Date.now()}`,
        isDemo: Boolean(userData.isDemo)
      };
      setAuthUser(driverUser);
      setDriverActiveTab('duty');
      setIsAuthModalOpen(false);
      return driverUser;
    }

    // Otherwise login as Fleet Owner
    const ownerUser = {
      role: 'owner',
      name: userData.name || business.ownerName || 'Fleet Owner',
      phone: userData.phone || '9822012345',
      businessName: userData.businessName || business.name || 'My Fleet & Travels',
      city: userData.city || business.city || 'Maharashtra',
      plan: userData.plan || business.membershipPlan || 'Starter (5 Cars)',
      membershipStatus: 'Active',
      token: `gd_token_${Date.now()}`,
      isDemo: Boolean(userData.isDemo)
    };
    setAuthUser(ownerUser);
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
    return ownerUser;
  };

  const registerUser = (registrationData) => {
    const user = {
      role: 'owner',
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
      role: 'owner',
      name: 'Ramesh Gaikwad',
      phone: '9822012345',
      businessName: 'Shree Ganesh Tours & Travels',
      city: 'Pune, MH',
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

  const quickDriverLogin = (driverId = 'drv-01') => {
    const driver = drivers.find(d => d.id === driverId) || drivers[0];
    const driverUser = {
      role: 'driver',
      driverId: driver.id,
      name: driver.name,
      phone: driver.phone,
      businessName: business.name || 'Shree Ganesh Tours & Travels',
      city: business.city || 'Pune, MH',
      payoutType: driver.payoutType || 'Salary',
      token: `gd_driver_demo_${driver.id}`,
      isDemo: true
    };
    setAuthUser(driverUser);
    setDriverActiveTab('duty');
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setAuthUser(null);
    setIsAuthModalOpen(false);
    setActiveTab('home');
    setDriverActiveTab('duty');
  };

  // Driver Actions & Helpers
  const startDriverTrip = (bookingId, startKm, startPhotoUrl = '') => {
    const numStartKm = Number(startKm);
    let targetVehicleId = null;
    let updatedBooking = null;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        targetVehicleId = b.vehicleId;
        updatedBooking = {
          ...b,
          status: 'Ongoing',
          startOdometer: numStartKm,
          startKm: numStartKm,
          startPhotoUrl: startPhotoUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          startedAt: new Date().toISOString()
        };
        return updatedBooking;
      }
      return b;
    }));

    if (targetVehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetVehicleId) {
          return { ...v, status: 'On Trip', odometer: numStartKm };
        }
        return v;
      }));
    }

    if (authUser?.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === authUser.driverId) {
          return { ...d, status: 'On Trip' };
        }
        return d;
      }));
    }

    return updatedBooking;
  };

  const addDriverTripExpense = (bookingId, expenseData) => {
    const newExp = {
      id: `exp-${Date.now().toString().slice(-6)}`,
      type: expenseData.type || 'Toll',
      category: 'On-Trip Highway Expense',
      amount: Number(expenseData.amount || 0),
      vehicleId: expenseData.vehicleId,
      bookingId: bookingId,
      driverId: authUser?.driverId,
      paidBy: 'Driver',
      date: new Date().toISOString().split('T')[0],
      notes: expenseData.notes || `${expenseData.type} paid by driver during trip`,
      receiptPhoto: expenseData.receiptPhoto || null
    };

    setExpenses(prev => [newExp, ...prev]);

    if (expenseData.type === 'Toll' || expenseData.type === 'Parking') {
      setBookings(prev => prev.map(b => {
        if (b.id === bookingId) {
          const currentToll = Number(b.tollParking || 0);
          const addedToll = Number(expenseData.amount || 0);
          const newToll = currentToll + addedToll;
          const newGross = Number(b.taxableAmount || 0) + Number(b.gstAmount || 0) + newToll;
          const newPending = Math.max(0, newGross - Number(b.advancePaid || 0));
          return {
            ...b,
            tollParking: newToll,
            totalFare: newGross,
            balancePending: newPending
          };
        }
        return b;
      }));
    }

    return newExp;
  };

  const completeDriverTrip = (bookingId, settlementData) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return null;

    const numEndKm = Number(settlementData.endKm);
    const numStartKm = Number(targetBooking.startKm || targetBooking.startOdometer || 0);
    const actualKm = Math.max(0, numEndKm - numStartKm);
    const estimatedKm = Number(targetBooking.estimatedKm || 0);
    const ratePerKm = Number(targetBooking.ratePerKm || 14);
    const extraKm = Math.max(0, actualKm - estimatedKm);
    const extraKmCharges = extraKm * ratePerKm;

    const baseFare = Number(targetBooking.baseFare || 0);
    const driverBata = Number(settlementData.driverBata ?? targetBooking.driverBata ?? 0);
    const tollParking = Number(settlementData.tollParking ?? targetBooking.tollParking ?? 0);
    const discount = Number(settlementData.discount || 0);

    const taxableAmount = baseFare + extraKmCharges + driverBata - discount;
    const gstAmount = targetBooking.gstEnabled ? Math.round(taxableAmount * ((targetBooking.gstPercent || 5) / 100)) : 0;
    const grossTotal = taxableAmount + gstAmount + tollParking;
    const advancePaid = Number(targetBooking.advancePaid || 0);
    const netDue = Math.max(0, grossTotal - advancePaid);
    const finalPaidAmount = Number(settlementData.finalPaidAmount ?? netDue);
    const balanceRemaining = Math.max(0, netDue - finalPaidAmount);
    const paymentMode = settlementData.paymentMode || 'Cash';

    const completedBooking = {
      ...targetBooking,
      startKm: numStartKm,
      endKm: numEndKm,
      actualKm,
      extraKm,
      extraKmCharges,
      driverBata,
      tollParking,
      discount,
      taxableAmount,
      gstAmount,
      totalFare: grossTotal,
      finalPaidAmount,
      balancePending: balanceRemaining,
      settlementPaymentMode: paymentMode,
      settlementNotes: settlementData.notes || `Completed by driver. Meter: ${numStartKm} to ${numEndKm} KM`,
      status: 'Completed',
      completedAt: new Date().toISOString()
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? completedBooking : b));

    if (targetBooking.vehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetBooking.vehicleId) {
          return { ...v, status: 'Free', odometer: numEndKm };
        }
        return v;
      }));
    }

    if (targetBooking.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === targetBooking.driverId) {
          return { ...d, status: 'Available' };
        }
        return d;
      }));
    }

    if (finalPaidAmount > 0) {
      recordTransaction({
        bookingId: targetBooking.id,
        invoiceNumber: targetBooking.invoiceNumber,
        type: 'income',
        category: 'Trip Balance Collection',
        amount: finalPaidAmount,
        paymentMode: paymentMode,
        customerName: targetBooking.customerName,
        description: `Balance collected by driver ${targetBooking.driverName || ''} (${paymentMode})`,
        date: new Date().toISOString().split('T')[0]
      });
    }

    return completedBooking;
  };

  const submitDriverCash = (driverId, amount, notes = '') => {
    const numAmt = Number(amount);
    if (numAmt <= 0) return;

    const driver = drivers.find(d => d.id === driverId);
    const driverName = driver?.name || 'Driver';

    recordTransaction({
      type: 'income',
      category: 'Driver Cash Handover',
      amount: numAmt,
      paymentMode: 'Cash',
      customerName: driverName,
      description: `Cash handover from driver ${driverName}: ${notes || 'Daily settlement'}`,
      date: new Date().toISOString().split('T')[0]
    });

    const submissionRecord = {
      id: `sub-${Date.now().toString().slice(-6)}`,
      driverId,
      amount: numAmt,
      date: new Date().toISOString(),
      notes: notes || 'Office Cash Handover'
    };

    const existingSubs = JSON.parse(localStorage.getItem('gd_driver_submissions') || '[]');
    localStorage.setItem('gd_driver_submissions', JSON.stringify([submissionRecord, ...existingSubs]));

    return submissionRecord;
  };

  const updateDriverStatus = (driverId, status) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status } : d));
  };

  const getDriverActiveTrip = (driverId) => {
    if (!driverId) return null;
    const ongoing = bookings.find(b => b.driverId === driverId && b.status === 'Ongoing');
    if (ongoing) return ongoing;
    return bookings.find(b => b.driverId === driverId && (b.status === 'Driver Assigned' || b.status === 'Confirmed')) || null;
  };

  const getDriverTrips = (driverId) => {
    if (!driverId) return [];
    return bookings.filter(b => b.driverId === driverId).sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime));
  };

  const getDriverCashStats = (driverId) => {
    if (!driverId) return { cashCollected: 0, totalBata: 0, reimbursableExpenses: 0, cashSubmitted: 0, netCashDue: 0 };
    
    const driverBookings = bookings.filter(b => b.driverId === driverId);
    let cashCollected = 0;
    let totalBata = 0;

    driverBookings.forEach(b => {
      if (b.advanceMode === 'Cash') {
        cashCollected += Number(b.advancePaid || 0);
      }
      if (b.status === 'Completed' && (b.settlementPaymentMode === 'Cash' || (!b.settlementPaymentMode && b.advanceMode === 'Cash'))) {
        cashCollected += Number(b.finalPaidAmount || b.balancePending || 0);
      }
      if (b.status === 'Completed' || b.status === 'Ongoing') {
        totalBata += Number(b.driverBata || 0);
      }
    });

    const driverExps = expenses.filter(e => e.driverId === driverId && e.paidBy === 'Driver');
    const reimbursableExpenses = driverExps.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const subs = JSON.parse(localStorage.getItem('gd_driver_submissions') || '[]');
    const driverSubs = subs.filter(s => s.driverId === driverId);
    const cashSubmitted = driverSubs.reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const netCashDue = Math.max(0, cashCollected - totalBata - reimbursableExpenses - cashSubmitted);

    return {
      cashCollected,
      totalBata,
      reimbursableExpenses,
      cashSubmitted,
      netCashDue
    };
  };

  const getDriverVehicle = (driverId) => {
    if (!driverId) return null;
    const activeTrip = getDriverActiveTrip(driverId);
    if (activeTrip && activeTrip.vehicleId) {
      return vehicles.find(v => v.id === activeTrip.vehicleId) || null;
    }
    return vehicles[0] || null;
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
    quickDriverLogin,
    logoutUser,
    driverActiveTab,
    setDriverActiveTab,
    driverTollModalBooking,
    setDriverTollModalBooking,
    driverUpiModalData,
    setDriverUpiModalData,
    startDriverTrip,
    addDriverTripExpense,
    completeDriverTrip,
    submitDriverCash,
    updateDriverStatus,
    getDriverActiveTrip,
    getDriverTrips,
    getDriverCashStats,
    getDriverVehicle,
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
    updateVehicleOdometer,
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
    updateDriver,
    deleteDriver,
    addCustomer,
    updateCustomer,
    isQuickQuoteOpen,
    setIsQuickQuoteOpen,
    selectedCorporateCustomer,
    setSelectedCorporateCustomer,
    isCaExportOpen,
    setIsCaExportOpen,
    isPublicSiteOpen,
    setIsPublicSiteOpen,
    serviceModalVehicle,
    setServiceModalVehicle,
    inspectionModalBooking,
    setInspectionModalBooking,
    parseWhatsAppBookingText,
    updateVehicleServiceSchedule,
    getServiceAlerts,
    saveVehicleInspection,
    saveDigitalSignature,
    switchStaffRole,
    currentStaffRole: authUser?.role || 'Owner',
    readNotificationIds,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    getSmartNotifications,
    getUnreadNotificationCount,
    formatCurrency,
    formatPhoneNumber
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
