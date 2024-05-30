import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App.jsx';
import { ErrorFallback } from '~/pages';
import { DarkModeProvider } from './contexts/index.js';
import GlobalStyles from '~/styles/GlobalStyles';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <>
        <GlobalStyles />

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.replace('/')}
        >
          <App />
        </ErrorBoundary>
      </>
    </DarkModeProvider>
  </React.StrictMode>
);
