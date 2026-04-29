// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { T } from './theme';

import LoginPage from './auth/LoginPage';
import LandingPage from './landing/LandingPage';
import Sidebar from './layouts/Sidebar';

import Overview from './dashboard/Overview';
import Positions from './dashboard/Positions';
import Trade from './dashboard/Trade';
import Settings from './dashboard/Settings';
import AccountDetail from './dashboard/AccountDetail';
import Webhooks from './dashboard/Webhooks';
import Billing from './dashboard/Billing';
import Admin from './admin/Admin';
import AdminNodes from './admin/AdminNodes';
import GettingStarted from './docs/GettingStarted';
import APIReference from './docs/APIReference';
import WebSocketDoc from './docs/WebSocket';
import Security from './docs/Security';

/**
 * Loading spinner component
 */
function Spinner() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: T.bg,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: `2px solid ${T.border}`,
          borderTopColor: T.accent,
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  );
}

/**
 * Guard component for authenticated routes
 */
function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

/**
 * Guard component for admin routes
 */
function AdminGuard({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

/**
 * Main application layout with sidebar
 */
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: T.bg }}>
      <Sidebar />
      <main
        style={{
          marginLeft: 'var(--sidebar-margin, 240px)',
          padding: '32px 36px',
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
        }}
        className="app-main"
      >
        {children}
      </main>
      <style>{`
        @media (max-width: 767px) {
          .app-main {
            margin-left: 0 !important;
            padding: 80px 16px 32px !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Main App component with error boundary wrapping all routes
 */
export default function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public — landing page */}
        <Route
          path="/"
          element={
            loading ? (
              <Spinner />
            ) : isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ErrorBoundary>
                <LandingPage />
              </ErrorBoundary>
            )
          }
        />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginPage />
            </ErrorBoundary>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <AppLayout>
                <Overview />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/positions"
          element={
            <AuthGuard>
              <AppLayout>
                <Positions />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/trade"
          element={
            <AuthGuard>
              <AppLayout>
                <Trade />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <AppLayout>
                <Settings />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/accounts/:id"
          element={
            <AuthGuard>
              <AppLayout>
                <AccountDetail />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/webhooks"
          element={
            <AuthGuard>
              <AppLayout>
                <Webhooks />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/billing"
          element={
            <AuthGuard>
              <AppLayout>
                <Billing />
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AppLayout>
                <Admin />
              </AppLayout>
            </AdminGuard>
          }
        />
        <Route
          path="/admin/nodes"
          element={
            <AdminGuard>
              <AppLayout>
                <AdminNodes />
              </AppLayout>
            </AdminGuard>
          }
        />

        {/* Docs */}
        <Route
          path="/docs"
          element={
            <AuthGuard>
              <AppLayout>
                <GettingStarted />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/docs/api"
          element={
            <AuthGuard>
              <AppLayout>
                <APIReference />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/docs/websocket"
          element={
            <AuthGuard>
              <AppLayout>
                <WebSocketDoc />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/docs/security"
          element={
            <AuthGuard>
              <AppLayout>
                <Security />
              </AppLayout>
            </AuthGuard>
          }
        />

        {/* Fallback — catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
