import { Link } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'

export function DashboardScreen() {
  const { user } = useUser()
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between gap-4" dir="ltr">
        <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
          ← Home
        </Link>
        <div className="text-sm font-extrabold text-navy">Dashboard</div>
        <UserButton />
      </header>

      <main className="mt-10 flex-1">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-xs font-bold uppercase tracking-wide text-navy/50">Signed in as</div>
          <div className="mt-2 text-lg font-extrabold text-navy">
            {user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? 'User'}
          </div>
          <div className="mt-2 text-sm text-navy/70">
            This route is protected by Clerk. Only logged-in users can see it.
          </div>
        </div>
      </main>
    </div>
  )
}

