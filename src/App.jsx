import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { BookingsList } from './components/bookings/BookingsList';
import { FleetManager } from './components/fleet/FleetManager';
import { MoneyDashboard } from './components/money/MoneyDashboard';
import { MoreMenu } from './components/more/MoreMenu';
import { NewBookingWizard } from './components/bookings/NewBookingWizard';
import { TripSettlementModal } from './components/bookings/TripSettlementModal';
import { InvoiceGenerator } from './components/invoices/InvoiceGenerator';
import { WhatsAppModal } from './components/modals/WhatsAppModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { RenewalModal } from './components/modals/RenewalModal';
import { CustomerSettleModal } from './components/modals/CustomerSettleModal';
import { MembershipPlans } from './components/membership/MembershipPlans';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';

const MainContent = () => {
  const {
    authUser,
    activeTab,
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
    whatsAppData,
    setWhatsAppData
  } = useApp();

  // If user is not logged in, show the Public Landing / Home Page
  if (!authUser) {
    return (
      <>
        <LandingPage />
        <AuthModal />
        {isMembershipOpen && (
          <MembershipPlans onClose={() => setIsMembershipOpen(false)} />
        )}
      </>
    );
  }

  // If user is logged in, show the full GaadiDesk App Shell & Dashboard
  return (
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

      {/* Global Auth Modal */}
      <AuthModal />
    </MobileShell>
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
