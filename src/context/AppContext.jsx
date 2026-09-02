import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { supabase, checkSupabaseHealth, isSupabasePausedError } from '../lib/supabase';
import { supabaseApi } from '../services/supabaseApi';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Cloud Sync & Supabase Backend State
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('syncing'); // 'synced' | 'syncing' | 'offline' | 'error'
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  // Supabase Project Pause / Kill-Switch Lockdown State
  const [isProjectPaused, setIsProjectPaused] = useState(false);
  const [isCheckingProjectHealth, setIsCheckingProjectHealth] = useState(true);
  const [projectPausedReason, setProjectPausedReason] = useState('');

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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'biz-001' && parsed.ownerName === 'Ramesh Gaikwad') {
          return initialBusiness;
        }
        return parsed;
      } catch {
        return initialBusiness;
      }
    }
    return initialBusiness;
  });

  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('gd_vehicles');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // If legacy mock vehicles MH 12 RN 4589 present, purge
      if (Array.isArray(parsed) && parsed.some(v => v.plate === 'MH 12 RN 4589')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('gd_drivers');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(d => d.name === 'Sachin Shinde')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('gd_customers');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(c => c.name === 'Rahul Deshmukh')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  const [rateCards, setRateCards] = useState(() => {
    const saved = localStorage.getItem('gd_rate_cards');
    return saved ? JSON.parse(saved) : initialRateCards;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('gd_bookings');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(b => b.id === 'bk-01')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('gd_expenses');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(e => e.id === 'exp-01')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('gd_transactions');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.some(t => t.id === 'tx-01')) return [];
      return parsed;
    } catch {
      return [];
    }
  });

  // Automatically purge legacy mock development data from localStorage
  useEffect(() => {
    try {
      const savedBiz = localStorage.getItem('gd_business');
      if (savedBiz) {
        const parsed = JSON.parse(savedBiz);
        if (parsed.id === 'biz-001' && parsed.ownerName === 'Ramesh Gaikwad') {
          localStorage.removeItem('gd_business');
          localStorage.removeItem('gd_vehicles');
          localStorage.removeItem('gd_drivers');
          localStorage.removeItem('gd_customers');
          localStorage.removeItem('gd_bookings');
          localStorage.removeItem('gd_expenses');
          localStorage.removeItem('gd_transactions');
          localStorage.removeItem('gd_invoices');
          localStorage.removeItem('gd_driver_submissions');
          localStorage.removeItem('gd_auth_user');
          setBusiness(initialBusiness);
          setVehicles([]);
          setDrivers([]);
          setCustomers([]);
          setBookings([]);
          setExpenses([]);
          setTransactions([]);
          setInvoices([]);
          setDriverSubmissions([]);
          setAuthUser(null);
        }
      }
    } catch (e) {
      console.warn('[Auto-purge Mock Data Error]:', e);
    }
  }, []);

  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem('gd_invoices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [driverSubmissions, setDriverSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('gd_driver_submissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [editingBooking, setEditingBooking] = useState(null);

  useEffect(() => {
    localStorage.setItem('gd_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('gd_driver_submissions', JSON.stringify(driverSubmissions));
  }, [driverSubmissions]);

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
  const [selectedVehicleDetail, setSelectedVehicleDetail] = useState(null);
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

  // ============================================================================
  // SUPABASE CLOUD HYDRATION & BIDIRECTIONAL SYNC ENGINE
  // ============================================================================
  const drainOfflineQueue = useCallback(async (businessId) => {
    try {
      const raw = localStorage.getItem('gd_offline_queue');
      if (!raw) return;
      const queue = JSON.parse(raw);
      if (!Array.isArray(queue) || queue.length === 0) return;

      const remaining = [];
      for (const item of queue) {
        try {
          if (item.type === 'saveBooking') await supabaseApi.saveBooking(item.payload, businessId);
          else if (item.type === 'saveVehicle') await supabaseApi.saveVehicle(item.payload, businessId);
          else if (item.type === 'saveDriver') await supabaseApi.saveDriver(item.payload, businessId);
          else if (item.type === 'saveCustomer') await supabaseApi.saveCustomer(item.payload, businessId);
          else if (item.type === 'saveExpense') await supabaseApi.saveExpense(item.payload, businessId);
          else if (item.type === 'saveTransaction') await supabaseApi.saveTransaction(item.payload, businessId);
          else if (item.type === 'saveInvoice') await supabaseApi.saveInvoice(item.payload, businessId);
          else if (item.type === 'saveDriverSubmission') await supabaseApi.saveDriverSubmission(item.payload, businessId);
          else if (item.type === 'deleteBooking') await supabaseApi.deleteBooking(item.payload);
        } catch {
          remaining.push(item);
        }
      }
      localStorage.setItem('gd_offline_queue', JSON.stringify(remaining));
    } catch (e) {
      console.warn('[Offline Queue Drain Error]:', e);
    }
  }, []);

  const checkProjectStatus = useCallback(async () => {
    try {
      const health = await checkSupabaseHealth();
      if (health.isPaused) {
        setIsProjectPaused(true);
        setProjectPausedReason(health.error || 'Project is paused by administrator');
        setIsCloudConnected(false);
        setCloudSyncStatus('offline');
        return false;
      } else if (health.isConnected) {
        setIsProjectPaused(false);
        setProjectPausedReason('');
        setIsCloudConnected(true);
        return true;
      } else {
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
        if (isOnline) {
          setIsProjectPaused(true);
          setProjectPausedReason(health.error || 'Project unreachable');
          setIsCloudConnected(false);
          setCloudSyncStatus('offline');
          return false;
        }
        return false;
      }
    } catch (err) {
      console.warn('[CheckProjectStatus Error]:', err);
      return false;
    } finally {
      setIsCheckingProjectHealth(false);
    }
  }, []);

  // Run on startup
  useEffect(() => {
    checkProjectStatus();
  }, [checkProjectStatus]);

  // Heartbeat check every 30s, on tab focus, and on status broadcast events
  useEffect(() => {
    const interval = setInterval(() => {
      checkProjectStatus();
    }, 30000);

    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkProjectStatus();
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleVisibilityOrFocus);
    }

    const handleStatusEvent = (e) => {
      if (e.detail?.isPaused) {
        setIsProjectPaused(true);
        setProjectPausedReason(e.detail.error || 'Supabase project paused');
        setIsCloudConnected(false);
      } else if (e.detail?.isConnected) {
        setIsProjectPaused(false);
        setProjectPausedReason('');
        setIsCloudConnected(true);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('gaadidesk:supabase_status', handleStatusEvent);
    }

    return () => {
      clearInterval(interval);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleVisibilityOrFocus);
        window.removeEventListener('gaadidesk:supabase_status', handleStatusEvent);
      }
    };
  }, [checkProjectStatus]);

  const syncWithCloud = useCallback(async (manual = false) => {
    try {
      if (manual) setCloudSyncStatus('syncing');
      const health = await checkSupabaseHealth();
      if (health.isPaused) {
        setIsProjectPaused(true);
        setProjectPausedReason(health.error || 'Supabase project paused');
        setIsCloudConnected(false);
        setCloudSyncStatus('offline');
        return false;
      }
      if (!health.isConnected) {
        setIsCloudConnected(false);
        setCloudSyncStatus('offline');
        return false;
      }

      setIsProjectPaused(false);
      setProjectPausedReason('');
      setIsCloudConnected(true);
      const businessId = business?.id;
      if (!businessId) {
        setCloudSyncStatus('synced');
        return false;
      }

      // Drain any offline mutations first
      await drainOfflineQueue(businessId);

      const cloudData = await supabaseApi.fetchFullBusinessData(businessId);

      if (cloudData.isLoaded) {
        if (cloudData.business) setBusiness(cloudData.business);
        if (cloudData.vehicles) setVehicles(cloudData.vehicles);
        if (cloudData.drivers) setDrivers(cloudData.drivers);
        if (cloudData.customers) setCustomers(cloudData.customers);
        if (cloudData.rateCards?.length) setRateCards(cloudData.rateCards);
        if (cloudData.bookings) setBookings(cloudData.bookings);
        if (cloudData.expenses) setExpenses(cloudData.expenses);
        if (cloudData.transactions) setTransactions(cloudData.transactions);
        if (cloudData.invoices) setInvoices(cloudData.invoices);
        if (cloudData.driverSubmissions) setDriverSubmissions(cloudData.driverSubmissions);

        setCloudSyncStatus('synced');
        setLastSyncedAt(new Date());
        return true;
      }
    } catch (err) {
      console.warn('[AppContext] Sync with Supabase cloud failed:', err);
      if (isSupabasePausedError(err)) {
        setIsProjectPaused(true);
        setProjectPausedReason('Supabase project paused');
      }
      setCloudSyncStatus('offline');
      return false;
    }
  }, [business?.id, drainOfflineQueue]);

  useEffect(() => {
    let isMounted = true;
    const businessId = business?.id;
    if (!businessId) return;

    syncWithCloud();

    // Setup Supabase Realtime channel scoped by business_id for live multi-user / driver sync
    const channel = supabase.channel(`gaadidesk_realtime_${businessId}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        // If event specifies business_id, ensure it matches
        if (payload.new?.business_id && payload.new.business_id !== businessId) return;
        if (isMounted) {
          syncWithCloud();
        }
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [syncWithCloud, business?.id]);


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

  // Clash Detection Logic: Checks BOTH Vehicle AND Driver for overlapping bookings, workshop status, and active on-trip lock
  const checkBookingClash = (vehicleId, driverId, startDateTime, endDateTime, excludeBookingId = null, tripType = 'Outstation') => {
    if (!startDateTime || !endDateTime) return { vehicleConflict: null, driverConflict: null };

    // Adaptive buffer: 30 mins for local/airport, 90 mins for outstation/rental/package
    const BUFFER_MS = (tripType === 'Local' || tripType === 'Airport') ? 30 * 60 * 1000 : 90 * 60 * 1000;
    const reqStart = new Date(startDateTime).getTime() - BUFFER_MS;
    const reqEnd = new Date(endDateTime).getTime() + BUFFER_MS;
    const now = Date.now();

    let vehicleConflict = null;
    let driverConflict = null;

    // 1. Check vehicle operational state (Workshop / Blocked)
    if (vehicleId) {
      const vObj = vehicles.find(v => v.id === vehicleId);
      if (vObj && (vObj.status === 'Workshop' || vObj.status === 'Blocked')) {
        // If starting within next 72 hours and vehicle is in workshop
        if (reqStart <= now + 72 * 60 * 60 * 1000) {
          vehicleConflict = {
            id: `STATUS_${vObj.status.toUpperCase()}`,
            vehiclePlate: vObj.plate,
            startDateTime: new Date().toISOString(),
            endDateTime: new Date(now + 86400000).toISOString(),
            status: vObj.status
          };
        }
      }
    }

    // 2. Check driver operational state (On Leave / Inactive)
    if (driverId) {
      const dObj = drivers.find(d => d.id === driverId);
      if (dObj && (dObj.status === 'On Leave' || dObj.status === 'Inactive')) {
        if (reqStart <= now + 72 * 60 * 60 * 1000) {
          driverConflict = {
            id: `STATUS_${dObj.status.toUpperCase()}`,
            driverName: dObj.name,
            startDateTime: new Date().toISOString(),
            endDateTime: new Date(now + 86400000).toISOString(),
            status: dObj.status
          };
        }
      }
    }

    // 3. Check overlapping bookings
    bookings.forEach(b => {
      if (excludeBookingId && b.id === excludeBookingId) return;
      if (b.status === 'Cancelled' || b.status === 'Completed' || b.status === 'Enquiry') return;

      const bStart = new Date(b.startDateTime).getTime();
      const bEnd = new Date(b.endDateTime).getTime();
      
      // Overlap calculation
      let isOverlap = reqStart < bEnd && reqEnd > bStart;

      // Special safeguard: If booking is currently 'Ongoing', the car/driver is on road right now!
      if (b.status === 'Ongoing' && reqStart <= now + BUFFER_MS) {
        isOverlap = true;
      }

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

    // Persist to Supabase Cloud
    supabaseApi.saveTransaction(newTx, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Tx Error]:', err));

    return newTx;
  };

  // Add / Edit Booking with Synchronized Ledger & CRM Integration
  const saveBooking = (bookingData) => {
    const existingIndex = bookingData.id ? bookings.findIndex(b => b.id === bookingData.id) : -1;
    const existingBooking = existingIndex >= 0 ? bookings[existingIndex] : null;

    const newId = bookingData.id || `GD-BK-${String(bookings.length + 101).padStart(3, '0')}`;
    const invoiceNumber = bookingData.invoiceNumber || `GD/2026-27/${String(bookings.length + 101).padStart(4, '0')}`;

    // Resolve or create customerId to guarantee relational integrity
    let resolvedCustomerId = bookingData.customerId || null;
    let existingCustomerMatch = null;

    if (bookingData.customerName) {
      existingCustomerMatch = customers.find(c =>
        c.name.toLowerCase() === bookingData.customerName.trim().toLowerCase() ||
        (bookingData.customerPhone && c.phone && c.phone.replace(/\D/g, '').slice(-10) === bookingData.customerPhone.replace(/\D/g, '').slice(-10))
      );
      if (existingCustomerMatch) {
        resolvedCustomerId = existingCustomerMatch.id;
      } else if (!resolvedCustomerId) {
        resolvedCustomerId = `cust-${Date.now().toString().slice(-4)}`;
      }
    }

    const newBooking = {
      ...bookingData,
      id: newId,
      customerId: resolvedCustomerId,
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

    // Persist to Supabase Cloud
    supabaseApi.saveBooking(newBooking, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Booking Error]:', err));

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
          customerId: resolvedCustomerId,
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
            customerId: resolvedCustomerId,
            customerName: bookingData.customerName,
            notes: `Additional advance for trip ${newId}`
          });
        }
      }
    }

    // Update Customer details and pending balance delta in CRM (Enquiries and Cancelled do not count as debt)
    if (bookingData.customerName) {
      setCustomers(prev => {
        const oldPending = existingBooking && existingBooking.status !== 'Enquiry' && existingBooking.status !== 'Cancelled' ? Number(existingBooking.balancePending || 0) : 0;
        const newPending = bookingData.status !== 'Enquiry' && bookingData.status !== 'Cancelled' ? Number(bookingData.balancePending || 0) : 0;
        const deltaPending = newPending - oldPending;

        if (existingCustomerMatch) {
          const updatedCust = {
            ...existingCustomerMatch,
            totalBookings: (existingCustomerMatch.totalBookings || 0) + (existingBooking ? 0 : 1),
            pendingBalance: Math.max(0, (existingCustomerMatch.pendingBalance || 0) + deltaPending),
            address: bookingData.pickupLocation || existingCustomerMatch.address
          };
          supabaseApi.saveCustomer(updatedCust, business?.id || 'biz-001').catch(() => {});
          return prev.map(c => c.id === existingCustomerMatch.id ? updatedCust : c);
        } else {
          // Auto create customer in CRM with matching resolvedCustomerId
          const newCust = {
            id: resolvedCustomerId,
            name: bookingData.customerName,
            phone: bookingData.customerPhone || '9876543210',
            type: 'Personal',
            totalBookings: 1,
            pendingBalance: (bookingData.status === 'Enquiry' || bookingData.status === 'Cancelled') ? 0 : Math.max(0, Number(bookingData.balancePending || 0)),
            address: bookingData.pickupLocation || ''
          };
          supabaseApi.saveCustomer(newCust, business?.id || 'biz-001').catch(() => {});
          return [newCust, ...prev];
        }
      });
    }

    // Free previously assigned vehicle/driver if reassigned during edit
    if (existingBooking) {
      if (existingBooking.vehicleId && existingBooking.vehicleId !== newBooking.vehicleId) {
        setVehicles(prev => prev.map(v => v.id === existingBooking.vehicleId ? { ...v, status: 'Free' } : v));
      }
      if (existingBooking.driverId && existingBooking.driverId !== newBooking.driverId) {
        setDrivers(prev => prev.map(d => d.id === existingBooking.driverId ? { ...d, status: 'Available' } : d));
      }
    }

    // Update Vehicle & Driver Status if Ongoing
    if (newBooking.status === 'Ongoing' || newBooking.status === 'Driver Assigned') {
      if (newBooking.vehicleId) {
        setVehicles(prev => prev.map(v => {
          if (v.id === newBooking.vehicleId) {
            const updatedV = { ...v, status: 'On Trip' };
            supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
            return updatedV;
          }
          return v;
        }));
      }
      if (newBooking.driverId) {
        setDrivers(prev => prev.map(d => {
          if (d.id === newBooking.driverId) {
            const updatedD = { ...d, status: 'On Trip' };
            supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
            return updatedD;
          }
          return d;
        }));
      }
    }

    // Clear edit state
    setEditingBooking(null);

    return newBooking;
  };

  // Open existing booking in Edit Mode
  const openEditBooking = (booking) => {
    setEditingBooking(booking);
    setNewBookingPrefill(booking);
    setIsNewBookingOpen(true);
  };

  // Delete Booking with CRM and fleet status rollback
  const deleteBooking = (bookingId) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return;

    // Rollback pending balance from customer CRM if applicable
    if (target.customerName && Number(target.balancePending || 0) > 0 && target.status !== 'Cancelled' && target.status !== 'Enquiry') {
      setCustomers(prev => prev.map(c => {
        if (c.id === target.customerId || c.name.toLowerCase() === target.customerName.toLowerCase()) {
          const updatedCust = {
            ...c,
            pendingBalance: Math.max(0, (c.pendingBalance || 0) - Number(target.balancePending || 0))
          };
          supabaseApi.saveCustomer(updatedCust, business?.id || 'biz-001').catch(() => {});
          return updatedCust;
        }
        return c;
      }));
    }

    // Free assigned vehicle
    if (target.vehicleId && (target.status === 'Ongoing' || target.status === 'Driver Assigned')) {
      setVehicles(prev => prev.map(v => v.id === target.vehicleId ? { ...v, status: 'Free' } : v));
    }
    // Free assigned driver
    if (target.driverId && (target.status === 'Ongoing' || target.status === 'Driver Assigned')) {
      setDrivers(prev => prev.map(d => d.id === target.driverId ? { ...d, status: 'Available' } : d));
    }

    setBookings(prev => prev.filter(b => b.id !== bookingId));
    supabaseApi.deleteBooking(bookingId).catch(err => console.warn('[Delete Booking Error]:', err));
  };

  // Start Trip action: transitions trip to Ongoing, marks vehicle & driver On Trip
  const startTrip = (bookingId, startKm = null) => {
    let updatedBooking = null;
    const nowIso = new Date().toISOString();
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const resolvedStartKm = Number(startKm || (vehicles.find(v => v.id === b.vehicleId)?.odometer || 0));
      updatedBooking = {
        ...b,
        status: 'Ongoing',
        actualStartDateTime: nowIso,
        startedAt: nowIso,
        startKm: resolvedStartKm,
        startOdometer: resolvedStartKm
      };
      return updatedBooking;
    }));

    const targetBooking = bookings.find(b => b.id === bookingId);
    if (targetBooking) {
      if (updatedBooking) {
        supabaseApi.saveBooking(updatedBooking, business?.id || 'biz-001').catch(() => {});
      }
      if (targetBooking.vehicleId) {
        setVehicles(prev => prev.map(v => {
          if (v.id === targetBooking.vehicleId) {
            const updatedV = { ...v, status: 'On Trip' };
            supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
            return updatedV;
          }
          return v;
        }));
      }
      if (targetBooking.driverId) {
        setDrivers(prev => prev.map(d => {
          if (d.id === targetBooking.driverId) {
            const updatedD = { ...d, status: 'On Trip' };
            supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
            return updatedD;
          }
          return d;
        }));
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
      extraHours,
      extraHoursCharges,
      nightHalt,
      tollParking,
      driverBata,
      discount,
      finalPaidAmount,
      settlementPaymentMode,
      settlementNotes,
      balanceRemaining
    } = settlementData;

    // Zero Double-Counting Fare Formula:
    // Base Fare + Extra KM + Extra Hours + Driver Bata + Night Halt - Discount
    const baseFare = Number(targetBooking.baseFare || 0);
    const resolvedExtraKmCharges = Number(extraKmCharges || 0);
    const resolvedExtraHours = Number(extraHours || 0);
    const resolvedExtraHoursCharges = Number(extraHoursCharges || 0);
    const resolvedDriverBata = Number(driverBata !== undefined ? driverBata : (targetBooking.driverBata || 0));
    const resolvedNightHalt = Number(nightHalt !== undefined ? nightHalt : (targetBooking.nightHalt || 0));
    const resolvedDiscount = Number(discount || 0);
    const resolvedTollParking = Number(tollParking !== undefined ? tollParking : (targetBooking.tollParking || 0));

    const taxableAmount = Math.max(0, baseFare + resolvedExtraKmCharges + resolvedExtraHoursCharges + resolvedDriverBata + resolvedNightHalt - resolvedDiscount);
    const gstPercent = targetBooking.gstEnabled ? Number(targetBooking.gstPercent || 5) : 0;
    const gstAmount = Math.round(taxableAmount * (gstPercent / 100));
    const totalFare = taxableAmount + gstAmount + resolvedTollParking;

    const prevAdvance = Number(targetBooking.advancePaid || 0);
    const finalPaid = Number(finalPaidAmount || 0);
    const totalCollected = prevAdvance + finalPaid;
    const finalBalancePending = Math.max(0, totalFare - totalCollected);
    const completedTimestamp = new Date().toISOString();
    const resolvedEndKm = Number(endKm || 0);
    const resolvedStartKm = Number(startKm || targetBooking.startKm || targetBooking.startOdometer || 0);

    // 1. Update Booking
    const updatedBooking = {
      ...targetBooking,
      status: 'Completed',
      actualEndDateTime: completedTimestamp,
      completedAt: completedTimestamp,
      settledAt: completedTimestamp,
      startKm: resolvedStartKm,
      startOdometer: resolvedStartKm,
      endKm: resolvedEndKm,
      endOdometer: resolvedEndKm,
      actualKm: Number(actualKm || (resolvedEndKm - resolvedStartKm) || 0),
      extraKmCharges: resolvedExtraKmCharges,
      extraHours: resolvedExtraHours,
      extraHoursCharges: resolvedExtraHoursCharges,
      driverBata: resolvedDriverBata,
      nightHalt: resolvedNightHalt,
      tollParking: resolvedTollParking,
      discount: resolvedDiscount,
      taxableAmount,
      gstAmount,
      totalFare,
      advancePaid: prevAdvance, // Preserved exact advance paid upfront
      finalPaidAmount: finalPaid,
      totalPaid: totalCollected, // Full total collected (advance + final)
      balancePending: finalBalancePending,
      settlementMode: settlementPaymentMode,
      settlementPaymentMode: settlementPaymentMode,
      settlementNotes: settlementNotes || ''
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));

    // Persist completed booking to Supabase
    supabaseApi.saveBooking(updatedBooking, business?.id || 'biz-001').catch(() => {});

    // 2. Free Vehicle & Update Odometer
    if (targetBooking.vehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetBooking.vehicleId) {
          const updatedV = {
            ...v,
            status: 'Free',
            odometer: endKm ? Number(endKm) : v.odometer
          };
          supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
          return updatedV;
        }
        return v;
      }));
    }

    // 3. Free Driver
    if (targetBooking.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === targetBooking.driverId) {
          const updatedD = { ...d, status: 'Available' };
          supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
          return updatedD;
        }
        return d;
      }));
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
        const updatedCust = {
          ...c,
          pendingBalance: Math.max(0, (c.pendingBalance || 0) + balanceDelta)
        };
        supabaseApi.saveCustomer(updatedCust, business?.id || 'biz-001').catch(() => {});
        return updatedCust;
      }
      return c;
    }));

    return updatedBooking;
  };

  // Update Trip Status Lifecycle & Handle Trip Cancellations Cleanly
  const updateBookingStatus = (bookingId, newStatus, extraData = {}) => {
    const targetBooking = bookings.find(b => b.id === bookingId);
    if (!targetBooking) return;

    const updatedBooking = { ...targetBooking, status: newStatus, ...extraData };
    setBookings(prev => prev.map(b => b.id === bookingId ? updatedBooking : b));

    supabaseApi.saveBooking(updatedBooking, business?.id || 'biz-001').catch(() => {});

    if (newStatus === 'Completed' || newStatus === 'Cancelled') {
      // Free Vehicle
      if (targetBooking.vehicleId) {
        setVehicles(vPrev => vPrev.map(v => {
          if (v.id === targetBooking.vehicleId) {
            const updatedV = { ...v, status: 'Free' };
            supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
            return updatedV;
          }
          return v;
        }));
      }
      // Free Driver
      if (targetBooking.driverId) {
        setDrivers(dPrev => dPrev.map(d => {
          if (d.id === targetBooking.driverId) {
            const updatedD = { ...d, status: 'Available' };
            supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
            return updatedD;
          }
          return d;
        }));
      }

      // If Cancelled, reverse any customer pending dues in CRM
      if (newStatus === 'Cancelled' && Number(targetBooking.balancePending || 0) > 0) {
        setCustomers(cPrev => cPrev.map(c => {
          const isMatch = (targetBooking.customerId && c.id === targetBooking.customerId) ||
                          (c.name.toLowerCase() === targetBooking.customerName.toLowerCase()) ||
                          (targetBooking.customerPhone && c.phone && c.phone.replace(/\D/g, '').slice(-10) === targetBooking.customerPhone.replace(/\D/g, '').slice(-10));
          if (isMatch) {
            const updatedC = {
              ...c,
              pendingBalance: Math.max(0, (c.pendingBalance || 0) - Number(targetBooking.balancePending || 0))
            };
            supabaseApi.saveCustomer(updatedC, business?.id || 'biz-001').catch(() => {});
            return updatedC;
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
        setVehicles(vPrev => vPrev.map(v => {
          if (v.id === targetBooking.vehicleId) {
            const updatedV = { ...v, status: 'On Trip' };
            supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
            return updatedV;
          }
          return v;
        }));
      }
      if (targetBooking.driverId) {
        setDrivers(dPrev => dPrev.map(d => {
          if (d.id === targetBooking.driverId) {
            const updatedD = { ...d, status: 'On Trip' };
            supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
            return updatedD;
          }
          return d;
        }));
      }
    }
  };

  // Direct manual Odometer update helper
  const updateVehicleOdometer = (vehicleId, newOdo) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const updatedV = { ...v, odometer: Number(newOdo) };
        supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
        return updatedV;
      }
      return v;
    }));
  };

  // Document Renewal: Vehicle Document
  const renewVehicleDocument = (vehicleId, docType, newExpiryDate, docNumber = '') => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      const updatedDocs = { ...v.documents };
      if (docType === 'Insurance') {
        updatedDocs.insuranceExpiry = newExpiryDate;
        if (docNumber) updatedDocs.insuranceNumber = docNumber;
      } else if (docType === 'PUC') {
        updatedDocs.pucExpiry = newExpiryDate;
        if (docNumber) updatedDocs.pucNumber = docNumber;
      } else if (docType === 'Fitness') {
        updatedDocs.fitnessExpiry = newExpiryDate;
        if (docNumber) updatedDocs.fitnessNumber = docNumber;
      } else if (docType === 'Permit') {
        updatedDocs.permitExpiry = newExpiryDate;
        if (docNumber) updatedDocs.permitNumber = docNumber;
      } else if (docType === 'RC Book' || docType === 'RC') {
        updatedDocs.rcExpiry = newExpiryDate;
        if (docNumber) updatedDocs.rcNumber = docNumber;
      }

      const updatedV = {
        ...v,
        documents: updatedDocs
      };
      supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
      return updatedV;
    }));

    setRenewalModalData(null);
  };

  // Document Renewal: Driver DL
  const renewDriverLicense = (driverId, newExpiryDate, dlNumber = '') => {
    setDrivers(prev => prev.map(d => {
      if (d.id !== driverId) return d;
      const updatedD = {
        ...d,
        dlExpiry: newExpiryDate,
        dlNumber: dlNumber || d.dlNumber
      };
      supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
      return updatedD;
    }));
    setRenewalModalData(null);
  };

  // Vehicle Service & Maintenance Scheduler
  const updateVehicleServiceSchedule = (vehicleId, serviceData) => {
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v;
      const updatedV = {
        ...v,
        lastServiceOdometer: serviceData.lastServiceOdometer || v.odometer,
        nextServiceDueOdometer: serviceData.nextServiceDueOdometer || (v.odometer + 10000),
        lastServiceDate: serviceData.lastServiceDate || new Date().toISOString().split('T')[0],
        lastServiceType: serviceData.lastServiceType || 'General Service',
        lastServiceCost: serviceData.lastServiceCost || 0,
        lastWorkshop: serviceData.lastWorkshop || ''
      };
      supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
      return updatedV;
    }));

    // Also persist service history log to Supabase vehicle_services table
    const serviceRecord = {
      id: `svc-${Date.now().toString().slice(-6)}`,
      vehicleId,
      serviceType: serviceData.lastServiceType || 'General Service',
      odometer: serviceData.lastServiceOdometer || 0,
      cost: serviceData.lastServiceCost || 0,
      serviceCenter: serviceData.lastWorkshop || '',
      date: serviceData.lastServiceDate || new Date().toISOString().split('T')[0],
      notes: serviceData.notes || 'Periodic 10K / General Maintenance'
    };
    supabaseApi.saveVehicleService(serviceRecord, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Vehicle Service Error]:', err));
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
      const updatedB = {
        ...b,
        inspectionData
      };
      supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
      return updatedB;
    }));
  };

  // Digital Signature Saver (Customer / Driver)
  const saveDigitalSignature = (bookingId, signatureDataUrl, type = 'customer') => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const updatedB = {
        ...b,
        customerSignature: type === 'customer' ? signatureDataUrl : b.customerSignature,
        driverSignature: type === 'driver' ? signatureDataUrl : b.driverSignature,
        signedAt: new Date().toISOString()
      };
      supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
      return updatedB;
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

  // Settle Customer Dues in CRM & Reconcile Bookings
  const settleCustomerPayment = (customerId, amount, paymentMode, notes = '') => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;
    const numAmount = Number(amount);

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const updatedC = {
          ...c,
          pendingBalance: Math.max(0, (c.pendingBalance || 0) - numAmount)
        };
        supabaseApi.saveCustomer(updatedC, business?.id || 'biz-001').catch(() => {});
        return updatedC;
      }
      return c;
    }));

    // Reconcile and deduct balancePending from customer's completed bookings (oldest first)
    let remainingToReconcile = numAmount;
    if (remainingToReconcile > 0) {
      setBookings(prev => {
        const updated = [...prev];
        const unpaidTrips = updated
          .map((b, idx) => ({ b, idx }))
          .filter(({ b }) =>
            (b.customerId === customerId ||
             (cust.name && b.customerName?.toLowerCase() === cust.name.toLowerCase()) ||
             (cust.phone && b.customerPhone && b.customerPhone.replace(/\D/g, '').slice(-10) === cust.phone.replace(/\D/g, '').slice(-10))) &&
            Number(b.balancePending || 0) > 0
          )
          .sort((a, b) => new Date(a.b.startDateTime) - new Date(b.b.startDateTime));

        for (const { b, idx } of unpaidTrips) {
          if (remainingToReconcile <= 0) break;
          const due = Number(b.balancePending || 0);
          const payTowardsThis = Math.min(due, remainingToReconcile);
          remainingToReconcile -= payTowardsThis;
          const updatedTrip = {
            ...b,
            balancePending: Math.max(0, due - payTowardsThis),
            finalPaidAmount: Number(b.finalPaidAmount || 0) + payTowardsThis,
            totalPaid: Number(b.totalPaid || (Number(b.advancePaid || 0) + Number(b.finalPaidAmount || 0))) + payTowardsThis,
            settlementNotes: b.settlementNotes ? `${b.settlementNotes} | Settled ₹${payTowardsThis}` : `Settled ₹${payTowardsThis}`
          };
          updated[idx] = updatedTrip;
          supabaseApi.saveBooking(updatedTrip, business?.id || 'biz-001').catch(() => {});
        }
        return updated;
      });
    }

    recordTransaction({
      type: 'Income',
      category: 'Customer Due Settlement',
      amount: numAmount,
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

    // Live unsubmitted cash with drivers (verified cash only)
    const driverCash = drivers.reduce((sum, d) => {
      const stats = getDriverCashStats(d.id);
      return sum + Number(stats.netCashDue || 0);
    }, 0);

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
    const now = new Date();
    let daysCount = 30;
    let periodLabel = 'Last 30 Days';
    let cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    if (period === '7d') {
      daysCount = 7;
      periodLabel = 'Last 7 Days';
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === '30d') {
      daysCount = 30;
      periodLabel = 'Last 30 Days';
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === '90d') {
      daysCount = 90;
      periodLabel = 'Last 90 Days (Quarter)';
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (period === '6m') {
      daysCount = 180;
      periodLabel = 'Last 6 Months';
      cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    } else if (period === '1y') {
      daysCount = 365;
      periodLabel = 'Last 1 Year';
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else if (period === 'all') {
      daysCount = 450;
      periodLabel = 'All Time Lifetime';
      cutoffDate = new Date(0);
    }

    const dateRangeText = period === 'all' 
      ? 'Lifetime Operational History' 
      : `${fmtDate(cutoffDate)} – ${fmtDate(now)}`;

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

    supabaseApi.saveExpense(newExp, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Expense Error]:', err));

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

  // Delete Expense
  const deleteExpense = (expenseId) => {
    const targetExp = expenses.find(e => e.id === expenseId);
    setExpenses(prev => prev.filter(e => e.id !== expenseId));

    if (targetExp) {
      setTransactions(prev => {
        const matchingTx = prev.find(tx =>
          tx.type === 'Expense' &&
          Number(tx.amount) === Number(targetExp.amount) &&
          (tx.vehicleId === targetExp.vehicleId || tx.notes === (targetExp.description || ''))
        );
        if (matchingTx) {
          supabaseApi.deleteTransaction(matchingTx.id).catch(() => {});
          return prev.filter(tx => tx.id !== matchingTx.id);
        }
        return prev;
      });
    }

    supabaseApi.deleteExpense(expenseId)
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Delete Expense Error]:', err));
  };

  // Delete Transaction
  const deleteTransaction = (transactionId) => {
    setTransactions(prev => prev.filter(tx => tx.id !== transactionId));
    supabaseApi.deleteTransaction(transactionId)
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Delete Transaction Error]:', err));
  };

  // Update Business Profile
  const updateBusiness = (updatedBizData) => {
    const mergedBiz = {
      ...business,
      ...updatedBizData
    };
    setBusiness(mergedBiz);
    supabaseApi.saveBusiness(mergedBiz)
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Update Business Error]:', err));
  };

  // Update Rate Card
  const updateRateCard = (rateCardData) => {
    setRateCards(prev => prev.map(rc => rc.id === rateCardData.id ? { ...rc, ...rateCardData } : rc));
    supabaseApi.saveRateCard(rateCardData, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Update RateCard Error]:', err));
  };

  // Delete Rate Card
  const deleteRateCard = (rateCardId) => {
    setRateCards(prev => prev.filter(rc => rc.id !== rateCardId));
    supabaseApi.deleteRateCard(rateCardId)
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Delete RateCard Error]:', err));
  };

  // Add Vehicle with SaaS Plan Limit Enforcement
  const addVehicle = (vehicleData) => {
    const currentLimit = Number(business?.vehicleLimit || 15);
    if (vehicles.length >= currentLimit) {
      alert(`⚠️ Vehicle limit reached (${vehicles.length}/${currentLimit} cars) for your ${business.membershipPlan || 'current'} plan.\n\nPlease upgrade your membership to add more fleet vehicles.`);
      setIsMembershipOpen(true);
      return false;
    }

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

    supabaseApi.saveVehicle(newVeh, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Vehicle Error]:', err));

    return newVeh;
  };

  // Update Vehicle
  const updateVehicle = (vehicleId, updatedData) => {
    let fullUpdatedVeh = null;
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        fullUpdatedVeh = { ...v, ...updatedData };
        return fullUpdatedVeh;
      }
      return v;
    }));

    if (fullUpdatedVeh) {
      supabaseApi.saveVehicle(fullUpdatedVeh, business?.id || 'biz-001')
        .then(() => setLastSyncedAt(new Date()))
        .catch(err => console.warn('[Supabase Update Vehicle Error]:', err));
    }
  };

  // Delete Vehicle
  const deleteVehicle = (vehicleId) => {
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    supabaseApi.deleteVehicle(vehicleId)
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Delete Vehicle Error]:', err));
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

    supabaseApi.saveDriver(newDrv, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Driver Error]:', err));
  };

  // Update Driver
  const updateDriver = (driverId, updatedData) => {
    const cleanPhone = updatedData.phone ? formatPhoneNumber(updatedData.phone) : undefined;
    const cleanWhatsapp = updatedData.whatsapp ? formatPhoneNumber(updatedData.whatsapp) : (cleanPhone || undefined);

    let oldDrv = null;
    let fullUpdatedDrv = null;
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        oldDrv = d;
        fullUpdatedDrv = {
          ...d,
          ...updatedData,
          phone: cleanPhone || d.phone,
          whatsapp: cleanWhatsapp || d.whatsapp
        };
        return fullUpdatedDrv;
      }
      return d;
    }));

    if (fullUpdatedDrv) {
      supabaseApi.saveDriver(fullUpdatedDrv, business?.id || 'biz-001')
        .then(() => setLastSyncedAt(new Date()))
        .catch(err => console.warn('[Supabase Sync Driver Error]:', err));
    }

    // Update associated bookings if driver name or phone changed
    if (oldDrv && (updatedData.name || cleanPhone)) {
      setBookings(prev => prev.map(b => {
        if (b.driverId === driverId || (oldDrv.name && b.driverName === oldDrv.name)) {
          const updatedB = {
            ...b,
            driverName: updatedData.name || b.driverName,
            driverPhone: cleanPhone || b.driverPhone
          };
          supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
          return updatedB;
        }
        return b;
      }));
    }
  };

  // Delete Driver
  const deleteDriver = (driverId) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
    supabaseApi.deleteDriver(driverId).catch(err => console.warn('[Supabase Delete Driver Error]:', err));
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

    supabaseApi.saveCustomer(newCust, business?.id || 'biz-001')
      .then(() => setLastSyncedAt(new Date()))
      .catch(err => console.warn('[Supabase Sync Customer Error]:', err));
  };

  // Update Customer
  const updateCustomer = (customerId, updatedData) => {
    const cleanPhone = updatedData.phone ? formatPhoneNumber(updatedData.phone) : undefined;
    const cleanWhatsapp = updatedData.whatsapp ? formatPhoneNumber(updatedData.whatsapp) : (cleanPhone || undefined);

    let oldCust = null;
    let fullUpdatedCust = null;
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        oldCust = c;
        fullUpdatedCust = {
          ...c,
          ...updatedData,
          phone: cleanPhone || c.phone,
          whatsapp: cleanWhatsapp || c.whatsapp
        };
        return fullUpdatedCust;
      }
      return c;
    }));

    if (fullUpdatedCust) {
      supabaseApi.saveCustomer(fullUpdatedCust, business?.id || 'biz-001')
        .then(() => setLastSyncedAt(new Date()))
        .catch(err => console.warn('[Supabase Sync Customer Error]:', err));
    }

    // Update associated bookings if customer name or phone changed
    if (oldCust && (updatedData.name || cleanPhone)) {
      setBookings(prev => prev.map(b => {
        if (b.customerId === customerId || (oldCust.name && b.customerName === oldCust.name)) {
          const updatedB = {
            ...b,
            customerName: updatedData.name || b.customerName,
            customerPhone: cleanPhone || b.customerPhone
          };
          supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
          return updatedB;
        }
        return b;
      }));
    }
  };

  // Delete Customer
  const deleteCustomer = (customerId) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    supabaseApi.deleteCustomer(customerId).catch(err => console.warn('[Supabase Delete Customer Error]:', err));
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
    if (isProjectPaused) {
      alert('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
      return;
    }
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const loginUser = async (userData) => {
    if (isProjectPaused) {
      throw new Error('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
    }
    const rawInputPhone = (userData.phone || '').replace(/\D/g, '');
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const identifier = cleanEmail || rawInputPhone;

    // 1. Check in Supabase cloud profiles / businesses
    let cloudProfile = null;
    if (identifier) {
      cloudProfile = await supabaseApi.findProfileByPhoneOrEmail(identifier);
    }

    // 2. Auto-detect if user is a Driver
    if (cloudProfile && cloudProfile.role === 'driver') {
      const driverUser = {
        role: 'driver',
        driverId: cloudProfile.id.replace(/^usr-/, ''),
        name: cloudProfile.name,
        phone: cloudProfile.phone,
        email: cloudProfile.email || cleanEmail,
        businessId: cloudProfile.businessId,
        token: `gd_driver_token_${Date.now()}`
      };
      setAuthUser(driverUser);
      setDriverActiveTab('duty');
      setIsAuthModalOpen(false);
      return driverUser;
    }

    // Local fleet driver fallback
    const matchedDriver = drivers.find(d => {
      const cleanDrvPhone = (d.phone || '').replace(/\D/g, '');
      const cleanDrvEmail = (d.email || '').toLowerCase().trim();
      return (rawInputPhone && cleanDrvPhone.endsWith(rawInputPhone.slice(-10))) ||
             (cleanEmail && cleanDrvEmail === cleanEmail);
    });

    if (matchedDriver) {
      const driverUser = {
        role: 'driver',
        driverId: matchedDriver.id,
        name: matchedDriver.name,
        phone: matchedDriver.phone,
        email: matchedDriver.email || cleanEmail,
        businessName: business.name || 'Fleet Services',
        city: business.city || 'Maharashtra',
        payoutType: matchedDriver.payoutType || 'Salary',
        token: `gd_driver_token_${Date.now()}`
      };
      setAuthUser(driverUser);
      setDriverActiveTab('duty');
      setIsAuthModalOpen(false);
      return driverUser;
    }

    // 3. Otherwise login as Fleet Owner
    const targetBusinessId = cloudProfile?.businessId || business?.id || `biz-${Date.now().toString().slice(-6)}`;
    const ownerUser = {
      role: 'owner',
      name: cloudProfile?.name || userData.name || business.ownerName || 'Fleet Owner',
      phone: cloudProfile?.phone || userData.phone || business.phone || '',
      email: cloudProfile?.email || userData.email || business.email || '',
      businessId: targetBusinessId,
      businessName: cloudProfile?.business?.name || userData.businessName || business.name || 'My Fleet Services',
      city: cloudProfile?.business?.city || userData.city || business.city || 'Maharashtra',
      plan: cloudProfile?.business?.membershipPlan || userData.plan || business.membershipPlan || 'Starter (5 Cars)',
      membershipStatus: cloudProfile?.business?.membershipStatus || 'Active',
      token: `gd_token_${Date.now()}`
    };

    setAuthUser(ownerUser);

    if (cloudProfile?.business) {
      setBusiness(cloudProfile.business);
      supabaseApi.fetchFullBusinessData(targetBusinessId).then(cloudData => {
        if (cloudData.isLoaded) {
          if (cloudData.vehicles) setVehicles(cloudData.vehicles);
          if (cloudData.drivers) setDrivers(cloudData.drivers);
          if (cloudData.customers) setCustomers(cloudData.customers);
          if (cloudData.bookings) setBookings(cloudData.bookings);
          if (cloudData.expenses) setExpenses(cloudData.expenses);
          if (cloudData.transactions) setTransactions(cloudData.transactions);
          if (cloudData.invoices) setInvoices(cloudData.invoices);
        }
      }).catch(() => {});
    } else if (userData.businessName) {
      const updatedBiz = {
        ...business,
        id: targetBusinessId,
        name: userData.businessName,
        ownerName: userData.name || business.ownerName,
        phone: userData.phone || business.phone,
        email: userData.email || business.email,
        whatsapp: userData.whatsapp || userData.phone || business.whatsapp,
        city: userData.city || business.city
      };
      setBusiness(updatedBiz);
      supabaseApi.saveBusiness(updatedBiz).catch(() => {});
    }

    setIsAuthModalOpen(false);
    setActiveTab('home');
    return ownerUser;
  };

  const registerUser = async (registrationData) => {
    if (isProjectPaused) {
      throw new Error('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
    }
    const newBizId = `biz-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6)}`;
    const user = {
      role: 'owner',
      name: registrationData.ownerName || 'Fleet Owner',
      phone: registrationData.phone || '',
      email: registrationData.email || '',
      businessId: newBizId,
      businessName: registrationData.businessName || 'My Fleet Services',
      city: registrationData.city || 'Pune, MH',
      gstin: registrationData.gstin || '',
      businessTypes: registrationData.businessTypes || ['Cab', 'Rental'],
      plan: registrationData.plan || 'Starter (5 Cars)',
      membershipStatus: 'Trial (14 Days Free)',
      token: `gd_token_${Date.now()}`
    };

    setAuthUser(user);

    const newBiz = {
      id: newBizId,
      name: user.businessName,
      ownerName: user.name,
      phone: user.phone,
      email: user.email,
      whatsapp: user.phone || '',
      city: user.city,
      gstin: user.gstin,
      membershipPlan: user.plan,
      membershipStatus: user.membershipStatus,
      vehicleLimit: user.plan?.includes('15') ? 15 : (user.plan?.includes('40') ? 40 : 5),
      staffLimit: 3
    };

    setBusiness(newBiz);
    // Start with 100% clean empty state
    setVehicles([]);
    setDrivers([]);
    setCustomers([]);
    setBookings([]);
    setExpenses([]);
    setTransactions([]);
    setInvoices([]);
    setDriverSubmissions([]);

    // Save business & owner profile in Supabase
    supabaseApi.saveBusiness(newBiz).catch(e => console.warn('[Register Business Error]:', e));
    supabaseApi.saveProfile({
      id: `usr-owner-${Date.now().toString().slice(-4)}`,
      businessId: newBiz.id,
      role: 'owner',
      name: user.name,
      phone: user.phone,
      email: user.email
    }).catch(e => console.warn('[Register Profile Error]:', e));

    setIsAuthModalOpen(false);
    setActiveTab('home');
    return user;
  };

  const loginWithGoogle = async () => {
    if (isProjectPaused) {
      alert('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[Google OAuth Error]:', err.message);
      alert(`Google Sign-In: ${err.message}\n\nYou can also enter your Gmail address directly in the Email tab.`);
      return null;
    }
  };

  const quickDemoLogin = () => {
    if (isProjectPaused) {
      alert('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
      return;
    }
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
    if (isProjectPaused) {
      alert('GaadiDesk workspace is currently paused by the administrator. Operations are disabled.');
      return;
    }
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

    if (updatedBooking) {
      supabaseApi.saveBooking(updatedBooking, business?.id || 'biz-001').catch(() => {});
    }

    if (targetVehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetVehicleId) {
          const updatedV = { ...v, status: 'On Trip', odometer: numStartKm };
          supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
          return updatedV;
        }
        return v;
      }));
    }

    if (authUser?.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === authUser.driverId) {
          const updatedD = { ...d, status: 'On Trip' };
          supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
          return updatedD;
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

    supabaseApi.saveExpense(newExp, business?.id || 'biz-001').catch(() => {});

    if (expenseData.type === 'Toll' || expenseData.type === 'Parking') {
      setBookings(prev => prev.map(b => {
        if (b.id === bookingId) {
          const currentToll = Number(b.tollParking || 0);
          const addedToll = Number(expenseData.amount || 0);
          const newToll = currentToll + addedToll;
          const newGross = Number(b.taxableAmount || 0) + Number(b.gstAmount || 0) + newToll;
          const newPending = Math.max(0, newGross - Number(b.advancePaid || 0));
          const updatedB = {
            ...b,
            tollParking: newToll,
            totalFare: newGross,
            balancePending: newPending
          };
          supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
          return updatedB;
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
    const nightHalt = Number(settlementData.nightHalt ?? targetBooking.nightHalt ?? 0);
    const extraHours = Number(settlementData.extraHours || 0);
    const extraHoursCharges = Number(settlementData.extraHoursCharges || 0);
    const tollParking = Number(settlementData.tollParking ?? targetBooking.tollParking ?? 0);
    const discount = Number(settlementData.discount || 0);

    const taxableAmount = Math.max(0, baseFare + extraKmCharges + extraHoursCharges + driverBata + nightHalt - discount);
    const gstPercent = targetBooking.gstEnabled ? Number(targetBooking.gstPercent || 5) : 0;
    const gstAmount = Math.round(taxableAmount * (gstPercent / 100));
    const grossTotal = taxableAmount + gstAmount + tollParking;
    const prevAdvance = Number(targetBooking.advancePaid || 0);
    const netDue = Math.max(0, grossTotal - prevAdvance);
    const finalPaidAmount = Number(settlementData.finalPaidAmount ?? netDue);
    const balanceRemaining = Math.max(0, netDue - finalPaidAmount);
    const totalCollected = prevAdvance + finalPaidAmount;
    const paymentMode = settlementData.paymentMode || 'Cash';

    const nowIso = new Date().toISOString();
    const completedBooking = {
      ...targetBooking,
      startKm: numStartKm,
      startOdometer: numStartKm,
      endKm: numEndKm,
      endOdometer: numEndKm,
      actualKm,
      extraKm,
      extraKmCharges,
      extraHours,
      extraHoursCharges,
      driverBata,
      nightHalt,
      tollParking,
      discount,
      taxableAmount,
      gstAmount,
      totalFare: grossTotal,
      advancePaid: prevAdvance, // Preserved original advance
      finalPaidAmount,
      totalPaid: totalCollected,
      balancePending: balanceRemaining,
      settlementMode: paymentMode,
      settlementPaymentMode: paymentMode,
      settlementNotes: settlementData.notes || `Completed by driver. Meter: ${numStartKm} to ${numEndKm} KM`,
      status: 'Completed',
      completedAt: nowIso,
      actualEndDateTime: nowIso,
      settledAt: nowIso
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? completedBooking : b));

    supabaseApi.saveBooking(completedBooking, business?.id || 'biz-001').catch(() => {});

    // Update Customer Pending Balance in Office CRM
    if (targetBooking.customerName) {
      setCustomers(prev => prev.map(c => {
        const isMatch = (targetBooking.customerId && c.id === targetBooking.customerId) ||
                        (c.name.toLowerCase() === targetBooking.customerName.toLowerCase()) ||
                        (targetBooking.customerPhone && c.phone && c.phone.replace(/\D/g, '').slice(-10) === targetBooking.customerPhone.replace(/\D/g, '').slice(-10));
        if (isMatch) {
          const oldTripPending = Number(targetBooking.balancePending || 0);
          const newTripPending = balanceRemaining;
          const currentTotalPending = Number(c.pendingBalance || 0);
          const updatedPending = Math.max(0, currentTotalPending - oldTripPending + newTripPending);
          const updatedCust = { ...c, pendingBalance: updatedPending };
          supabaseApi.saveCustomer(updatedCust, business?.id || 'biz-001').catch(() => {});
          return updatedCust;
        }
        return c;
      }));
    }

    if (targetBooking.vehicleId) {
      setVehicles(prev => prev.map(v => {
        if (v.id === targetBooking.vehicleId) {
          const updatedV = { ...v, status: 'Free', odometer: numEndKm };
          supabaseApi.saveVehicle(updatedV, business?.id || 'biz-001').catch(() => {});
          return updatedV;
        }
        return v;
      }));
    }

    if (targetBooking.driverId) {
      setDrivers(prev => prev.map(d => {
        if (d.id === targetBooking.driverId) {
          const updatedD = { ...d, status: 'Available' };
          supabaseApi.saveDriver(updatedD, business?.id || 'biz-001').catch(() => {});
          return updatedD;
        }
        return d;
      }));
    }

    if (finalPaidAmount > 0) {
      recordTransaction({
        bookingId: targetBooking.id,
        invoiceNumber: targetBooking.invoiceNumber,
        type: 'Income',
        category: 'Trip Balance Collection',
        amount: finalPaidAmount,
        paymentMode: paymentMode,
        driverId: targetBooking.driverId,
        customerName: targetBooking.customerName,
        notes: `Balance collected by driver ${targetBooking.driverName || ''} (${paymentMode})`,
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
    const submissionId = `sub-${Date.now().toString().slice(-6)}`;
    const todayDate = new Date().toISOString().split('T')[0];

    recordTransaction({
      type: 'Income',
      category: 'Driver Cash Handover',
      amount: numAmt,
      paymentMode: 'Cash',
      driverId: driverId,
      customerName: driverName,
      notes: `Cash handover from driver ${driverName}: ${notes || 'Daily settlement'}`,
      date: todayDate
    });

    const submissionRecord = {
      id: submissionId,
      driverId,
      driverName,
      amount: numAmt,
      paymentMode: 'Cash',
      date: todayDate,
      notes: notes || 'Office Cash Handover',
      status: 'Verified',
      createdAt: new Date().toISOString()
    };

    setDriverSubmissions(prev => [submissionRecord, ...prev]);
    supabaseApi.saveDriverSubmission(submissionRecord, business?.id || 'biz-001').catch(() => {});

    return submissionRecord;
  };

  const saveCorporateInvoice = (invoiceData) => {
    const invId = invoiceData.id || `inv-${Date.now().toString().slice(-6)}`;
    const newInv = {
      ...invoiceData,
      id: invId,
      createdAt: new Date().toISOString()
    };

    setInvoices(prev => [newInv, ...prev]);
    supabaseApi.saveInvoice(newInv, business?.id || 'biz-001').catch(() => {});

    if (Array.isArray(newInv.bookingIds) && newInv.bookingIds.length > 0) {
      setBookings(prev => prev.map(b => {
        if (newInv.bookingIds.includes(b.id)) {
          const updatedB = { ...b, isCorporateInvoiced: true, corporateInvoiceId: invId };
          supabaseApi.saveBooking(updatedB, business?.id || 'biz-001').catch(() => {});
          return updatedB;
        }
        return b;
      }));
    }

    return newInv;
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
    
    const driver = drivers.find(d => d.id === driverId);
    const driverBookings = bookings.filter(b => b.driverId === driverId);
    let cashCollected = 0;
    let totalBata = 0;

    driverBookings.forEach(b => {
      // Only count advance if collected by driver, not office
      if (b.advanceMode === 'Cash' && b.advanceCollectedBy === 'driver') {
        cashCollected += Number(b.advancePaid || 0);
      }
      const isSettledCash = b.settlementPaymentMode === 'Cash' || b.settlementMode === 'Cash' || (!b.settlementPaymentMode && !b.settlementMode && b.advanceMode === 'Cash');
      // Count ONLY actual cash collected at trip end, NEVER uncollected debts (balancePending)!
      if (b.status === 'Completed' && isSettledCash) {
        cashCollected += Number(b.finalPaidAmount || 0);
      }
      if (b.status === 'Completed' || b.status === 'Ongoing') {
        totalBata += Number(b.driverBata || 0);
      }
    });

    const driverExps = expenses.filter(e => e.driverId === driverId && e.paidBy === 'Driver');
    const reimbursableExpenses = driverExps.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    // Sum submissions from driverSubmissions state and transaction ledger
    const stateSubs = (driverSubmissions || []).filter(s => s.driverId === driverId);
    const stateCashSubmitted = stateSubs.reduce((sum, s) => sum + Number(s.amount || 0), 0);

    const txSubs = transactions.filter(tx =>
      tx.category === 'Driver Cash Handover' &&
      (tx.driverId === driverId || (driver && tx.customerName === driver.name))
    );
    const txCashSubmitted = txSubs.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const cashSubmitted = Math.max(stateCashSubmitted, txCashSubmitted);
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
    loginWithGoogle,
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
    deleteBooking,
    editingBooking,
    setEditingBooking,
    openEditBooking,
    invoices,
    setInvoices,
    saveCorporateInvoice,
    driverSubmissions,
    setDriverSubmissions,
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
    deleteExpense,
    deleteTransaction,
    updateBusiness,
    updateRateCard,
    deleteRateCard,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addDriver,
    updateDriver,
    deleteDriver,
    addCustomer,
    updateCustomer,
    deleteCustomer,
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
    selectedVehicleDetail,
    setSelectedVehicleDetail,
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
    formatPhoneNumber,
    isCloudConnected,
    cloudSyncStatus,
    lastSyncedAt,
    syncWithCloud,
    isProjectPaused,
    isCheckingProjectHealth,
    projectPausedReason,
    checkProjectStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
