import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageHtmlShell } from './components/LanguageHtmlShell.tsx'
import { MissingClerkPublishableKey } from './components/MissingClerkPublishableKey.tsx'
import { ProgressSync } from './components/ProgressSync.tsx'

const clerkPubKey = String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '').trim()

export function mountApp(container: HTMLElement) {
  const root = createRoot(container)

  if (!clerkPubKey) {
    root.render(<MissingClerkPublishableKey />)
    return
  }

  root.render(
    <ErrorBoundary>
      <StrictMode>
        <LanguageHtmlShell />
        <ProgressSync />
        <App clerkPublishableKey={clerkPubKey} />
      </StrictMode>
    </ErrorBoundary>,
  )
}
