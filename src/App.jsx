// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import LoginPage from './auth/LoginPage';
import Sidebar from './layouts/Sidebar';

// Dashboard pages
import Overview from './dashboard/Overview';
import Positions from './dashboard/Positions';
import Trade from './dashboard/Trade';
import Settings from './dashboard/Settings';

// Docs pages
import GettingStarted from './docs/GettingStarted';
import APIReference from './docs/APIReference';
import WebSocket from './docs/WebSocket';
import Security from './docs/Security';

function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#08080d', fontFamily: "'DM Sans', sans-serif", color: '#555570',
      }}>Loading...</div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#08080d' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, padding: '32px 40px', flex: 1, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected — Dashboard */}
      <Route path="/" element={<AuthGuard><AppLayout><Overview /></AppLayout></AuthGuard>} />
      <Route path="/positions" element={<AuthGuard><AppLayout><Positions /></AppLayout></AuthGuard>} />
      <Route path="/trade" element={<AuthGuard><AppLayout><Trade /></AppLayout></AuthGuard>} />
      <Route path="/settings" element={<AuthGuard><AppLayout><Settings /></AppLayout></AuthGuard>} />

      {/* Protected — Docs */}
      <Route path="/docs" element={<AuthGuard><AppLayout><GettingStarted /></AppLayout></AuthGuard>} />
      <Route path="/docs/api" element={<AuthGuard><AppLayout><APIReference /></AppLayout></AuthGuard>} />
      <Route path="/docs/websocket" element={<AuthGuard><AppLayout><WebSocket /></AppLayout></AuthGuard>} />
      <Route path="/docs/security" element={<AuthGuard><AppLayout><Security /></AppLayout></AuthGuard>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
