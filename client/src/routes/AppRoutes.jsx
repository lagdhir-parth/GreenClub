import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('../pages/user/DashboardPage'));
const CharitySelectionPage = lazy(() => import('../pages/user/CharitySelectionPage'));
const SubscriptionPage = lazy(() => import('../pages/user/SubscriptionPage'));
const ScoresPage = lazy(() => import('../pages/user/ScoresPage'));
const DrawsPage = lazy(() => import('../pages/user/DrawsPage'));
const WinningsPage = lazy(() => import('../pages/user/WinningsPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const UsersPage = lazy(() => import('../pages/admin/UsersPage'));
const CharitiesPage = lazy(() => import('../pages/admin/CharitiesPage'));
const DrawManagementPage = lazy(() => import('../pages/admin/DrawManagementPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-tertiary">Loading...</p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<PublicRoute><LoginPage /></PublicRoute>}
          />
          <Route
            path="/register"
            element={<PublicRoute><RegisterPage /></PublicRoute>}
          />
        </Route>

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/select-charity" element={<CharitySelectionPage />} />
          <Route path="/subscribe" element={<SubscriptionPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route path="/draws" element={<DrawsPage />} />
          <Route path="/winnings" element={<WinningsPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/charities" element={<CharitiesPage />} />
          <Route path="/admin/draws" element={<DrawManagementPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
