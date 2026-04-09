import { useSyncExternalStore } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirebaseAuth, getGoogleProvider, getMissingFirebaseEnvKeys } from '../firebase'

type Listener = () => void

let user: User | null = null
const listeners = new Set<Listener>()
let started = false

function emit() {
  for (const l of listeners) l()
}

function ensureListener() {
  if (started) return
  started = true
  const auth = getFirebaseAuth()
  if (!auth) return
  onAuthStateChanged(auth, (u) => {
    user = u
    emit()
  })
}

export function getAuthSnapshot() {
  ensureListener()
  return user
}

export function subscribeAuth(listener: Listener) {
  ensureListener()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useAuthUser() {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, getAuthSnapshot)
}

export const authActions = {
  async signInWithGoogle() {
    const auth = getFirebaseAuth()
    if (!auth) {
      const missing = getMissingFirebaseEnvKeys()
      if (import.meta.env.PROD) {
        throw new Error(
          [
            'Google sign-in is not wired up on this deployment.',
            'In Vercel → Project → Settings → Environment Variables, add every key from .env.example (all six VITE_FIREBASE_* values) for Production, save, then redeploy.',
            'In Firebase → Authentication → Sign-in method, enable Google.',
            'In Firebase → Authentication → Settings → Authorized domains, add your exact site host (e.g. language-quest-nu.vercel.app).',
          ].join(' '),
        )
      }
      throw new Error(
        [
          'Firebase is not configured.',
          missing.length
            ? `Missing or empty: ${missing.join(', ')}.`
            : 'No VITE_FIREBASE_* values loaded.',
          'Copy .env.example to .env, paste Web app keys from Firebase Console, restart npm run dev.',
          'Enable Google sign-in and add localhost / 127.0.0.1 under Authorized domains.',
        ].join(' '),
      )
    }
    const provider = getGoogleProvider()
    await signInWithPopup(auth, provider)
  },
  async signOut() {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  },
}

