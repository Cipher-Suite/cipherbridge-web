// src/layouts/Sidebar.jsx
import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { T } from '../theme';
import { useAuth } from '../auth/AuthContext';

const NAV = {
  app: [
    { to: '/dashboard',          label: 'Overview',   icon: '⬡' },
    { to: '/positions', label: 'Positions',  icon: '◈' },
    { to: '/trade',     label: 'New Order',  icon: '↗' },
    { to: '/webhooks',  label: 'Webhooks',   icon: '⟳' },
    { to: '/billing',   label: 'Billing',   icon: '◎' },
    { to: '/settings',  label: 'Settings',   icon: '⚙' },
  ],
  docs: [
    { to: '/docs',             label: 'Getting Started', icon: '▸' },
    { to: '/docs/api',         label: 'API Reference',   icon: '▸' },
    { to: '/docs/websocket',   label: 'WebSocket',       icon: '▸' },
    { to: '/docs/security',    label: 'Security',        icon: '▸' },
  ],
  admin: [
    { to: '/admin',            label: 'Users',     icon: '◉' },
    { to: '/admin/nodes',      label: 'Nodes',     icon: '◎' },
  ],
};

function NavItem({ item, location, onClick }) {
  const exact = item.to === '/';
  const isActive = exact ? location.pathname === '/dashboard' : location.pathname.startsWith(item.to);
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        padding: '10px 13px', marginBottom: 2, borderRadius: T.radiusSm,
        textDecoration: 'none',
        background: isActive ? T.accentBg : 'transparent',
        color: isActive ? T.accent : T.textMuted,
        fontFamily: T.font, fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        transition: T.transition,
        borderLeft: isActive ? `2px solid ${T.accent}` : '2px solid transparent',
      }}
    >
      <span style={{ fontSize: 13, width: 16, textAlign: 'center', flexShrink: 0, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
      {item.label}
    </NavLink>
  );
}

function SidebarContent({ onClose }) {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isDocs   = location.pathname.startsWith('/docs');
  const isAdminR = location.pathname.startsWith('/admin');
  const section  = isAdminR ? 'admin' : isDocs ? 'docs' : 'app';
  const items    = NAV[section] || NAV.app;

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '18px 20px 20px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: `linear-gradient(135deg, ${T.accent} 0%, ${T.blue} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: T.bg, fontFamily: T.font,
            flexShrink: 0, boxShadow: T.shadowAccent,
          }}>T</div>
          <div>
            <span style={{ fontFamily: T.font, fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: '-0.03em', display: 'block', lineHeight: 1.1 }}>Tonpo</span>
            <span style={{ fontFamily: T.font, fontSize: 10, color: T.textDim, letterSpacing: '0.04em' }}>GATEWAY</span>
          </div>
        </div>
      </div>

      {/* Section toggle */}
      <div style={{ display: 'flex', margin: '14px 12px 6px', borderRadius: T.radiusSm, overflow: 'hidden', border: `1px solid ${T.border}`, background: T.bgInput }}>
        {[
          { key: 'app',   label: 'App',   to: '/'     },
          { key: 'docs',  label: 'Docs',  to: '/docs' },
          ...(isAdmin ? [{ key: 'admin', label: 'Admin', to: '/admin' }] : []),
        ].map(s => (
          <NavLink key={s.key} to={s.to} onClick={onClose} style={{
            flex: 1, padding: '8px 0', textAlign: 'center', textDecoration: 'none',
            fontFamily: T.font, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: section === s.key ? T.accentBg : 'transparent',
            color: section === s.key ? T.accent : T.textDim,
            transition: T.transition,
          }}>{s.label}</NavLink>
        ))}
      </div>

      {/* Nav items */}
      <nav style={{ padding: '6px 10px', flex: 1, overflowY: 'auto' }}>
        {items.map(item => (
          <NavItem key={item.to} item={item} location={location} onClick={onClose} />
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: T.bgCardHover,
            border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.accent, flexShrink: 0,
          }}>{(user?.userId || 'U')[0].toUpperCase()}</div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.userId?.slice(0, 12)}…
            </div>
            <div style={{ fontFamily: T.font, fontSize: 10, color: isAdmin ? T.accent : T.textDim }}>
              {isAdmin ? '● Admin' : 'Connected'}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '8px 0', borderRadius: T.radiusSm, background: 'transparent',
          border: `1px solid ${T.border}`, color: T.textDim, fontFamily: T.font,
          fontSize: 12, cursor: 'pointer', transition: T.transition,
        }}>Sign out</button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobile,    setMobile]  = useState(false);
  const [menuOpen,  setMenuOpen] = useState(false);

  const checkBreakpoint = useCallback(() => {
    setMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [checkBreakpoint]);

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (mobile) {
    return (
      <>
        {/* Top bar with hamburger */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: T.topBarHeight,
          background: T.bgSurface, borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: `linear-gradient(135deg, ${T.accent}, ${T.blue})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 900, color: T.bg,
            }}>T</div>
            <span style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.text, letterSpacing: '-0.02em' }}>Tonpo</span>
          </div>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
              color: T.textMuted, cursor: 'pointer', padding: '7px 10px', display: 'flex',
              flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ display: 'block', width: 16, height: 1.5, background: menuOpen ? T.accent : T.textMuted, transition: T.transition, transform: menuOpen ? 'rotate(45deg) translateY(5px)' : 'none', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 16, height: 1.5, background: menuOpen ? 'transparent' : T.textMuted, transition: T.transition, borderRadius: 2 }} />
            <span style={{ display: 'block', width: 16, height: 1.5, background: menuOpen ? T.accent : T.textMuted, transition: T.transition, transform: menuOpen ? 'rotate(-45deg) translateY(-5px)' : 'none', borderRadius: 2 }} />
          </button>
        </div>

        {/* Overlay */}
        {menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 150, background: T.bgOverlay, backdropFilter: 'blur(4px)', animation: 'fadeIn 0.15s ease' }}
          />
        )}

        {/* Slide-in drawer */}
        <aside style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 200,
          width: 260, background: T.bgSurface, borderRight: `1px solid ${T.border}`,
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          boxShadow: menuOpen ? T.shadowLg : 'none',
        }}>
          <SidebarContent onClose={() => setMenuOpen(false)} />
        </aside>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside style={{
      width: T.sidebarWidth, minHeight: '100vh', background: T.bgSurface,
      borderRight: `1px solid ${T.border}`, position: 'fixed', left: 0, top: 0, zIndex: 50,
    }}>
      <SidebarContent />
    </aside>
  );
}
