import { useCallback, useState } from 'react'
import { useAuth, useClerk, useSignIn } from '@clerk/clerk-react'

export function ClerkGoogleButton({
  className,
  redirectTo = '/dashboard',
}: {
  className?: string
  redirectTo?: string
}) {
  const { isSignedIn } = useAuth()
  const clerk = useClerk()
  const { signIn } = useSignIn()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClick = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      if (isSignedIn) {
        await clerk.signOut({ redirectUrl: '/' })
        return
      }
      if (!signIn) throw new Error('Clerk is not ready yet. Try again in a moment.')
      // OAuth must return to /sso-callback first; that route runs AuthenticateWithRedirectCallback.
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: redirectTo,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed')
      setLoading(false)
    }
  }, [clerk, isSignedIn, redirectTo, signIn])

  const btnBase =
    'rounded-2xl bg-saffron px-4 py-2 text-sm font-extrabold text-cream shadow-sm ring-1 ring-saffron/30 hover:bg-[#FF8C00]/90'

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <button
        type="button"
        className={[btnBase, className].filter(Boolean).join(' ')}
        onClick={onClick}
        disabled={loading}
      >
        {isSignedIn ? 'Sign out' : 'Sign in with Google'}
      </button>
      {error ? (
        <div className="max-w-full text-left text-xs font-bold leading-snug text-red-700 sm:max-w-md">
          {error}
        </div>
      ) : null}
    </div>
  )
}

