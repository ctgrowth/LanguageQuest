import { useState } from 'react'
import { getMissingFirebaseEnvKeys, isFirebaseConfigured } from '../firebase'
import { authActions, useAuthUser } from '../store/authStore'

export function AuthButton() {
  const user = useAuthUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <div className="hidden max-w-[12rem] truncate text-xs font-bold text-navy/70 sm:block">
            {user.displayName ?? user.email ?? 'Signed in'}
          </div>
          <button
            type="button"
            className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-extrabold text-navy ring-1 ring-navy/10 hover:bg-white"
            onClick={async () => {
              setError(null)
              setLoading(true)
              try {
                await authActions.signOut()
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Sign out failed')
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
          >
            Sign out
          </button>
        </>
      ) : (
        <button
          type="button"
          className="rounded-2xl bg-saffron px-4 py-2 text-sm font-extrabold text-cream shadow-sm ring-1 ring-saffron/30 hover:bg-[#FF8C00]/90"
          onClick={async () => {
            setError(null)
            setLoading(true)
            try {
              await authActions.signInWithGoogle()
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Sign in failed')
            } finally {
              setLoading(false)
            }
          }}
          disabled={loading}
        >
          Sign in with Google
        </button>
      )}

      {error ? (
        <div className="max-w-md text-left text-xs font-bold leading-snug text-red-700">{error}</div>
      ) : null}
      {!user && !isFirebaseConfigured() && import.meta.env.DEV ? (
        <p className="max-w-sm text-left text-xs text-navy/60">
          Add a <code className="rounded bg-navy/10 px-1">.env</code> (see{' '}
          <code className="rounded bg-navy/10 px-1">.env.example</code>) with all six{' '}
          <code className="rounded bg-navy/10 px-1">VITE_FIREBASE_*</code> keys, then restart{' '}
          <code className="rounded bg-navy/10 px-1">npm run dev</code>.
          {getMissingFirebaseEnvKeys().length ? (
            <>
              {' '}
              Missing: <span className="font-bold">{getMissingFirebaseEnvKeys().join(', ')}</span>.
            </>
          ) : null}
        </p>
      ) : null}
      {!user && !isFirebaseConfigured() && import.meta.env.PROD ? (
        <p className="max-w-sm text-left text-xs text-navy/60">
          Deployed without Firebase keys. In Vercel, set all six{' '}
          <code className="rounded bg-navy/10 px-1">VITE_FIREBASE_*</code> variables for{' '}
          <strong className="text-navy">Production</strong> and redeploy. In Firebase Auth, allow this
          domain and enable Google.
        </p>
      ) : null}
    </div>
  )
}

