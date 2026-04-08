import { useSyncExternalStore } from 'react'
import type { LanguageId } from '../languages/config'
import { getLanguage, setStoredLanguage } from './languageStore'

export type ProgressState = {
  xp: number
  streak: number
  hearts: number
  lastHeartTime: number | null
  completedLessons: string[]
  lastLessonCompletedDate: string | null
  updatedAt: number
}

const LEGACY_STORAGE_KEY = 'hindiQuest.progress.v1'
const MAX_HEARTS = 5
const HEART_REGEN_MS = 30 * 60 * 1000

export const XP_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500]

type Listener = () => void

function progressStorageKey(lang: LanguageId) {
  return `hindiQuest.progress.${lang}.v1`
}

let state: ProgressState = loadForLanguage(getLanguage())
const listeners = new Set<Listener>()
let cachedSnapshot: ProgressState = state

function emit() {
  for (const l of listeners) l()
}

function todayKey(d = new Date()) {
  // Local date key, stable across reloads.
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function daysBetween(aKey: string, bKey: string) {
  const [ay, am, ad] = aKey.split('-').map(Number)
  const [by, bm, bd] = bKey.split('-').map(Number)
  const a = new Date(ay, am - 1, ad).getTime()
  const b = new Date(by, bm - 1, bd).getTime()
  return Math.round((b - a) / (24 * 60 * 60 * 1000))
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function computeLevelFromXp(xp: number) {
  let level = 1
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1
  }
  return level
}

function regenHearts(s: ProgressState, now = Date.now()): ProgressState {
  if (s.hearts >= MAX_HEARTS) return { ...s, hearts: MAX_HEARTS }
  if (!s.lastHeartTime) return s

  const elapsed = now - s.lastHeartTime
  if (elapsed < HEART_REGEN_MS) return s

  const gained = Math.floor(elapsed / HEART_REGEN_MS)
  const newHearts = clamp(s.hearts + gained, 0, MAX_HEARTS)

  if (newHearts === s.hearts) return s

  const leftover = elapsed % HEART_REGEN_MS
  const newLast = newHearts >= MAX_HEARTS ? null : now - leftover

  return { ...s, hearts: newHearts, lastHeartTime: newLast }
}

function emptyProgress(): ProgressState {
  return {
    xp: 0,
    streak: 0,
    hearts: MAX_HEARTS,
    lastHeartTime: null,
    completedLessons: [],
    lastLessonCompletedDate: null,
    updatedAt: Date.now(),
  }
}

function parseProgress(raw: string): ProgressState {
  const parsed = JSON.parse(raw) as ProgressState
  return {
    xp: Number(parsed.xp ?? 0),
    streak: Number(parsed.streak ?? 0),
    hearts: clamp(Number(parsed.hearts ?? MAX_HEARTS), 0, MAX_HEARTS),
    lastHeartTime:
      parsed.lastHeartTime === null || parsed.lastHeartTime === undefined
        ? null
        : Number(parsed.lastHeartTime),
    completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
    lastLessonCompletedDate:
      parsed.lastLessonCompletedDate === null || parsed.lastLessonCompletedDate === undefined
        ? null
        : String(parsed.lastLessonCompletedDate),
    updatedAt: Number(parsed.updatedAt ?? Date.now()),
  }
}

function loadForLanguage(lang: LanguageId): ProgressState {
  try {
    let raw = localStorage.getItem(progressStorageKey(lang))
    if (!raw && lang === 'hi') {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacy) {
        raw = legacy
        localStorage.setItem(progressStorageKey('hi'), legacy)
      }
    }
    if (!raw) return emptyProgress()
    return parseProgress(raw)
  } catch {
    return emptyProgress()
  }
}

function saveForLanguage(lang: LanguageId, next: ProgressState) {
  localStorage.setItem(progressStorageKey(lang), JSON.stringify(next))
}

function commit(next: ProgressState) {
  state = next
  cachedSnapshot = next
  saveForLanguage(getLanguage(), next)
  emit()
}

function setState(updater: (prev: ProgressState) => ProgressState) {
  const now = Date.now()
  const prev = regenHearts(state, now)
  const next = regenHearts({ ...updater(prev), updatedAt: now }, now)
  commit(next)
}

export function replaceProgress(next: ProgressState) {
  commit({ ...next, updatedAt: next.updatedAt ?? Date.now() })
}

export function getProgressSnapshot() {
  // Must be referentially stable unless state actually changed.
  return cachedSnapshot
}

export function subscribeProgress(listener: Listener) {
  listeners.add(listener)
  // Heart regeneration tick: update store outside render.
  let interval: number | null = null
  if (typeof window !== 'undefined') {
    interval = window.setInterval(() => {
      const next = regenHearts(state, Date.now())
      if (next !== state) commit(next)
    }, 5000)
  }
  return () => {
    listeners.delete(listener)
    if (interval !== null) window.clearInterval(interval)
  }
}

export function useProgress() {
  return useSyncExternalStore(subscribeProgress, getProgressSnapshot, getProgressSnapshot)
}

export const progressActions = {
  switchLanguage(next: LanguageId) {
    if (typeof window === 'undefined') return
    if (getLanguage() === next) return
    const prev = getLanguage()
    saveForLanguage(prev, state)
    setStoredLanguage(next)
    state = loadForLanguage(next)
    cachedSnapshot = state
    emit()
  },
  awardXp(amount: number) {
    setState((s) => ({ ...s, xp: Math.max(0, s.xp + Math.max(0, amount)) }))
  },
  loseHeart() {
    setState((s) => {
      const nextHearts = clamp(s.hearts - 1, 0, MAX_HEARTS)
      const now = Date.now()
      return {
        ...s,
        hearts: nextHearts,
        lastHeartTime: nextHearts < MAX_HEARTS ? s.lastHeartTime ?? now : null,
      }
    })
  },
  refillHearts() {
    setState((s) => ({ ...s, hearts: MAX_HEARTS, lastHeartTime: null }))
  },
  markLessonComplete(lessonId: string) {
    setState((s) => {
      const completed = s.completedLessons.includes(lessonId)
        ? s.completedLessons
        : [...s.completedLessons, lessonId]

      const today = todayKey()
      let streak = s.streak
      if (!s.lastLessonCompletedDate) {
        streak = 1
      } else {
        const diff = daysBetween(s.lastLessonCompletedDate, today)
        if (diff === 0) {
          streak = s.streak
        } else if (diff === 1) {
          streak = s.streak + 1
        } else if (diff > 1) {
          streak = 1
        }
      }

      return {
        ...s,
        completedLessons: completed,
        streak,
        lastLessonCompletedDate: today,
      }
    })
  },
}

export function getLevel(xp: number) {
  return computeLevelFromXp(xp)
}

export function getLevelProgress(xp: number) {
  const level = computeLevelFromXp(xp)
  const levelStart = XP_THRESHOLDS[level - 1] ?? 0
  const levelEnd = XP_THRESHOLDS[level] ?? levelStart + 500
  const within = xp - levelStart
  const span = Math.max(1, levelEnd - levelStart)
  return { level, levelStart, levelEnd, pct: clamp(within / span, 0, 1) }
}

