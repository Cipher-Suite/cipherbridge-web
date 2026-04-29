// src/components/Toast.jsx
import { useState, useEffect } from 'react';
import { T } from '../theme';
import { setToastCallback } from '../hooks/useToast';

/**
 * Toast notification message with auto-dismiss
 */
function Toast({ toast, onClose }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      // Wait for exit animation to complete
      setTimeout(onClose, 200);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  // Color scheme by type
  const typeColors = {
    success: { bg: T.greenBg, border: T.green, icon: '✓' },
    error: { bg: T.redBg, border: T.red, icon: '✕' },
    warning: { bg: T.orangeBg, border: T.orange, icon: '!' },
    info: { bg: T.blueBg, border: T.blue, icon: 'ℹ' },
  };

  const colors = typeColors[toast.type] || typeColors.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: T.radiusSm,
        fontFamily: T.font,
        fontSize: 14,
        color: colors.border,
        animation: exiting
          ? 'toast-slide-out 0.2s ease forwards'
          : 'toast-slide-in 0.2s ease forwards',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        maxWidth: '90vw',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Icon */}
      <span style={{ fontSize: 16, flexShrink: 0 }}>{colors.icon}</span>

      {/* Message */}
      <span style={{ flex: 1, wordBreak: 'break-word' }}>{toast.message}</span>

      {/* Close button */}
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(onClose, 200);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: colors.border,
          cursor: 'pointer',
          fontSize: 16,
          opacity: 0.7,
          transition: T.transition,
          padding: 4,
          flexShrink: 0,
        }}
        onMouseOver={(e) => (e.target.style.opacity = 1)}
        onMouseOut={(e) => (e.target.style.opacity = 0.7)}
      >
        ✕
      </button>

      <style>{`
        @keyframes toast-slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes toast-slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Toast container that manages all toast notifications
 * Should be placed once in App or main.jsx
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Register the callback when component mounts
  useEffect(() => {
    setToastCallback(({ type, message, duration }) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    });

    // Cleanup
    return () => setToastCallback(null);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 400,
        pointerEvents: 'none', // Don't block clicks behind toasts
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto', // Enable clicks on toasts themselves
          }}
        >
          <Toast
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          [style*="position: fixed"][style*="bottom: 24px"] {
            bottom: 16px !important;
            right: 16px !important;
            left: 16px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  );
}
