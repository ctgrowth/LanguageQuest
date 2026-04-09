import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import confetti from 'canvas-confetti'
import { type LessonItem } from '../data/lessons'
import { getLessonUnits } from '../data/lessonRegistry'
import { useLanguage } from '../store/languageStore'
import { progressActions, useProgress } from '../store/progressStore'
import { MultipleChoiceExercise } from '../components/exercises/MultipleChoice'
import { MatchPairsExercise, type MatchPairsValue } from '../components/exercises/MatchPairs'
import { ListenAndTypeExercise } from '../components/exercises/ListenAndType'
import { TranslationChallengeExercise } from '../components/exercises/TranslationChallenge'
import {
  buildTranslationTiles,
  isTranslationOrderCorrect,
  type TranslationTile,
} from '../utils/translationTiles'
import {
  TypeInWordExercise,
  isListenAndTypeCorrect,
  isTypeInWordCorrect,
} from '../components/exercises/TypeInWord'
import { useSettings } from '../store/settingsStore'
import { speakTarget } from '../utils/speech'
import type { LessonUnit } from '../data/lessonRegistry'
import type { LanguageId } from '../languages/config'

const QUESTIONS_PER_LESSON = 20

/** Build a pseudo-random lesson of fixed length from this unit’s vocabulary. */
function buildLessonSteps(unit: LessonUnit, lang: LanguageId, lessonUnits: LessonUnit[]): Step[] {
  const pool = unit.lessons.length ? shuffle([...unit.lessons]) : []
  let k = 0
  const nextItem = () => {
    const item = pool[k % pool.length] ?? unit.lessons[0]
    k += 1
    return item
  }

  const makeMatchPairs = (): LessonItem[] => {
    const pairs = shuffle([...unit.lessons])
    const six = pairs.slice(0, 6)
    if (six.length >= 6) return six
    return [...six, ...shuffle(lessonUnits.flatMap((u) => u.lessons))].slice(0, 6)
  }

  const kinds: Step['kind'][] = ['mc', 'match']
  const afterMatch: Step['kind'][] = ['type', 'listen', 'translate', 'mc']
  for (let i = 2; i < QUESTIONS_PER_LESSON; i++) {
    kinds.push(afterMatch[(i - 2) % 4])
  }

  const steps: Step[] = []
  for (const kind of kinds) {
    if (kind === 'match') {
      steps.push({ kind: 'match', pairs: makeMatchPairs() })
      continue
    }
    if (kind === 'translate') {
      const item = nextItem()
      steps.push({
        kind: 'translate',
        item,
        tiles: shuffle(buildTranslationTiles(item, lang)),
      })
      continue
    }
    steps.push({ kind, item: nextItem() })
  }
  return steps
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Step =
  | { kind: 'mc'; item: LessonItem }
  | { kind: 'match'; pairs: LessonItem[] }
  | { kind: 'listen'; item: LessonItem }
  | { kind: 'translate'; item: LessonItem; tiles: TranslationTile[] }
  | { kind: 'type'; item: LessonItem }

export function LessonScreen() {
  const lang = useLanguage()
  const lessonUnits = useMemo(() => getLessonUnits(lang), [lang])
  const { unitId } = useParams()
  const unit = useMemo(() => lessonUnits.find((u) => u.id === unitId), [lessonUnits, unitId])
  const navigate = useNavigate()
  const progress = useProgress()
  const settings = useSettings()

  const completed = useMemo(() => new Set(progress.completedLessons), [progress.completedLessons])
  const isUnlocked = useMemo(() => {
    if (!unitId) return false
    const idx = lessonUnits.findIndex((u) => u.id === unitId)
    if (idx === -1) return false
    if (idx === 0) return true
    const prev = lessonUnits[idx - 1]
    return prev ? completed.has(prev.id) : false
  }, [unitId, completed, lessonUnits])

  const [stepIndex, setStepIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const steps: Step[] = useMemo(() => {
    if (!unit) return []
    return buildLessonSteps(unit, lang, lessonUnits)
  }, [unit, lessonUnits, lang])

  const totalSteps = steps.length || QUESTIONS_PER_LESSON

  const [mcChoice, setMcChoice] = useState<string | null>(null)
  const [matchValue, setMatchValue] = useState<MatchPairsValue>({})
  const [listenValue, setListenValue] = useState('')
  const [listenWrongAttempts, setListenWrongAttempts] = useState(0)
  const [translateIndices, setTranslateIndices] = useState<number[]>([])
  const [typeInValue, setTypeInValue] = useState('')

  const current = steps[stepIndex]

  useEffect(() => {
    setStepIndex(0)
    setIsComplete(false)
    setFeedback(null)
    setMcChoice(null)
    setMatchValue({})
    setListenValue('')
    setListenWrongAttempts(0)
    setTranslateIndices([])
    setTypeInValue('')
  }, [unitId, lang])

  useEffect(() => {
    if (!settings.autoPronounce) return
    if (!current) return
    if (current.kind === 'match') return
    speakTarget(current.item.hindi)
  }, [settings.autoPronounce, current])

  if (!unit || !current) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-lg font-extrabold text-navy">Lesson not found</div>
          <div className="mt-4">
            <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-lg font-extrabold text-navy">Locked</div>
          <div className="mt-2 text-sm text-navy/70">
            Finish the previous unit to unlock this one.
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="rounded-2xl bg-navy px-5 py-3 text-sm font-extrabold text-cream shadow-sm"
              onClick={() => navigate('/')}
            >
              Back to Skill Tree
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between gap-4" dir="ltr">
        <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
          ← Home
        </Link>
        <div className="text-sm font-extrabold text-navy">{unit.title}</div>
        <div className="text-sm font-bold text-navy/70">❤️ {progress.hearts}</div>
      </header>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/70 ring-1 ring-navy/10">
        <div
          className="h-full rounded-full bg-saffron"
          style={{ width: `${Math.round((stepIndex / totalSteps) * 100)}%` }}
          aria-label={`Question ${stepIndex + 1} of ${totalSteps}`}
        />
      </div>

      <main className="mt-10 flex-1">
        {isComplete ? (
          <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
            <div className="text-sm font-semibold tracking-wide text-navy/60">Lesson complete</div>
            <div className="mt-2 text-2xl font-extrabold text-navy">+{unit.xpReward} XP</div>
            <div className="mt-4 text-sm font-bold text-navy/70">
              Stars:{' '}
              <span className="text-saffron">
                {'★'.repeat(progress.hearts >= 4 ? 3 : progress.hearts >= 2 ? 2 : 1)}
              </span>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="rounded-2xl bg-saffron px-5 py-3 text-sm font-extrabold text-cream shadow-sm"
                onClick={() => navigate('/')}
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <>
            {current.kind === 'mc' ? (
              <MultipleChoiceExercise
                item={current.item}
                pool={unit.lessons}
                value={mcChoice}
                onChange={(v) => setMcChoice(v)}
              />
            ) : null}

            {current.kind === 'match' ? (
              <MatchPairsExercise pairs={current.pairs} value={matchValue} onChange={setMatchValue} />
            ) : null}

            {current.kind === 'listen' ? (
              <ListenAndTypeExercise
                item={current.item}
                value={listenValue}
                onChange={setListenValue}
                showHint={listenWrongAttempts >= 2}
              />
            ) : null}

            {current.kind === 'translate' ? (
              <TranslationChallengeExercise
                item={current.item}
                tiles={current.tiles}
                selectedIndices={translateIndices}
                onChange={setTranslateIndices}
              />
            ) : null}

            {current.kind === 'type' ? (
              <TypeInWordExercise
                item={current.item}
                value={typeInValue}
                onChange={setTypeInValue}
                ignoreTonesInTyping={settings.ignoreTonesInTyping}
              />
            ) : null}

            {feedback ? (
              <div
                className={[
                  'mt-8 rounded-2xl px-4 py-3 text-sm font-extrabold ring-1',
                  feedback === 'correct'
                    ? 'bg-green-50 text-green-900 ring-green-400/40'
                    : 'bg-red-50 text-red-900 ring-red-400/40',
                ].join(' ')}
                aria-live="polite"
              >
                {feedback === 'correct' ? 'Correct!' : 'Try again.'}
              </div>
            ) : null}
          </>
        )}
      </main>

      <footer className="mt-8">
        <button
          className="w-full rounded-2xl bg-navy px-5 py-4 text-sm font-extrabold text-cream shadow-sm disabled:opacity-50"
          onClick={() => {
            if (isComplete) {
              navigate('/')
              return
            }

            if (!current) return

            let ok = false
            if (current.kind === 'mc') {
              ok = mcChoice === current.item.english
            } else if (current.kind === 'match') {
              ok = Object.keys(matchValue).length >= current.pairs.length
            } else if (current.kind === 'listen') {
              ok = isListenAndTypeCorrect(
                current.item,
                listenValue,
                settings.ignoreTonesInTyping,
              )
            } else if (current.kind === 'translate') {
              ok = isTranslationOrderCorrect(lang, current.item, translateIndices, current.tiles)
            } else if (current.kind === 'type') {
              ok = isTypeInWordCorrect(current.item, typeInValue, settings.ignoreTonesInTyping)
            }

            if (!ok) {
              setFeedback('wrong')
              progressActions.loseHeart()
              if (current.kind === 'listen') setListenWrongAttempts((n) => n + 1)
              return
            }

            setFeedback('correct')
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } })

            setTimeout(() => {
              setFeedback(null)
              const next = stepIndex + 1
              if (next >= totalSteps) {
                progressActions.awardXp(unit.xpReward)
                progressActions.markLessonComplete(unit.id)
                setIsComplete(true)
                confetti({ particleCount: 140, spread: 75, origin: { y: 0.7 } })
              } else {
                setStepIndex(next)
                setMcChoice(null)
                setMatchValue({})
                setListenValue('')
                setTranslateIndices([])
                setTypeInValue('')
                setListenWrongAttempts(0)
              }
            }, 450)
          }}
          disabled={progress.hearts <= 0}
        >
          CHECK
        </button>
      </footer>
    </div>
  )
}

