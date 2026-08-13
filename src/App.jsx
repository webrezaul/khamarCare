// KhamarCare — Root App Component with Routing
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './stores/useAuthStore.js';
import useFarmStore from './stores/useFarmStore.js';
import useToastStore from './stores/useToastStore.js';

// Layout
import AppShell from './components/layout/AppShell.jsx';

// Pages
import SplashPage from './pages/SplashPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FarmSetupPage from './pages/FarmSetupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CattleListPage from './pages/cattle/CattleListPage.jsx';
import AddCattlePage from './pages/cattle/AddCattlePage.jsx';
import CattleDetailPage from './pages/cattle/CattleDetailPage.jsx';
import MilkDashboardPage from './pages/milk/MilkDashboardPage.jsx';
import AddMilkPage from './pages/milk/AddMilkPage.jsx';
import FeedDashboardPage from './pages/feed/FeedDashboardPage.jsx';
import AddFeedPage from './pages/feed/AddFeedPage.jsx';
import FeedInventoryPage from './pages/feed/FeedInventoryPage.jsx';
import FinanceDashboardPage from './pages/finance/FinanceDashboardPage.jsx';
import AddIncomePage from './pages/finance/AddIncomePage.jsx';
import AddExpensePage from './pages/finance/AddExpensePage.jsx';
import MoreMenuPage from './pages/MoreMenuPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import AIChatPage from './pages/chat/AIChatPage.jsx';
import HealthDashboardPage from './pages/health/HealthDashboardPage.jsx';
import AddHealthRecordPage from './pages/health/AddHealthRecordPage.jsx';
import WeightTrackerPage from './pages/hardware/WeightTrackerPage.jsx';
import RFIDScanPage from './pages/hardware/RFIDScanPage.jsx';
import MilkingMachineImportPage from './pages/hardware/MilkingMachineImportPage.jsx';
import SyncDashboardPage from './pages/sync/SyncDashboardPage.jsx';

import SalesDashboardPage from './pages/sales/SalesDashboardPage.jsx';
import CustomersPage from './pages/sales/CustomersPage.jsx';
import AddSalePage from './pages/sales/AddSalePage.jsx';

function Toast() {
  const toast = useToastStore(s => s.toast);
  if (!toast) return null;
  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        {toast.type === 'success' && '✅'}
        {toast.type === 'error' && '❌'}
        {toast.type === 'warning' && '⚠️'}
        {toast.type === 'info' && 'ℹ️'}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isOnboarded } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOnboarded) return <Navigate to="/farm-setup" replace />;
  return children;
}

export default function App() {
  const { initialize, isLoading, isAuthenticated, isOnboarded, farm } = useAuthStore();
  const loadAllData = useFarmStore(s => s.loadAllData);
  const [showSplash, setShowSplash] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    initialize();
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load farm data when authenticated
  useEffect(() => {
    if (isAuthenticated && isOnboarded && farm && !dataLoaded) {
      loadAllData(farm.id).then(() => setDataLoaded(true));
    }
  }, [isAuthenticated, isOnboarded, farm, dataLoaded]);

  if (showSplash || isLoading) {
    return <SplashPage />;
  }

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={
          isAuthenticated && isOnboarded ? <Navigate to="/" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to={isOnboarded ? '/' : '/farm-setup'} replace /> : <RegisterPage />
        } />
        <Route path="/farm-setup" element={
          !isAuthenticated ? <Navigate to="/login" replace /> :
          isOnboarded ? <Navigate to="/" replace /> :
          <FarmSetupPage />
        } />

        {/* Protected Routes with Bottom Nav */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cattle" element={<CattleListPage />} />
          <Route path="/cattle/add" element={<AddCattlePage />} />
          <Route path="/cattle/:id" element={<CattleDetailPage />} />
          <Route path="/milk" element={<MilkDashboardPage />} />
          <Route path="/milk/add" element={<AddMilkPage />} />
          <Route path="/feed" element={<FeedDashboardPage />} />
          <Route path="/feed/add" element={<AddFeedPage />} />
          <Route path="/feed/inventory" element={<FeedInventoryPage />} />
          <Route path="/finance" element={<FinanceDashboardPage />} />
          <Route path="/finance/income/add" element={<AddIncomePage />} />
          <Route path="/finance/expense/add" element={<AddExpensePage />} />
          <Route path="/more" element={<MoreMenuPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chat" element={<AIChatPage />} />
          <Route path="/health" element={<HealthDashboardPage />} />
          <Route path="/health/add" element={<AddHealthRecordPage />} />
          <Route path="/hardware/weight" element={<WeightTrackerPage />} />
          <Route path="/hardware/rfid" element={<RFIDScanPage />} />
          <Route path="/hardware/milking-import" element={<MilkingMachineImportPage />} />
          <Route path="/sync" element={<SyncDashboardPage />} />
          
          <Route path="/sales/dashboard" element={<SalesDashboardPage />} />
          <Route path="/sales/customers" element={<CustomersPage />} />
          <Route path="/sales/add" element={<AddSalePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={
          <Navigate to={isAuthenticated && isOnboarded ? '/' : '/onboarding'} replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}
