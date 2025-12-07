
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'
import './i18n'; // Import i18n configuration
import { ErrorBoundary } from './components/ui/error-boundary'
import { LoadingFallback } from './components/ui/loading-fallback'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>,
)
