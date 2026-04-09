/**
 * Run from repo root: npm run check-env
 * Reports which VITE_FIREBASE_* keys are set (does not print secret values).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const envPath = path.join(root, '.env')

const KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

let text = ''
try {
  text = fs.readFileSync(envPath, 'utf8')
} catch {
  console.error(`No .env file at:\n  ${envPath}\n\nCopy .env.example to .env in this folder (same place as package.json).`)
  process.exit(1)
}

function valueFor(key) {
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    if (!t.startsWith(key + '=')) continue
    const rest = t.slice(key.length + 1).trim()
    return rest.replace(/^["']|["']$/g, '')
  }
  return ''
}

console.log(`Checking: ${envPath}\n`)
let bad = false
for (const k of KEYS) {
  const v = valueFor(k)
  if (!v) {
    console.log(`  ✗ ${k}`)
    bad = true
  } else {
    console.log(`  ✓ ${k} (${v.length} characters)`)
  }
}

if (bad) {
  console.log(`
All keys must have non-empty values after the = sign.
1. Open https://console.firebase.google.com
2. Project settings (gear) → Your apps → Web app → copy firebaseConfig
3. Paste each value into .env (this file only — not the browser alone)
4. Save the file, then stop and run: npm run dev
`)
  process.exit(1)
}

console.log('\nFirebase env looks good. Restart dev server if you just edited .env.\n')
