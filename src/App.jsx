import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SplashScreen } from './components/splash/SplashScreen';
import { MobileShell } from './components/layout/MobileShell';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { BookingsList } from './components/bookings/BookingsList';
import { FleetManager } from './components/fleet/FleetManager';
import { MoneyDashboard } from './components/money/MoneyDashboard';
import { MoreMenu } from './components/more/MoreMenu';
import { NewBookingWizard } from './components/bookings/NewBookingWizard';
import { TripSettlementModal } from './components/bookings/TripSettlementModal';
import { TripDetailModal } from './components/bookings/TripDetailModal';
import { InvoiceGenerator } from './components/invoices/InvoiceGenerator';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { RenewalModal } from './components/modals/RenewalModal';
import { CustomerSettleModal } from './components/modals/CustomerSettleModal';
import { MembershipPlans } from './components/membership/MembershipPlans';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

// Next-Gen Fleet Feature Modals
import { QuickQuoteModal } from './components/quotes/QuickQuoteModal';
import { CorporateInvoiceModal } from './components/corporate/CorporateInvoiceModal';
import { CAExportModal } from './components/export/CAExportModal';
import { PublicMiniSiteModal } from './components/publicsite/PublicMiniSiteModal';
import { VehicleServiceModal } from './components/fleet/VehicleServiceModal';
import { VehicleDetailModal } from './components/fleet/VehicleDetailModal';
import { VehicleInspectionModal } from './components/inspection/VehicleInspectionModal';

// Driver Views & Modals
import { DriverShell } from './components/driver/DriverShell';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { DriverTripHistory } from './components/driver/DriverTripHistory';
import { DriverCashWallet } from './components/driver/DriverCashWallet';
import { DriverProfile } from './components/driver/DriverProfile';
import { DriverTollModal } from './components/driver/DriverTollModal';
import { DriverUpiModal } from './components/driver/DriverUpiModal';

const MainContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const {
    authUser,
    activeTab,
    driverActiveTab,
    isNewBookingOpen,
    setIsNewBookingOpen,
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
    saveVehicleInspection
  } = useApp();

  return (
    <>
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} duration={1800} />
      )}

      {/* If user is not logged in, show the Public Landing / Home Page */}
      {!authUser ? (
        <>
          <LandingPage />
          <AuthModal />
          {isMembershipOpen && (
            <MembershipPlans onClose={() => setIsMembershipOpen(false)} />
          )}
        </>
      ) : authUser.role === 'driver' ? (
        /* If user is a Driver, show dedicated DriverShell & Driver Views */
        <DriverShell>
          {driverActiveTab === 'duty' && <DriverDashboard />}
          {driverActiveTab === 'trips' && <DriverTripHistory />}
          {driverActiveTab === 'wallet' && <DriverCashWallet />}
          {driverActiveTab === 'profile' && <DriverProfile />}

          {/* Driver On-Road Toll & UPI Modals */}
          <DriverTollModal />
          <DriverUpiModal />

          {/* Driver Notifications */}
          {isNotificationsOpen && (
            <NotificationModal
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}
        </DriverShell>
      ) : (
        /* If user is Fleet Owner / Staff, show full GaadiDesk App Shell & Dashboard */
        <MobileShell>
          {/* Tab Router */}
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'trips' && <BookingsList />}
          {activeTab === 'fleet' && <FleetManager />}
          {activeTab === 'money' && <MoneyDashboard />}
          {activeTab === 'more' && <MoreMenu />}

          {/* Global Modals & Drawers */}
          {isNewBookingOpen && (
            <NewBookingWizard onClose={() => setIsNewBookingOpen(false)} />
          )}

          {selectedTripDetailBooking && (
            <TripDetailModal
              booking={selectedTripDetailBooking}
              onClose={() => setSelectedTripDetailBooking(null)}
            />
          )}

          {settlementBooking && (
            <TripSettlementModal
              booking={settlementBooking}
              onClose={() => setSettlementBooking(null)}
            />
          )}

          {selectedInvoiceBooking && (
            <InvoiceGenerator
              booking={selectedInvoiceBooking}
              onClose={() => setSelectedInvoiceBooking(null)}
            />
          )}

          {whatsAppData && (
            <WhatsAppModal
              data={whatsAppData}
              onClose={() => setWhatsAppData(null)}
            />
          )}

          {isNotificationsOpen && (
            <NotificationModal
              onClose={() => setIsNotificationsOpen(false)}
            />
          )}

          {isMembershipOpen && (
            <MembershipPlans
              onClose={() => setIsMembershipOpen(false)}
            />
          )}

          {/* RTO Document Renewal Modal */}
          <RenewalModal />

          {/* Customer Dues Settlement Modal */}
          <CustomerSettleModal />

          {/* 10-Second Instant Quotation Modal */}
          {isQuickQuoteOpen && (
            <QuickQuoteModal onClose={() => setIsQuickQuoteOpen(false)} />
          )}

          {/* Corporate B2B Monthly Invoicing Modal */}
          {selectedCorporateCustomer && (
            <CorporateInvoiceModal
              customer={selectedCorporateCustomer}
              onClose={() => setSelectedCorporateCustomer(null)}
            />
          )}

          {/* CA & Tally Export Modal */}
          {isCaExportOpen && (
            <CAExportModal onClose={() => setIsCaExportOpen(false)} />
          )}

          {/* Operator Branded Public Mini-Website Modal */}
          {isPublicSiteOpen && (
            <PublicMiniSiteModal onClose={() => setIsPublicSiteOpen(false)} />
          )}

          {/* Odometer Vehicle Maintenance & Service Modal */}
          {serviceModalVehicle && (
            <VehicleServiceModal
              vehicle={serviceModalVehicle}
              onClose={() => setServiceModalVehicle(null)}
            />
          )}

          {/* 360° Vehicle Passport & Detail Modal */}
          {selectedVehicleDetail && (
            <VehicleDetailModal
              vehicle={selectedVehicleDetail}
              onClose={() => setSelectedVehicleDetail(null)}
            />
          )}

          {/* 6-Point Vehicle Rental Inspection Modal */}
          {inspectionModalBooking && (
            <VehicleInspectionModal
              booking={inspectionModalBooking}
              onSave={(data) => saveVehicleInspection(inspectionModalBooking.id, data)}
              onClose={() => setInspectionModalBooking(null)}
            />
          )}

          {/* Global Auth Modal */}
          <AuthModal />
        </MobileShell>
      )}
    </>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
