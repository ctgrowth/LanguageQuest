import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

function env(name: string) {
  // Vite exposes env vars on import.meta.env
  return (import.meta as unknown as { env: Record<string, string | undefined> }).env[name]
}

const firebaseConfig = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: env('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: env('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}

function hasConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId)
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

