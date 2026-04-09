import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { HomeScreen } from './screens/HomeScreen'
import { LessonScreen } from './screens/LessonScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { DashboardScreen } from './screens/DashboardScreen'

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

function App() {
  return (
    <BrowserRouter>
      <RouteTransitions />
    </BrowserRouter>
  )
}

export default App
