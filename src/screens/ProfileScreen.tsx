import { Link } from 'react-router-dom'
import { getLessonUnits } from '../data/lessonRegistry'
import { LANG_CONFIG } from '../languages/config'
import { useLanguage } from '../store/languageStore'
import { getLevel, useProgress } from '../store/progressStore'
import { AuthButton } from '../components/AuthButton'

function Badge({ label }: { label: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-2 text-sm font-bold text-navy shadow-sm ring-1 ring-navy/10">
      {label}
    </div>
  )
}

export function ProfileScreen() {
  const lang = useLanguage()
  const lessonUnits = getLessonUnits(lang)
  const progress = useProgress()
  const level = getLevel(progress.xp)

  const achievements: { id: string; label: string; earned: boolean }[] = [
    { id: 'first-word', label: 'First Word', earned: progress.completedLessons.length >= 1 },
    { id: 'seven-streak', label: '7‑Day Streak', earned: progress.streak >= 7 },
    { id: 'xp-100', label: '100 XP', earned: progress.xp >= 100 },
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between" dir="ltr">
        <div>
          <div className="text-sm font-semibold tracking-wide text-navy/60">Profile</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-navy">Your progress</div>
          <div className="mt-1 text-xs font-bold text-navy/50">
            Course: {LANG_CONFIG[lang].label}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AuthButton />
          <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
            Back
          </Link>
        </div>
      </header>

      <main className="mt-8 space-y-6">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-sm font-semibold text-navy/70">Level</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-saffron text-cream shadow-sm">
              <span className="text-lg font-extrabold">{level}</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-navy">{progress.xp} XP</div>
              <div className="text-sm text-navy/60">Streak: {progress.streak} days</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-navy/10">
            <div className="text-sm font-semibold text-navy/70">Lessons completed</div>
            <div className="mt-2 text-2xl font-extrabold text-navy">{progress.completedLessons.length}</div>
          </div>
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-navy/10">
            <div className="text-sm font-semibold text-navy/70">Units available</div>
            <div className="mt-2 text-2xl font-extrabold text-navy">{lessonUnits.length}</div>
          </div>
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-navy/10">
            <div className="text-sm font-semibold text-navy/70">Hearts</div>
            <div className="mt-2 text-2xl font-extrabold text-navy">{progress.hearts} / 5</div>
          </div>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-sm font-semibold text-navy/70">Achievements</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {achievements.map((a) =>
              a.earned ? <Badge key={a.id} label={`🏅 ${a.label}`} /> : <Badge key={a.id} label={`🔒 ${a.label}`} />,
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

