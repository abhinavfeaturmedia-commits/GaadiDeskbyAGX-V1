import { supabase } from '../lib/supabase.js';

// ============================================================================
// DATA TRANSFORMATION MAPPERS (camelCase <-> snake_case)
// ============================================================================

export const mapBusinessToDb = (biz) => ({
  id: biz.id || 'biz-001',
  owner_user_id: biz.ownerUserId || null,
  name: biz.name || '',
  owner_name: biz.ownerName || '',
  phone: biz.phone || '',
  email: biz.email || '',
  whatsapp: biz.whatsapp || '',
  city: biz.city || '',
  state: biz.state || '',
  address: biz.address || '',
  gstin: biz.gstin || '',
  upi_id: biz.upiId || '',
  membership_plan: biz.membershipPlan || 'growth',
  membership_status: biz.membershipStatus || 'Active',
  membership_expires: biz.membershipExpires || '',
  vehicle_limit: Number(biz.vehicleLimit) || 15,
  staff_limit: Number(biz.staffLimit) || 3,
  language: biz.language || 'en',
  updated_at: new Date().toISOString()
});

export const mapBusinessFromDb = (row) => ({
  id: row.id,
  ownerUserId: row.owner_user_id,
  name: row.name,
  ownerName: row.owner_name,
  phone: row.phone,
  email: row.email || '',
  whatsapp: row.whatsapp,
  city: row.city,
  state: row.state,
  address: row.address,
  gstin: row.gstin,
  upiId: row.upi_id,
  membershipPlan: row.membership_plan,
  membershipStatus: row.membership_status,
  membershipExpires: row.membership_expires,
  vehicleLimit: row.vehicle_limit,
  staffLimit: row.staff_limit,
  language: row.language
});

export const mapVehicleToDb = (v, businessId = 'biz-001') => ({
  id: v.id,
  business_id: businessId,
  plate: v.plate,
  brand: v.brand || '',
  model: v.model || '',
  category: v.category || 'Sedan',
  fuel: v.fuel || 'Petrol',
  seats: Number(v.seats) || 4,
  ownership: v.ownership || 'Own',
  status: v.status || 'Free',
  odometer: Number(v.odometer) || 0,
  avg_km_per_litre: Number(v.avgKmPerLitre) || 0,
  assigned_driver_id: v.assignedDriverId || null,
  documents: v.documents || {},
  image: v.image || '',
  updated_at: new Date().toISOString()
});

export const mapVehicleFromDb = (row) => ({
  id: row.id,
  plate: row.plate,
  brand: row.brand,
  model: row.model,
  category: row.category,
  fuel: row.fuel,
  seats: row.seats,
  ownership: row.ownership,
  status: row.status,
  odometer: row.odometer,
  avgKmPerLitre: Number(row.avg_km_per_litre) || 0,
  assignedDriverId: row.assigned_driver_id,
  documents: row.documents || {},
  image: row.image
});

export const mapDriverToDb = (d, businessId = 'biz-001') => ({
  id: d.id,
  business_id: businessId,
  user_id: d.userId || null,
  name: d.name,
  phone: d.phone,
  whatsapp: d.whatsapp || d.phone,
  dl_number: d.dlNumber || '',
  dl_expiry: d.dlExpiry || '',
  status: d.status || 'Available',
  payout_type: d.payoutType || 'Salary',
  monthly_salary: Number(d.monthlySalary) || 0,
  commission_rate: d.commissionRate || '',
  emergency_contact: d.emergencyContact || '',
  photo: d.photo || '',
  updated_at: new Date().toISOString()
});

export const mapDriverFromDb = (row) => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  phone: row.phone,
  whatsapp: row.whatsapp,
  dlNumber: row.dl_number,
  dlExpiry: row.dl_expiry,
  status: row.status,
  payoutType: row.payout_type,
  monthlySalary: Number(row.monthly_salary) || 0,
  commissionRate: row.commission_rate,
  emergencyContact: row.emergency_contact,
  photo: row.photo
});

export const mapCustomerToDb = (c, businessId = 'biz-001') => ({
  id: c.id,
  business_id: businessId,
  name: c.name,
  phone: c.phone,
  whatsapp: c.whatsapp || c.phone,
  type: c.type || 'Personal',
  gstin: c.gstin || '',
  contact_person: c.contactPerson || '',
  notes: c.notes || '',
  total_bookings: Number(c.totalBookings) || 0,
  pending_balance: Number(c.pendingBalance) || 0,
  address: c.address || '',
  updated_at: new Date().toISOString()
});

export const mapCustomerFromDb = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  whatsapp: row.whatsapp,
  type: row.type,
  gstin: row.gstin,
  contactPerson: row.contact_person,
  notes: row.notes,
  totalBookings: row.total_bookings,
  pendingBalance: Number(row.pending_balance) || 0,
  address: row.address
});

export const mapRateCardToDb = (rc, businessId = 'biz-001') => ({
  id: rc.id,
  business_id: businessId,
  name: rc.name,
  category: rc.category || 'Sedan',
  trip_type: rc.tripType || 'Local',
  base_hours: Number(rc.baseHours) || 0,
  base_km: Number(rc.baseKm) || 0,
  base_price: Number(rc.basePrice) || 0,
  extra_km_rate: Number(rc.extraKmRate) || 0,
  extra_hour_rate: Number(rc.extraHourRate) || 0,
  per_km_rate: Number(rc.perKmRate) || 0,
  driver_bata: Number(rc.driverBata) || 0,
  night_halt: Number(rc.nightHalt) || 0,
  security_deposit: Number(rc.securityDeposit) || 0,
  fuel_policy: rc.fuelPolicy || 'Same to Same',
  default_gst_percent: Number(rc.defaultGstPercent) || 5,
  updated_at: new Date().toISOString()
});

export const mapRateCardFromDb = (row) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  tripType: row.trip_type,
  baseHours: Number(row.base_hours) || 0,
  baseKm: Number(row.base_km) || 0,
  basePrice: Number(row.base_price) || 0,
  extraKmRate: Number(row.extra_km_rate) || 0,
  extraHourRate: Number(row.extra_hour_rate) || 0,
  perKmRate: Number(row.per_km_rate) || 0,
  driverBata: Number(row.driver_bata) || 0,
  nightHalt: Number(row.night_halt) || 0,
  securityDeposit: Number(row.security_deposit) || 0,
  fuelPolicy: row.fuel_policy,
  defaultGstPercent: Number(row.default_gst_percent) || 5
});

export const mapBookingToDb = (b, businessId = 'biz-001') => ({
  id: b.id,
  business_id: b.businessId || b.business_id || businessId,
  invoice_number: b.invoiceNumber || '',
  trip_type: b.tripType || 'Outstation',
  customer_name: b.customerName || '',
  customer_phone: b.customerPhone || '',
  customer_id: b.customerId || null,
  vehicle_id: b.vehicleId || null,
  vehicle_plate: b.vehiclePlate || '',
  driver_id: b.driverId || null,
  driver_name: b.driverName || '',
  driver_phone: b.driverPhone || '',
  pickup_location: b.pickupLocation || '',
  drop_location: b.dropLocation || '',
  start_date_time: b.startDateTime || '',
  end_date_time: b.endDateTime || '',
  days_count: Number(b.daysCount) || 1,
  min_km_per_day: Number(b.minKmPerDay) || 250,
  estimated_km: Number(b.estimatedKm) || 0,
  rate_per_km: Number(b.ratePerKm) || 0,
  base_fare: Number(b.baseFare) || 0,
  driver_bata: Number(b.driverBata) || 0,
  night_halt: Number(b.nightHalt) || 0,
  toll_parking: Number(b.tollParking) || 0,
  discount: Number(b.discount) || 0,
  gst_enabled: Boolean(b.gstEnabled),
  gst_percent: Number(b.gstPercent) || 0,
  taxable_amount: Number(b.taxableAmount) || 0,
  gst_amount: Number(b.gstAmount) || 0,
  total_fare: Number(b.totalFare) || 0,
  advance_paid: Number(b.advancePaid) || 0,
  advance_mode: b.advanceMode || '',
  balance_pending: Number(b.balancePending) || 0,
  status: b.status || 'Confirmed',
  start_odometer: (b.startOdometer !== undefined && b.startOdometer !== null)
    ? Number(b.startOdometer)
    : ((b.startKm !== undefined && b.startKm !== null) ? Number(b.startKm) : null),
  end_odometer: (b.endOdometer !== undefined && b.endOdometer !== null)
    ? Number(b.endOdometer)
    : ((b.endKm !== undefined && b.endKm !== null) ? Number(b.endKm) : null),
  start_photo_url: b.startPhotoUrl || '',
  end_photo_url: b.endPhotoUrl || '',
  started_at: b.startedAt || b.actualStartDateTime || null,
  completed_at: b.completedAt || b.actualEndDateTime || b.settledAt || null,
  notes: b.notes || '',
  inspection_data: b.inspectionData || {},
  updated_at: new Date().toISOString()
});

export const mapBookingFromDb = (row) => ({
  id: row.id,
  businessId: row.business_id,
  invoiceNumber: row.invoice_number,
  tripType: row.trip_type,
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  customerId: row.customer_id,
  vehicleId: row.vehicle_id,
  vehiclePlate: row.vehicle_plate,
  driverId: row.driver_id,
  driverName: row.driver_name,
  driverPhone: row.driver_phone,
  pickupLocation: row.pickup_location,
  dropLocation: row.drop_location,
  startDateTime: row.start_date_time,
  endDateTime: row.end_date_time,
  daysCount: row.days_count,
  minKmPerDay: row.min_km_per_day,
  estimatedKm: row.estimated_km,
  ratePerKm: Number(row.rate_per_km) || 0,
  baseFare: Number(row.base_fare) || 0,
  driverBata: Number(row.driver_bata) || 0,
  nightHalt: Number(row.night_halt) || 0,
  tollParking: Number(row.toll_parking) || 0,
  discount: Number(row.discount) || 0,
  gstEnabled: row.gst_enabled,
  gstPercent: Number(row.gst_percent) || 0,
  taxableAmount: Number(row.taxable_amount) || 0,
  gstAmount: Number(row.gst_amount) || 0,
  totalFare: Number(row.total_fare) || 0,
  advancePaid: Number(row.advance_paid) || 0,
  advanceMode: row.advance_mode,
  balancePending: Number(row.balance_pending) || 0,
  status: row.status,
  startOdometer: row.start_odometer,
  startKm: row.start_odometer,
  endOdometer: row.end_odometer,
  endKm: row.end_odometer,
  startPhotoUrl: row.start_photo_url,
  endPhotoUrl: row.end_photo_url,
  startedAt: row.started_at,
  actualStartDateTime: row.started_at,
  completedAt: row.completed_at,
  actualEndDateTime: row.completed_at,
  settledAt: row.completed_at,
  notes: row.notes,
  inspectionData: row.inspection_data || {},
  createdAt: row.created_at
});

export const mapExpenseToDb = (e, businessId = 'biz-001') => ({
  id: e.id,
  business_id: businessId,
  category: e.category || 'Fuel',
  description: e.description || '',
  amount: Number(e.amount) || 0,
  payment_mode: e.paymentMode || 'Cash',
  date: e.date || new Date().toISOString().split('T')[0],
  vehicle_id: e.vehicleId || null,
  driver_id: e.driverId || null,
  bill_photo_url: e.billPhotoUrl || '',
  updated_at: new Date().toISOString()
});

export const mapExpenseFromDb = (row) => ({
  id: row.id,
  category: row.category,
  description: row.description,
  amount: Number(row.amount) || 0,
  paymentMode: row.payment_mode,
  date: row.date,
  vehicleId: row.vehicle_id,
  driverId: row.driver_id,
  billPhotoUrl: row.bill_photo_url
});

export const mapTransactionToDb = (tx, businessId = 'biz-001') => ({
  id: tx.id,
  business_id: businessId,
  date: tx.date || new Date().toISOString().split('T')[0],
  time: tx.time || '12:00 PM',
  type: tx.type || 'Income',
  category: tx.category || 'Booking Advance',
  amount: Number(tx.amount) || 0,
  payment_mode: tx.paymentMode || 'Cash',
  reference_id: tx.referenceId || null,
  booking_id: tx.bookingId || null,
  customer_name: tx.customerName || '',
  vehicle_plate: tx.vehiclePlate || '',
  notes: tx.notes || '',
  updated_at: new Date().toISOString()
});

export const mapTransactionFromDb = (row) => ({
  id: row.id,
  date: row.date,
  time: row.time,
  type: row.type,
  category: row.category,
  amount: Number(row.amount) || 0,
  paymentMode: row.payment_mode,
  referenceId: row.reference_id,
  bookingId: row.booking_id,
  customerName: row.customer_name,
  vehiclePlate: row.vehicle_plate,
  notes: row.notes
});

export const mapVehicleServiceToDb = (svc, businessId = 'biz-001') => ({
  id: svc.id || `svc-${Date.now().toString().slice(-6)}`,
  business_id: businessId,
  vehicle_id: svc.vehicleId,
  service_type: svc.serviceType || 'General Service',
  odometer: Number(svc.odometer) || 0,
  cost: Number(svc.cost || svc.amount) || 0,
  service_center: svc.serviceCenter || svc.workshop || '',
  date: svc.date || new Date().toISOString().split('T')[0],
  notes: svc.notes || '',
  updated_at: new Date().toISOString()
});

export const mapVehicleServiceFromDb = (row) => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  serviceType: row.service_type,
  odometer: Number(row.odometer) || 0,
  cost: Number(row.cost) || 0,
  serviceCenter: row.service_center,
  date: row.date,
  notes: row.notes
});

export const mapInvoiceToDb = (inv, businessId = 'biz-001') => ({
  id: inv.id,
  business_id: inv.businessId || businessId,
  invoice_number: inv.invoiceNumber,
  customer_id: inv.customerId || null,
  customer_name: inv.customerName || '',
  billing_period: inv.billingPeriod || '',
  booking_ids: inv.bookingIds || [],
  taxable_amount: Number(inv.taxableAmount) || 0,
  gst_amount: Number(inv.gstAmount) || 0,
  total_amount: Number(inv.totalAmount) || 0,
  status: inv.status || 'Issued',
  notes: inv.notes || '',
  updated_at: new Date().toISOString()
});

export const mapInvoiceFromDb = (row) => ({
  id: row.id,
  businessId: row.business_id,
  invoiceNumber: row.invoice_number,
  customerId: row.customer_id,
  customerName: row.customer_name,
  billingPeriod: row.billing_period,
  bookingIds: row.booking_ids || [],
  taxableAmount: Number(row.taxable_amount) || 0,
  gstAmount: Number(row.gst_amount) || 0,
  totalAmount: Number(row.total_amount) || 0,
  status: row.status,
  notes: row.notes,
  createdAt: row.created_at
});

export const mapDriverSubmissionToDb = (sub, businessId = 'biz-001') => ({
  id: sub.id,
  business_id: sub.businessId || businessId,
  driver_id: sub.driverId || null,
  driver_name: sub.driverName || 'Driver',
  amount: Number(sub.amount) || 0,
  payment_mode: sub.paymentMode || 'Cash',
  notes: sub.notes || '',
  status: sub.status || 'Verified',
  date: sub.date || new Date().toISOString().split('T')[0],
  updated_at: new Date().toISOString()
});

export const mapDriverSubmissionFromDb = (row) => ({
  id: row.id,
  businessId: row.business_id,
  driverId: row.driver_id,
  driverName: row.driver_name,
  amount: Number(row.amount) || 0,
  paymentMode: row.payment_mode,
  notes: row.notes,
  status: row.status,
  date: row.date,
  createdAt: row.created_at
});

// ============================================================================
// SUPABASE CRUD METHODS
// ============================================================================

export const supabaseApi = {
  // Load entire business data suite from Supabase
  async fetchFullBusinessData(businessId = 'biz-001') {
    try {
      const [
        bizRes,
        vehRes,
        drvRes,
        custRes,
        rcRes,
        bkRes,
        expRes,
        txRes,
        invRes,
        subRes
      ] = await Promise.all([
        supabase.from('businesses').select('*').eq('id', businessId).maybeSingle(),
        supabase.from('vehicles').select('*').eq('business_id', businessId).order('created_at', { ascending: true }),
        supabase.from('drivers').select('*').eq('business_id', businessId).order('created_at', { ascending: true }),
        supabase.from('customers').select('*').eq('business_id', businessId).order('created_at', { ascending: true }),
        supabase.from('rate_cards').select('*').eq('business_id', businessId).order('created_at', { ascending: true }),
        supabase.from('bookings').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').eq('business_id', businessId).order('date', { ascending: false }),
        supabase.from('transactions').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('invoices').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('driver_submissions').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
      ]);

      return {
        business: bizRes.data ? mapBusinessFromDb(bizRes.data) : null,
        vehicles: (vehRes.data || []).map(mapVehicleFromDb),
        drivers: (drvRes.data || []).map(mapDriverFromDb),
        customers: (custRes.data || []).map(mapCustomerFromDb),
        rateCards: (rcRes.data || []).map(mapRateCardFromDb),
        bookings: (bkRes.data || []).map(mapBookingFromDb),
        expenses: (expRes.data || []).map(mapExpenseFromDb),
        transactions: (txRes.data || []).map(mapTransactionFromDb),
        invoices: (invRes.data || []).map(mapInvoiceFromDb),
        driverSubmissions: (subRes.data || []).map(mapDriverSubmissionFromDb),
        isLoaded: true
      };
    } catch (err) {
      console.error('[Supabase fetchFullBusinessData Error]:', err);
      throw err;
    }
  },

  // Seed Initial Demo/Production Data into Supabase
  async seedInitialDataToCloud(seedData, businessId = 'biz-001') {
    try {
      console.log('🚀 Seeding initial data to Supabase PostgreSQL...');

      // 1. Business
      const bizDb = mapBusinessToDb({ ...seedData.business, id: businessId });
      await supabase.from('businesses').upsert(bizDb);

      // 2. Vehicles
      if (seedData.vehicles?.length) {
        const vehDb = seedData.vehicles.map(v => mapVehicleToDb(v, businessId));
        await supabase.from('vehicles').upsert(vehDb);
      }

      // 3. Drivers
      if (seedData.drivers?.length) {
        const drvDb = seedData.drivers.map(d => mapDriverToDb(d, businessId));
        await supabase.from('drivers').upsert(drvDb);
      }

      // 4. Customers
      if (seedData.customers?.length) {
        const custDb = seedData.customers.map(c => mapCustomerToDb(c, businessId));
        await supabase.from('customers').upsert(custDb);
      }

      // 5. Rate Cards
      if (seedData.rateCards?.length) {
        const rcDb = seedData.rateCards.map(rc => mapRateCardToDb(rc, businessId));
        await supabase.from('rate_cards').upsert(rcDb);
      }

      // 6. Bookings
      if (seedData.bookings?.length) {
        const bkDb = seedData.bookings.map(b => mapBookingToDb(b, businessId));
        await supabase.from('bookings').upsert(bkDb);
      }

      // 7. Expenses
      if (seedData.expenses?.length) {
        const expDb = seedData.expenses.map(e => mapExpenseToDb(e, businessId));
        await supabase.from('expenses').upsert(expDb);
      }

      // 8. Transactions
      if (seedData.transactions?.length) {
        const txDb = seedData.transactions.map(tx => mapTransactionToDb(tx, businessId));
        await supabase.from('transactions').upsert(txDb);
      }

      console.log('✅ Supabase database successfully seeded with full fleet datasets!');
      return true;
    } catch (err) {
      console.error('[Supabase seedInitialDataToCloud Error]:', err);
      throw err;
    }
  },

  // Business mutations
  async saveBusiness(business) {
    const dbPayload = mapBusinessToDb(business);
    const { data, error } = await supabase.from('businesses').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapBusinessFromDb(data);
  },

  // Vehicle mutations
  async saveVehicle(vehicle, businessId = 'biz-001') {
    const dbPayload = mapVehicleToDb(vehicle, businessId);
    const { data, error } = await supabase.from('vehicles').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapVehicleFromDb(data);
  },

  async deleteVehicle(vehicleId) {
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
    if (error) throw error;
    return true;
  },

  // Driver mutations
  async saveDriver(driver, businessId = 'biz-001') {
    const dbPayload = mapDriverToDb(driver, businessId);
    const { data, error } = await supabase.from('drivers').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapDriverFromDb(data);
  },

  async deleteDriver(driverId) {
    const { error } = await supabase.from('drivers').delete().eq('id', driverId);
    if (error) throw error;
    return true;
  },

  // Customer mutations
  async saveCustomer(customer, businessId = 'biz-001') {
    const dbPayload = mapCustomerToDb(customer, businessId);
    const { data, error } = await supabase.from('customers').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapCustomerFromDb(data);
  },

  async deleteCustomer(customerId) {
    const { error } = await supabase.from('customers').delete().eq('id', customerId);
    if (error) throw error;
    return true;
  },

  // Rate Card mutations
  async saveRateCard(rateCard, businessId = 'biz-001') {
    const dbPayload = mapRateCardToDb(rateCard, businessId);
    const { data, error } = await supabase.from('rate_cards').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapRateCardFromDb(data);
  },

  async deleteRateCard(rateCardId) {
    const { error } = await supabase.from('rate_cards').delete().eq('id', rateCardId);
    if (error) throw error;
    return true;
  },

  // Booking mutations
  async saveBooking(booking, businessId = 'biz-001') {
    const dbPayload = mapBookingToDb(booking, businessId);
    const { data, error } = await supabase.from('bookings').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapBookingFromDb(data);
  },

  async deleteBooking(bookingId) {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) throw error;
    return true;
  },

  // Expense mutations
  async saveExpense(expense, businessId = 'biz-001') {
    const dbPayload = mapExpenseToDb(expense, businessId);
    const { data, error } = await supabase.from('expenses').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapExpenseFromDb(data);
  },

  async deleteExpense(expenseId) {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) throw error;
    return true;
  },

  // Transaction mutations
  async saveTransaction(transaction, businessId = 'biz-001') {
    const dbPayload = mapTransactionToDb(transaction, businessId);
    const { data, error } = await supabase.from('transactions').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapTransactionFromDb(data);
  },

  async deleteTransaction(transactionId) {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) throw error;
    return true;
  },

  // Profile / Auth mutations
  async saveProfile(profile) {
    const dbPayload = {
      id: profile.id,
      business_id: profile.businessId || 'biz-001',
      role: profile.role || 'owner',
      name: profile.name,
      phone: profile.phone,
      email: profile.email || null,
      avatar_url: profile.avatarUrl || null,
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('profiles').upsert(dbPayload).select().single();
    if (error) throw error;
    return data;
  },

  // Vehicle Service Log mutations
  async saveVehicleService(serviceRecord, businessId = 'biz-001') {
    const dbPayload = mapVehicleServiceToDb(serviceRecord, businessId);
    const { data, error } = await supabase.from('vehicle_services').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapVehicleServiceFromDb(data);
  },

  async fetchVehicleServices(businessId = 'biz-001') {
    const { data, error } = await supabase.from('vehicle_services').select('*').eq('business_id', businessId).order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapVehicleServiceFromDb);
  },

  async deleteVehicleService(serviceId) {
    const { error } = await supabase.from('vehicle_services').delete().eq('id', serviceId);
    if (error) throw error;
    return true;
  },

  // Invoice mutations
  async saveInvoice(invoice, businessId = 'biz-001') {
    const dbPayload = mapInvoiceToDb(invoice, businessId);
    const { data, error } = await supabase.from('invoices').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapInvoiceFromDb(data);
  },

  async fetchInvoices(businessId = 'biz-001') {
    const { data, error } = await supabase.from('invoices').select('*').eq('business_id', businessId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapInvoiceFromDb);
  },

  // Driver Cash Submission mutations
  async saveDriverSubmission(submission, businessId = 'biz-001') {
    const dbPayload = mapDriverSubmissionToDb(submission, businessId);
    const { data, error } = await supabase.from('driver_submissions').upsert(dbPayload).select().single();
    if (error) throw error;
    return mapDriverSubmissionFromDb(data);
  },

  async fetchDriverSubmissions(businessId = 'biz-001') {
    const { data, error } = await supabase.from('driver_submissions').select('*').eq('business_id', businessId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDriverSubmissionFromDb);
  },

  // Lookup profile by email or phone (auto-detect driver vs owner)
  async findProfileByPhoneOrEmail(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim();
    const isEmail = cleanId.includes('@');

    try {
      let query = supabase.from('profiles').select('*');
      if (isEmail) {
        query = query.ilike('email', cleanId.toLowerCase());
      } else {
        const pureDigits = cleanId.replace(/\D/g, '').slice(-10);
        query = query.like('phone', `%${pureDigits}%`);
      }

      const { data, error } = await query.limit(1);
      if (!error && data && data.length > 0) {
        const profile = data[0];
        return {
          id: profile.id,
          role: profile.role || 'owner',
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          businessId: profile.business_id
        };
      }

      // Check businesses table directly
      let bizQuery = supabase.from('businesses').select('*');
      if (isEmail) {
        bizQuery = bizQuery.ilike('email', cleanId.toLowerCase());
      } else {
        const pureDigits = cleanId.replace(/\D/g, '').slice(-10);
        bizQuery = bizQuery.like('phone', `%${pureDigits}%`);
      }

      const { data: bizData } = await bizQuery.limit(1);
      if (bizData && bizData.length > 0) {
        const b = mapBusinessFromDb(bizData[0]);
        return {
          role: 'owner',
          name: b.ownerName || b.name,
          phone: b.phone,
          email: b.email,
          businessId: b.id,
          business: b
        };
      }

      return null;
    } catch (err) {
      console.warn('[findProfileByPhoneOrEmail Warning]:', err);
      return null;
    }
  }
};

