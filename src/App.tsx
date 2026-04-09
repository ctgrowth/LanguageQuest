import {
  AuthenticateWithRedirectCallback,
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MissingClerkPublishableKey } from './components/MissingClerkPublishableKey'
import { DashboardScreen } from './screens/DashboardScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LessonScreen } from './screens/LessonScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { SettingsScreen } from './screens/SettingsScreen'

function RouteTransitions() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -14 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/lesson/:unitId" element={<LessonScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route
            path="/sso-callback"
            element={
              <AuthenticateWithRedirectCallback
                signInFallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <DashboardScreen />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn redirectUrl="/dashboard" />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function ClerkProviderWithRouter({ publishableKey }: { publishableKey: string }) {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      routerPush={(to) => {
        void navigate(to)
      }}
      routerReplace={(to) => {
        void navigate(to, { replace: true })
      }}
    >
      <RouteTransitions />
    </ClerkProvider>
  )
}

export default function App({ clerkPublishableKey }: { clerkPublishableKey: string }) {
  const key = clerkPublishableKey.trim()
  if (!key) {
    return <MissingClerkPublishableKey />
  }

  return (
    <BrowserRouter>
      <ClerkProviderWithRouter publishableKey={key} />
    </BrowserRouter>
  )
}
