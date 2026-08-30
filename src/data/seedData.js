export const initialBusiness = {
  id: "biz-001",
  name: "Shree Ganesh Tours & Travels",
  ownerName: "Ramesh Gaikwad",
  phone: "+91 98220 12345",
  whatsapp: "+91 98220 12345",
  city: "Pune",
  state: "Maharashtra",
  address: "Shop 14, Swargate Bus Stand Commercial Complex, Pune - 411042",
  gstin: "27AABCS1429B1Z8",
  upiId: "ramesh.tours@okhdfcbank",
  membershipPlan: "growth", // 'trial' | 'starter' | 'growth' | 'business' | 'agency'
  membershipExpires: "2026-10-15",
  vehicleLimit: 15,
  staffLimit: 3,
  language: "en", // 'en' | 'hi'
};

export const initialVehicles = [
  {
    id: "veh-01",
    plate: "MH 12 RN 4589",
    brand: "Maruti Suzuki",
    model: "Dzire VXi",
    category: "Sedan", // Hatchback | Sedan | SUV | MUV | Luxury | Tempo
    fuel: "CNG + Petrol",
    seats: 4,
    ownership: "Own",
    status: "Free", // 'Free' | 'On Trip' | 'Workshop' | 'Blocked'
    odometer: 64200,
    avgKmPerLitre: 22.5,
    assignedDriverId: "drv-01",
    documents: {
      rcExpiry: "2029-06-15",
      insuranceExpiry: "2026-09-12", // Expiring soon (alert trigger)
      pucExpiry: "2026-09-08", // Expiring very soon (alert trigger)
      fitnessExpiry: "2027-04-20",
      permitExpiry: "2027-08-30",
    },
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veh-02",
    plate: "MH 12 QX 9012",
    brand: "Toyota",
    model: "Innova Crysta 2.4 VX",
    category: "MUV",
    fuel: "Diesel",
    seats: 7,
    ownership: "Own",
    status: "On Trip",
    odometer: 112450,
    avgKmPerLitre: 13.0,
    assignedDriverId: "drv-02",
    documents: {
      rcExpiry: "2030-01-10",
      insuranceExpiry: "2026-11-20",
      pucExpiry: "2026-12-15",
      fitnessExpiry: "2027-02-14",
      permitExpiry: "2027-09-10",
    },
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veh-03",
    plate: "MH 14 TC 3341",
    brand: "Maruti Suzuki",
    model: "Ertiga ZXi",
    category: "MUV",
    fuel: "CNG",
    seats: 6,
    ownership: "Own",
    status: "Free",
    odometer: 48900,
    avgKmPerLitre: 20.0,
    assignedDriverId: "drv-03",
    documents: {
      rcExpiry: "2031-03-22",
      insuranceExpiry: "2026-09-25", // Expiring soon
      pucExpiry: "2027-01-05",
      fitnessExpiry: "2027-07-18",
      permitExpiry: "2028-02-15",
    },
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veh-04",
    plate: "MH 09 CW 7780",
    brand: "Tata",
    model: "Nexon EV Max",
    category: "SUV",
    fuel: "EV",
    seats: 5,
    ownership: "Own",
    status: "Free",
    odometer: 31000,
    avgKmPerLitre: 0,
    assignedDriverId: "drv-04",
    documents: {
      rcExpiry: "2032-08-11",
      insuranceExpiry: "2027-05-19",
      pucExpiry: "2099-01-01", // EV exempt
      fitnessExpiry: "2028-08-11",
      permitExpiry: "2028-08-11",
    },
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "veh-05",
    plate: "MH 12 BK 1109",
    brand: "Hyundai",
    model: "Aura S",
    category: "Sedan",
    fuel: "CNG",
    seats: 4,
    ownership: "Attached",
    status: "Workshop",
    odometer: 89000,
    avgKmPerLitre: 23.0,
    assignedDriverId: "drv-01",
    documents: {
      rcExpiry: "2028-10-05",
      insuranceExpiry: "2026-10-18",
      pucExpiry: "2026-09-02", // Expired/Urgent alert
      fitnessExpiry: "2026-12-30",
      permitExpiry: "2027-04-12",
    },
    image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=400&q=80"
  }
];

export const initialDrivers = [
  {
    id: "drv-01",
    name: "Sachin Shinde",
    phone: "+91 98901 44321",
    whatsapp: "+91 98901 44321",
    dlNumber: "MH12 20140028912",
    dlExpiry: "2028-04-14",
    status: "Available",
    payoutType: "Salary", // Salary | Commission | Attached
    monthlySalary: 18000,
    emergencyContact: "+91 98901 99999 (Brother)",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "drv-02",
    name: "Santosh More",
    phone: "+91 97654 88120",
    whatsapp: "+91 97654 88120",
    dlNumber: "MH12 20110091823",
    dlExpiry: "2027-11-30",
    status: "On Trip",
    payoutType: "Salary",
    monthlySalary: 20000,
    emergencyContact: "+91 97654 77777 (Wife)",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "drv-03",
    name: "Vikas Patil",
    phone: "+91 94220 55678",
    whatsapp: "+91 94220 55678",
    dlNumber: "MH09 20160045231",
    dlExpiry: "2026-09-20", // Expiring soon
    status: "Available",
    payoutType: "Commission",
    monthlySalary: 0,
    commissionRate: "₹2.50 / km",
    emergencyContact: "+91 94220 11111",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: "drv-04",
    name: "Ganesh Jadhav",
    phone: "+91 91580 33211",
    whatsapp: "+91 91580 33211",
    dlNumber: "MH14 20180011234",
    dlExpiry: "2030-07-25",
    status: "Available",
    payoutType: "Salary",
    monthlySalary: 19000,
    emergencyContact: "+91 91580 22222",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  }
];

export const initialCustomers = [
  {
    id: "cust-01",
    name: "Dr. Aniket Deshmukh",
    phone: "+91 98812 34567",
    whatsapp: "+91 98812 34567",
    type: "Personal",
    notes: "Prefers Innova Crysta for long family trips to Mahabaleshwar.",
    totalBookings: 8,
    pendingBalance: 2400,
    address: "Kothrud, Pune"
  },
  {
    id: "cust-02",
    name: "TechMatrix Solutions Pvt Ltd",
    phone: "+91 98230 77889",
    whatsapp: "+91 98230 77889",
    type: "Corporate",
    gstin: "27AAACT2941E1Z3",
    contactPerson: "Priya Sharma (HR)",
    notes: "Airport drops for Pune-Mumbai. Pays within 15 days on GST bill.",
    totalBookings: 24,
    pendingBalance: 12800,
    address: "Hinjewadi Phase 2, Pune"
  },
  {
    id: "cust-03",
    name: "Sunil Kulkarni",
    phone: "+91 94235 66789",
    whatsapp: "+91 94235 66789",
    type: "Personal",
    notes: "Regular Kolhapur-Pune round trip customer.",
    totalBookings: 5,
    pendingBalance: 0,
    address: "Rajarampuri, Kolhapur"
  },
  {
    id: "cust-04",
    name: "Apex Engineering Corp",
    phone: "+91 97640 11223",
    whatsapp: "+91 97640 11223",
    type: "Corporate",
    gstin: "27AAHCA8912P1ZM",
    contactPerson: "Rahul Joshi (Admin)",
    notes: "Monthly staff chauffeur rentals.",
    totalBookings: 14,
    pendingBalance: 6500,
    address: "Bhosari MIDC, Pune"
  }
];

export const initialRateCards = [
  {
    id: "rc-local-sedan",
    name: "Local Sedan (8hr / 80km)",
    category: "Sedan",
    tripType: "Local",
    baseHours: 8,
    baseKm: 80,
    basePrice: 1800,
    extraKmRate: 14,
    extraHourRate: 150,
    driverBata: 0,
    nightHalt: 0,
    defaultGstPercent: 5
  },
  {
    id: "rc-airport-pune-mumbai",
    name: "Pune Airport to Mumbai T2",
    category: "Sedan",
    tripType: "Airport",
    baseHours: 4,
    baseKm: 160,
    basePrice: 2800,
    extraKmRate: 15,
    extraHourRate: 150,
    driverBata: 0,
    nightHalt: 0,
    defaultGstPercent: 5
  },
  {
    id: "rc-outstation-innova",
    name: "Outstation Innova Crysta",
    category: "MUV",
    tripType: "Outstation",
    baseHours: 24,
    baseKm: 250, // min km/day
    perKmRate: 19,
    driverBata: 500,
    nightHalt: 400,
    defaultGstPercent: 5
  },
  {
    id: "rc-selfdrive-dzire",
    name: "Self-Drive Dzire (24 Hours)",
    category: "Sedan",
    tripType: "Rental",
    baseHours: 24,
    baseKm: 250,
    basePrice: 2200,
    extraKmRate: 10,
    securityDeposit: 5000,
    fuelPolicy: "Same to Same",
    defaultGstPercent: 5
  }
];

export const initialBookings = [
  {
    id: "GD-BK-101",
    invoiceNumber: "GD/2026-27/0101",
    tripType: "Outstation",
    customerName: "Dr. Aniket Deshmukh",
    customerPhone: "+91 98812 34567",
    vehicleId: "veh-02",
    vehiclePlate: "MH 12 QX 9012 (Innova Crysta)",
    driverId: "drv-02",
    driverName: "Santosh More",
    driverPhone: "+91 97654 88120",
    pickupLocation: "Kothrud, Pune",
    dropLocation: "Club Mahindra, Mahabaleshwar",
    startDateTime: "2026-08-30T07:00",
    endDateTime: "2026-08-31T20:00",
    daysCount: 2,
    minKmPerDay: 250,
    estimatedKm: 540,
    ratePerKm: 19,
    baseFare: 9500,
    driverBata: 1000, // 2 days x 500
    nightHalt: 400,
    tollParking: 680,
    discount: 0,
    gstEnabled: true,
    gstPercent: 5,
    taxableAmount: 10900,
    gstAmount: 545,
    totalFare: 12125,
    advancePaid: 5000,
    advanceMode: "UPI",
    balancePending: 7125,
    status: "Ongoing", // 'Enquiry' | 'Confirmed' | 'Driver Assigned' | 'Ongoing' | 'Completed' | 'Cancelled'
    startOdometer: 112450,
    notes: "Family trip. VIP customer. Keep car clean & AC working.",
    createdAt: "2026-08-29T18:30"
  },
  {
    id: "GD-BK-102",
    invoiceNumber: "GD/2026-27/0102",
    tripType: "Airport",
    customerName: "TechMatrix Solutions (Priya)",
    customerPhone: "+91 98230 77889",
    vehicleId: "veh-01",
    vehiclePlate: "MH 12 RN 4589 (Dzire VXi)",
    driverId: "drv-01",
    driverName: "Sachin Shinde",
    driverPhone: "+91 98901 44321",
    pickupLocation: "Hinjewadi Phase 2, Pune",
    dropLocation: "Mumbai Airport T2",
    startDateTime: "2026-08-30T16:00",
    endDateTime: "2026-08-30T22:00",
    baseFare: 3000,
    driverBata: 0,
    nightHalt: 0,
    tollParking: 380,
    gstEnabled: true,
    gstPercent: 5,
    taxableAmount: 3000,
    gstAmount: 150,
    totalFare: 3530,
    advancePaid: 0,
    advanceMode: "Credit",
    balancePending: 3530,
    status: "Confirmed",
    notes: "Flight AI 642 at 22:30. Corporate GST billing.",
    createdAt: "2026-08-30T09:15"
  },
  {
    id: "GD-BK-103",
    invoiceNumber: "GD/2026-27/0103",
    tripType: "Local",
    customerName: "Sunil Kulkarni",
    customerPhone: "+91 94235 66789",
    vehicleId: "veh-03",
    vehiclePlate: "MH 14 TC 3341 (Ertiga ZXi)",
    driverId: "drv-03",
    driverName: "Vikas Patil",
    driverPhone: "+91 94220 55678",
    pickupLocation: "Shivajinagar, Pune",
    dropLocation: "Pune City 8hr / 80km Package",
    startDateTime: "2026-08-30T10:00",
    endDateTime: "2026-08-30T18:00",
    baseFare: 2200,
    driverBata: 0,
    nightHalt: 0,
    tollParking: 100,
    gstEnabled: false,
    gstPercent: 0,
    taxableAmount: 2200,
    gstAmount: 0,
    totalFare: 2300,
    advancePaid: 1000,
    advanceMode: "Cash",
    balancePending: 1300,
    status: "Driver Assigned",
    notes: "Sightseeing in Pune (Shaniwar Wada, Dagdusheth).",
    createdAt: "2026-08-30T08:00"
  },
  {
    id: "GD-BK-098",
    invoiceNumber: "GD/2026-27/0098",
    tripType: "Outstation",
    customerName: "Rajesh Shirodkar",
    customerPhone: "+91 98221 99001",
    vehicleId: "veh-04",
    vehiclePlate: "MH 09 CW 7780 (Nexon EV)",
    driverId: "drv-04",
    driverName: "Ganesh Jadhav",
    driverPhone: "+91 91580 33211",
    pickupLocation: "Kolhapur",
    dropLocation: "Goa (Candolim)",
    startDateTime: "2026-08-28T06:00",
    endDateTime: "2026-08-29T21:00",
    baseFare: 7800,
    driverBata: 800,
    nightHalt: 300,
    tollParking: 450,
    gstEnabled: false,
    gstPercent: 0,
    taxableAmount: 8900,
    gstAmount: 0,
    totalFare: 9350,
    advancePaid: 9350,
    advanceMode: "UPI",
    balancePending: 0,
    status: "Completed",
    notes: "EV fast-charged at Nipani and Mapusa. Fully settled.",
    createdAt: "2026-08-27T11:00"
  }
];

export const initialExpenses = [
  {
    id: "exp-01",
    category: "Fuel",
    description: "CNG refill for Dzire (MH 12 RN 4589)",
    amount: 980,
    paymentMode: "UPI",
    date: "2026-08-30",
    vehicleId: "veh-01"
  },
  {
    id: "exp-02",
    category: "Workshop / Maintenance",
    description: "Brake pad replacement + oil top-up for Hyundai Aura",
    amount: 2400,
    paymentMode: "Cash",
    date: "2026-08-30",
    vehicleId: "veh-05"
  },
  {
    id: "exp-03",
    category: "Driver Salary / Payout",
    description: "Weekly bata advance to Sachin Shinde",
    amount: 1500,
    paymentMode: "Cash",
    date: "2026-08-29",
    driverId: "drv-01"
  }
];

export const initialTransactions = [
  {
    id: "tx-01",
    date: "2026-08-30",
    time: "09:30 AM",
    type: "Income",
    category: "Booking Advance",
    amount: 1500,
    paymentMode: "UPI",
    bookingId: "GD-BK-001",
    customerName: "Dr. Aniket Deshmukh",
    notes: "Advance for Shirdi round trip"
  },
  {
    id: "tx-02",
    date: "2026-08-30",
    time: "11:15 AM",
    type: "Income",
    category: "Booking Advance",
    amount: 2500,
    paymentMode: "Cash",
    bookingId: "GD-BK-002",
    customerName: "Aditi Rao",
    notes: "Advance cash collected for Mahabaleshwar trip"
  },
  {
    id: "tx-03",
    date: "2026-08-30",
    time: "01:00 PM",
    type: "Expense",
    category: "Fuel",
    amount: 980,
    paymentMode: "UPI",
    vehiclePlate: "MH 12 RN 4589",
    notes: "CNG refill for Dzire"
  },
  {
    id: "tx-04",
    date: "2026-08-30",
    time: "02:45 PM",
    type: "Expense",
    category: "Workshop / Maintenance",
    amount: 2400,
    paymentMode: "Cash",
    vehiclePlate: "MH 12 BK 1109",
    notes: "Brake pad replacement"
  },
  {
    id: "tx-05",
    date: "2026-08-29",
    time: "05:30 PM",
    type: "Income",
    category: "Trip Final Settlement",
    amount: 9350,
    paymentMode: "UPI",
    bookingId: "GD-BK-004",
    customerName: "Mahesh Joshi (Kirloskar)",
    notes: "Full settlement for Goa corporate trip"
  }
];
