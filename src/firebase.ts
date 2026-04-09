import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function env(name: string) {
  // Vite exposes env vars on import.meta.env
  return (import.meta as unknown as { env: Record<string, string | undefined> }).env[name]
}

const FIREBASE_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}

function hasConfig() {
  return FIREBASE_ENV_KEYS.every((k) => {
    const v = env(k)
    return Boolean(v && String(v).trim())
  })
}

/** Env keys present in import.meta.env but empty or unset (names only, for debugging). */
export function getMissingFirebaseEnvKeys(): string[] {
  return FIREBASE_ENV_KEYS.filter((k) => {
    const v = env(k)
    return !v || !String(v).trim()
  })
}

/** True when Vite embedded the full Firebase Web app config (build-time for production). */
export function isFirebaseConfigured() {
  return hasConfig()
}

let app: FirebaseApp | null = null

export function getFirebaseApp() {
  if (!hasConfig()) return null
  if (!app) app = initializeApp(firebaseConfig)
  return app
}

export function getFirebaseAuth() {
  const a = getFirebaseApp()
  if (!a) return null
  return getAuth(a)
}

export function getGoogleProvider() {
  const p = new GoogleAuthProvider()
  p.setCustomParameters({ prompt: 'select_account' })
  return p
}

export function getDb() {
  const a = getFirebaseApp()
  if (!a) return null
  return getFirestore(a)
}

