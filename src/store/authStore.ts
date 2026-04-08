import { useSyncExternalStore } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { getFirebaseAuth, getGoogleProvider } from '../firebase'

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
    if (!auth) throw new Error('Firebase is not configured. Add VITE_FIREBASE_* env vars.')
    const provider = getGoogleProvider()
    await signInWithPopup(auth, provider)
  },
  async signOut() {
    const auth = getFirebaseAuth()
    if (!auth) return
    await signOut(auth)
  },
}

