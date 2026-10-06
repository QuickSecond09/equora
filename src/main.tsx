import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept uncaught transient network promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const errorStr = String(event.reason?.message || event.reason || '');
    if (
      errorStr.includes('Failed to fetch') ||
      errorStr.includes('NetworkError') ||
      errorStr.includes('Load failed')
    ) {
      event.preventDefault();
      console.warn('Intercepted background fetch rejection:', event.reason);
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
