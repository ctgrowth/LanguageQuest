import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getLessonUnits } from '../data/lessonRegistry'
import { LANG_CONFIG, LANGUAGE_ORDER, type LanguageId } from '../languages/config'
import { useLanguage } from '../store/languageStore'
import { getLevelProgress, progressActions, useProgress } from '../store/progressStore'
import { ClerkGoogleButton } from '../components/ClerkGoogleButton'
import { SignedIn } from '@clerk/clerk-react'

function HeartRow({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Hearts: ${hearts} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < hearts
        return (
          <div
            key={i}
            className={[
              'h-4 w-4 rounded-full ring-1',
              filled ? 'bg-saffron ring-saffron/30' : 'bg-white ring-navy/15',
            ].join(' ')}
          />
        )
      })}
    </div>
  )
}

export function HomeScreen() {
  const lang = useLanguage()
  const lessonUnits = getLessonUnits(lang)
  const progress = useProgress()
  const { level, pct, levelEnd } = getLevelProgress(progress.xp)

  const completed = new Set(progress.completedLessons)
  const unlocked = new Set<string>()
  for (let i = 0; i < lessonUnits.length; i++) {
    const unit = lessonUnits[i]
    const prev = lessonUnits[i - 1]
    const isUnlocked = i === 0 || (prev ? completed.has(prev.id) : false)
    if (isUnlocked) unlocked.add(unit.id)
  }
  const currentIndex = lessonUnits.findIndex((u) => unlocked.has(u.id) && !completed.has(u.id))
  const currentId =
    currentIndex === -1
      ? [...lessonUnits].reverse().find((u) => unlocked.has(u.id))?.id
      : lessonUnits[currentIndex]?.id

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between gap-6" dir="ltr">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-wide text-navy/60">Language Quest</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-navy">
            Skill Tree
          </div>
          <label className="mt-3 block text-xs font-bold text-navy/50" htmlFor="home-lang">
            Language
          </label>
          <select
            id="home-lang"
            value={lang}
            onChange={(e) => progressActions.switchLanguage(e.target.value as LanguageId)}
            className="mt-1 w-full max-w-[220px] rounded-xl border border-navy/15 bg-white px-3 py-2 text-sm font-bold text-navy shadow-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 sm:max-w-xs"
            aria-label="Learning language"
          >
            {LANGUAGE_ORDER.map((id) => (
              <option key={id} value={id}>
                {LANG_CONFIG[id].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🔥</span>
            <span className="text-sm font-bold text-navy">{progress.streak}</span>
          </div>
          <HeartRow hearts={progress.hearts} />
          <div className="hidden sm:block">
            <ClerkGoogleButton />
          </div>
        </div>
      </header>

      <div className="mt-6 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-navy/10" dir="ltr">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-navy/70">
            Level {level}
          </div>
          <div className="text-xs text-navy/60">{progress.xp} / {levelEnd} XP</div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-cream ring-1 ring-navy/10">
          <div
            className="h-full rounded-full bg-saffron"
            style={{ width: `${Math.round(pct * 100)}%` }}
            aria-label={`XP progress: ${Math.round(pct * 100)} percent`}
          />
        </div>
      </div>

      <main className="mt-8 flex-1">
        <div className="relative mx-auto max-w-sm">
          <div className="absolute left-1/2 top-1 h-[calc(100%-8px)] w-1 -translate-x-1/2 rounded-full bg-navy/10" />

          <div className="space-y-5">
            {lessonUnits.map((u, idx) => {
              const isCompleted = completed.has(u.id)
              const isCurrent = u.id === currentId
              const isLocked = !unlocked.has(u.id)

              const node = (
                <div className="relative flex items-center justify-center">
                  <div className="absolute left-1/2 top-1/2 -z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40 blur-md" />

                  <motion.div
                    className={[
                      'grid h-14 w-14 place-items-center rounded-full text-lg shadow-sm ring-2',
                      isCompleted
                        ? 'bg-saffron text-cream ring-saffron/30'
                        : isCurrent
                          ? 'bg-white text-navy ring-blue-500/60'
                          : isLocked
                            ? 'bg-white/60 text-navy/30 ring-navy/10'
                            : 'bg-white text-navy ring-navy/15',
                    ].join(' ')}
                    animate={
                      isCurrent
                        ? { boxShadow: ['0 0 0 0 rgba(59,130,246,0.0)', '0 0 0 10px rgba(59,130,246,0.15)', '0 0 0 0 rgba(59,130,246,0.0)'] }
                        : undefined
                    }
                    transition={isCurrent ? { duration: 1.6, repeat: Infinity } : undefined}
                  >
                    <span aria-hidden="true">{isLocked ? '🔒' : (u.emoji ?? '⭐')}</span>
                  </motion.div>
                </div>
              )

              const card = (
                <div className="mt-2 text-center">
                  <div className="text-sm font-extrabold text-navy">
                    <span className="text-navy/50">{idx + 1}.</span> {u.title}
                  </div>
                  <div className="mt-1 text-xs text-navy/60">{u.xpReward} XP</div>
                </div>
              )

              return (
                <div
                  key={u.id}
                  className={idx % 2 === 0 ? 'ml-0 mr-auto w-fit' : 'ml-auto mr-0 w-fit'}
                >
                  {isLocked ? (
                    <div className="block cursor-not-allowed opacity-60" aria-disabled="true">
                      {node}
                      {card}
                    </div>
                  ) : (
                    <Link to={`/lesson/${u.id}`} className="block focus:outline-none">
                      {node}
                      {card}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <footer className="mt-10 flex items-center justify-between rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-navy/10" dir="ltr">
        <Link to="/" className="text-sm font-bold text-navy">
          Home
        </Link>
        <SignedIn>
          <Link to="/dashboard" className="text-sm font-bold text-navy/70 hover:text-navy">
            Dashboard
          </Link>
        </SignedIn>
        <Link to="/profile" className="text-sm font-bold text-navy/70 hover:text-navy">
          Profile
        </Link>
        <Link to="/settings" className="text-sm font-bold text-navy/70 hover:text-navy">
          Settings
        </Link>
      </footer>
    </div>
  )
}

