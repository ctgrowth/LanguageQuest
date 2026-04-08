import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { LanguageId } from '../languages/config'
import { getDb } from '../firebase'
import type { ProgressState } from './progressStore'

type CloudDoc = ProgressState & { updatedAt: number; serverUpdatedAt?: unknown }

function normalizeProgress(data: Partial<CloudDoc>): ProgressState | null {
  if (typeof data.xp !== 'number' || typeof data.hearts !== 'number') return null
  return {
    xp: Number(data.xp ?? 0),
    streak: Number(data.streak ?? 0),
    hearts: Number(data.hearts ?? 5),
    lastHeartTime: data.lastHeartTime === null || data.lastHeartTime === undefined ? null : Number(data.lastHeartTime),
    completedLessons: Array.isArray(data.completedLessons) ? data.completedLessons.map(String) : [],
    lastLessonCompletedDate:
      data.lastLessonCompletedDate === null || data.lastLessonCompletedDate === undefined
        ? null
        : String(data.lastLessonCompletedDate),
    updatedAt: Number(data.updatedAt ?? Date.now()),
  }
}

export async function loadCloudProgress(
  uid: string,
  lang: LanguageId,
): Promise<ProgressState | null> {
  const db = getDb()
  if (!db) return null
  const ref = doc(db, 'users', uid, 'public', 'progress')
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as Record<string, unknown>
  if (!data) return null

  const langs = data.langs as Record<string, Partial<CloudDoc>> | undefined
  if (langs && typeof langs === 'object' && langs[lang]) {
    return normalizeProgress(langs[lang])
  }

  // Legacy: single merged document treated as Hindi progress.
  if (lang === 'hi' && typeof data.xp === 'number') {
    return normalizeProgress(data as Partial<CloudDoc>)
  }

  return null
}

export async function saveCloudProgress(uid: string, lang: LanguageId, progress: ProgressState) {
  const db = getDb()
  if (!db) return
  const ref = doc(db, 'users', uid, 'public', 'progress')
  await setDoc(
    ref,
    {
      langs: {
        [lang]: { ...progress, updatedAt: progress.updatedAt },
      },
      serverUpdatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
