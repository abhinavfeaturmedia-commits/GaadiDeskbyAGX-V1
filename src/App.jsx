import React, { useState, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SplashScreen } from './components/splash/SplashScreen';
import { MobileShell } from './components/layout/MobileShell';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { BookingsList } from './components/bookings/BookingsList';
import { FleetManager } from './components/fleet/FleetManager';
import { MoneyDashboard } from './components/money/MoneyDashboard';
import { MoreMenu } from './components/more/MoreMenu';
import { NewBookingWizard } from './components/bookings/NewBookingWizard';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { ProjectPausedScreen } from './components/common/ProjectPausedScreen';

// Driver Views & Modals (Critical for Driver Workflow)
import { DriverShell } from './components/driver/DriverShell';
import { DriverDashboard } from './components/driver/DriverDashboard';
import { DriverTripHistory } from './components/driver/DriverTripHistory';
import { DriverCashWallet } from './components/driver/DriverCashWallet';
import { DriverProfile } from './components/driver/DriverProfile';
import { DriverTollModal } from './components/driver/DriverTollModal';
import { DriverUpiModal } from './components/driver/DriverUpiModal';

// Code-Split Lazy-Loaded Modals for Instant App Launch
const TripSettlementModal = lazy(() => import('./components/bookings/TripSettlementModal').then(m => ({ default: m.TripSettlementModal })));
const TripDetailModal = lazy(() => import('./components/bookings/TripDetailModal').then(m => ({ default: m.TripDetailModal })));
const InvoiceGenerator = lazy(() => import('./components/invoices/InvoiceGenerator').then(m => ({ default: m.InvoiceGenerator })));
const WhatsAppModal = lazy(() => import('./components/modals/WhatsAppModal').then(m => ({ default: m.WhatsAppModal })));
const NotificationModal = lazy(() => import('./components/modals/NotificationModal').then(m => ({ default: m.NotificationModal })));
const RenewalModal = lazy(() => import('./components/modals/RenewalModal').then(m => ({ default: m.RenewalModal })));
const CustomerSettleModal = lazy(() => import('./components/modals/CustomerSettleModal').then(m => ({ default: m.CustomerSettleModal })));
const MembershipPlans = lazy(() => import('./components/membership/MembershipPlans').then(m => ({ default: m.MembershipPlans })));
const QuickQuoteModal = lazy(() => import('./components/quotes/QuickQuoteModal').then(m => ({ default: m.QuickQuoteModal })));
const CorporateInvoiceModal = lazy(() => import('./components/corporate/CorporateInvoiceModal').then(m => ({ default: m.CorporateInvoiceModal })));
const CAExportModal = lazy(() => import('./components/export/CAExportModal').then(m => ({ default: m.CAExportModal })));
const PublicMiniSiteModal = lazy(() => import('./components/publicsite/PublicMiniSiteModal').then(m => ({ default: m.PublicMiniSiteModal })));
const VehicleServiceModal = lazy(() => import('./components/fleet/VehicleServiceModal').then(m => ({ default: m.VehicleServiceModal })));
const VehicleDetailModal = lazy(() => import('./components/fleet/VehicleDetailModal').then(m => ({ default: m.VehicleDetailModal })));
const VehicleInspectionModal = lazy(() => import('./components/inspection/VehicleInspectionModal').then(m => ({ default: m.VehicleInspectionModal })));

const ModalLoadingFallback = () => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white p-4 rounded-3xl shadow-xl flex items-center gap-3 border border-[#E5DFD3]">
      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-black text-[#111827]">Loading...</span>
    </div>
  </div>
);

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
    saveVehicleInspection,
    isProjectPaused,
    projectPausedReason,
    checkProjectStatus
  } = useApp();

  // If Supabase project is paused, LOCK DOWN the entire application immediately!
  // No Landing page, no login, no register, no dashboard, no driver views.
  if (isProjectPaused) {
    return (
      <ProjectPausedScreen
        onRetry={checkProjectStatus}
        errorReason={projectPausedReason}
      />
    );
  }

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
            <Suspense fallback={<ModalLoadingFallback />}>
              <MembershipPlans onClose={() => setIsMembershipOpen(false)} />
            </Suspense>
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
            <Suspense fallback={<ModalLoadingFallback />}>
              <NotificationModal
                onClose={() => setIsNotificationsOpen(false)}
              />
            </Suspense>
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

          <Suspense fallback={<ModalLoadingFallback />}>
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
          </Suspense>

          {/* Global Auth Modal */}
          <AuthModal />
        </MobileShell>
      )}
    </>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
