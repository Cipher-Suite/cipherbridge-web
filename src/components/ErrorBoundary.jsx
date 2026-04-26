// src/components/ErrorBoundary.jsx
import React from 'react';
import { T } from '../theme';

/**
 * ErrorBoundary catches errors in child components and displays a fallback UI
 * This prevents the entire app from crashing on a single component error
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Error Info:', errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Optional: Report error to error tracking service (Sentry, etc.)
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: T.bg,
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: 500,
              textAlign: 'center',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 48,
                marginBottom: 20,
                opacity: 0.8,
              }}
            >
              ⚠️
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: T.font,
                fontSize: 28,
                fontWeight: 700,
                color: T.red,
                marginBottom: 12,
                letterSpacing: '-0.02em',
              }}
            >
              Something went wrong
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: T.font,
                fontSize: 14,
                color: T.textMuted,
                marginBottom: 8,
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred while rendering this page.
              {this.state.errorCount > 1 && ` (Error #${this.state.errorCount})`}
            </p>

            {/* Dev error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginTop: 24,
                  marginBottom: 24,
                  padding: 14,
                  background: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <summary
                  style={{
                    color: T.textMuted,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  📋 Error details (dev only)
                </summary>
                <pre
                  style={{
                    marginTop: 12,
                    overflow: 'auto',
                    color: T.red,
                    fontSize: 11,
                    fontFamily: T.mono,
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '200px',
                  }}
                >
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div
              style={{
                display: 'flex',
                gap: 10,
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: T.accent,
                  color: T.bg,
                  border: 'none',
                  borderRadius: T.radiusSm,
                  fontFamily: T.font,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: T.transition,
                }}
                onMouseOver={(e) => (e.target.style.background = T.accentDim)}
                onMouseOut={(e) => (e.target.style.background = T.accent)}
              >
                Try again
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                style={{
                  padding: '12px 24px',
                  background: 'transparent',
                  color: T.textMuted,
                  border: `1px solid ${T.border}`,
                  borderRadius: T.radiusSm,
                  fontFamily: T.font,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: T.transition,
                }}
                onMouseOver={(e) => {
                  e.target.style.background = T.bgCard;
                  e.target.style.color = T.text;
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = T.textMuted;
                }}
              >
                Go home
              </button>
            </div>

            {/* Support message */}
            <p
              style={{
                fontFamily: T.font,
                fontSize: 12,
                color: T.textDim,
                marginTop: 24,
              }}
            >
              If this keeps happening, please contact support.
            </p>
          </div>

          <style>{`
            @keyframes fadeUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}
