import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { LanguageHtmlShell } from './components/LanguageHtmlShell.tsx'
import { ProgressSync } from './components/ProgressSync.tsx'

const clerkPubKey = String(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '').trim()

function MissingClerkPublishableKey() {
  return (
    <div
      style={{
        padding: 28,
        maxWidth: 560,
        margin: '0 auto',
        fontFamily: 'system-ui, sans-serif',
        lineHeight: 1.5,
        color: '#1a1f3a',
        background: '#fff8f0',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: 20, marginTop: 0 }}>Clerk is not configured on this deployment</h1>
      <p>
        This app is built with Vite. The publishable key must be present at <strong>build time</strong>{' '}
        as <code style={{ background: '#eee', padding: '2px 6px', borderRadius: 4 }}>VITE_CLERK_PUBLISHABLE_KEY</code>.
      </p>
      <p>
        In{' '}
        <a href="https://vercel.com/docs/projects/environment-variables">Vercel → Project → Settings → Environment Variables</a>
        , add your Clerk <strong>Publishable key</strong> (starts with <code>pk_</code>) for{' '}
        <strong>Production</strong>, then run <strong>Redeploy</strong>.
      </p>
      <p style={{ fontSize: 14, color: '#444' }}>
        Adding domains only in the Clerk dashboard does not inject this key. If you created{' '}
        <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> for Next.js docs, either rename it to{' '}
        <code>VITE_CLERK_PUBLISHABLE_KEY</code> on Vercel or keep both: this build also reads{' '}
        <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> as a fallback.
      </p>
    </div>
  )
}

export function mountApp(container: HTMLElement) {
  const root = createRoot(container)

  if (!clerkPubKey) {
    root.render(<MissingClerkPublishableKey />)
    return
  }

  root.render(
    <ErrorBoundary>
      <StrictMode>
        <ClerkProvider publishableKey={clerkPubKey}>
          <LanguageHtmlShell />
          <ProgressSync />
          <App />
        </ClerkProvider>
      </StrictMode>
    </ErrorBoundary>,
  )
}
