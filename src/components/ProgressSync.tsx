import { useEffect, useRef } from 'react'
import { useAuthUser } from '../store/authStore'
import { useLanguage } from '../store/languageStore'
import { getProgressSnapshot, replaceProgress, subscribeProgress } from '../store/progressStore'
import { loadCloudProgress, saveCloudProgress } from '../store/cloudProgress'

export function ProgressSync() {
  const user = useAuthUser()
  const lang = useLanguage()
  const loadedForKey = useRef<string | null>(null)
  const pendingSave = useRef<number | null>(null)

  useEffect(() => {
    const uid = user?.uid ?? null
    if (!uid) {
      loadedForKey.current = null
      return
    }

    const key = `${uid}:${lang}`
    if (loadedForKey.current === key) return
    loadedForKey.current = key

    ;(async () => {
      const cloud = await loadCloudProgress(uid, lang)
      if (!cloud) return
      const local = getProgressSnapshot()
      if ((cloud.updatedAt ?? 0) > (local.updatedAt ?? 0)) {
        replaceProgress(cloud)
      }
    })()
  }, [user?.uid, lang])

  useEffect(() => {
    if (!user?.uid) return

    const unsub = subscribeProgress(() => {
      if (pendingSave.current) window.clearTimeout(pendingSave.current)
      pendingSave.current = window.setTimeout(() => {
        pendingSave.current = null
        void saveCloudProgress(user.uid, lang, getProgressSnapshot())
      }, 600)
    })

    return () => {
      if (pendingSave.current) window.clearTimeout(pendingSave.current)
      pendingSave.current = null
      unsub()
    }
  }, [user?.uid, lang])

  return null
}
