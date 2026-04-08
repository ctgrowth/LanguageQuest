import { useState } from 'react'
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

      {error ? <div className="text-xs font-bold text-red-700">{error}</div> : null}
    </div>
  )
}

