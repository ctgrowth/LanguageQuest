import { useSyncExternalStore } from 'react'

export type SettingsState = {
  autoPronounce: boolean
  /** When true, typed answers match transliteration without tone marks / diacritics (e.g. ni hao vs nǐ hǎo). */
  ignoreTonesInTyping: boolean
}

const STORAGE_KEY = 'hindiQuest.settings.v1'

type Listener = () => void
const listeners = new Set<Listener>()

let state: SettingsState = load()

function emit() {
  for (const l of listeners) l()
}

function load(): SettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { autoPronounce: false, ignoreTonesInTyping: false }
    const parsed = JSON.parse(raw) as Partial<SettingsState>
    return {
      autoPronounce: Boolean(parsed.autoPronounce),
      ignoreTonesInTyping: Boolean(parsed.ignoreTonesInTyping),
    }
  } catch {
    return { autoPronounce: false, ignoreTonesInTyping: false }
  }
}

function save(next: SettingsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

function setState(updater: (prev: SettingsState) => SettingsState) {
  state = updater(state)
  save(state)
  emit()
}

export function getSettingsSnapshot() {
  return state
}

export function subscribeSettings(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSettings() {
  return useSyncExternalStore(subscribeSettings, getSettingsSnapshot, getSettingsSnapshot)
}

export const settingsActions = {
  setAutoPronounce(autoPronounce: boolean) {
    setState((s) => ({ ...s, autoPronounce }))
  },
  setIgnoreTonesInTyping(ignoreTonesInTyping: boolean) {
    setState((s) => ({ ...s, ignoreTonesInTyping }))
  },
}

