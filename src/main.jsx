// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ToastContainer } from './components/Toast';
import App from './App';
import { globalStyles } from './theme';

// Inject global styles once at app startup
const styleEl = document.createElement('style');
styleEl.textContent = globalStyles;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        {/* ToastContainer for notifications - renders at app root */}
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
