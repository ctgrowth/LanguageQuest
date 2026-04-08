import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageHtmlShell } from './components/LanguageHtmlShell.tsx'
import { ProgressSync } from './components/ProgressSync.tsx'

export function mountApp(container: HTMLElement) {
  const root = createRoot(container)
  root.render(
    <ErrorBoundary>
      <StrictMode>
        <LanguageHtmlShell />
        <ProgressSync />
        <App />
      </StrictMode>
    </ErrorBoundary>,
  )
}
