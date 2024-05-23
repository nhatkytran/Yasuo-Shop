import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App.jsx';
import { ErrorFallback } from '~/pages';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace('/')}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
