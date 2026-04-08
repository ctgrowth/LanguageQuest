import { useSyncExternalStore } from 'react'
import type { LanguageId } from '../languages/config'
import { LANGUAGE_ORDER } from '../languages/config'

const STORAGE_KEY = 'hindiQuest.language.v1'

type Listener = () => void
const listeners = new Set<Listener>()

function isLanguageId(v: string | null): v is LanguageId {
  return v !== null && (LANGUAGE_ORDER as string[]).includes(v)
}

function readStoredLanguage(): LanguageId {
  if (typeof localStorage === 'undefined') return 'hi'
  const raw = localStorage.getItem(STORAGE_KEY)
  if (isLanguageId(raw)) return raw
  return 'hi'
}

let currentLanguage: LanguageId = readStoredLanguage()

function emit() {
  for (const l of listeners) l()
}

export function getLanguage(): LanguageId {
  return currentLanguage
}

export function subscribeLanguage(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useLanguage() {
  return useSyncExternalStore(subscribeLanguage, getLanguage, getLanguage)
}

/** Internal: persist choice and notify React; progressStore flushes previous lang before calling this. */
export function setStoredLanguage(next: LanguageId) {
  if (currentLanguage === next) return
  currentLanguage = next
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, next)
  emit()
}
