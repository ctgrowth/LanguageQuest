import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageHtmlShell } from './components/LanguageHtmlShell.tsx'
import { ProgressSync } from './components/ProgressSync.tsx'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

export function mountApp(container: HTMLElement) {
  const root = createRoot(container)
  root.render(
    <ErrorBoundary>
      <StrictMode>
        <ClerkProvider publishableKey={clerkPubKey ?? ''}>
          <LanguageHtmlShell />
          <ProgressSync />
          <App />
        </ClerkProvider>
      </StrictMode>
    </ErrorBoundary>,
  )
}
