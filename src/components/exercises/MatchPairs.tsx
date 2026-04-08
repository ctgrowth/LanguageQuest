import { useMemo, useState } from 'react'
import type { LessonItem } from '../../data/lessons'
import { HindiWord } from '../HindiWord'
import { VocabImage } from '../VocabImage'

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export type MatchPairsValue = Record<string, string>

export function MatchPairsExercise({
  pairs,
  value,
  onChange,
}: {
  pairs: LessonItem[]
  value: MatchPairsValue
  onChange: (next: MatchPairsValue) => void
}) {
  const [activeHindi, setActiveHindi] = useState<string | null>(null)

  const hindiSide = useMemo(() => shuffle(pairs.map((p) => p.hindi)), [pairs])
  const englishSide = useMemo(() => shuffle(pairs.map((p) => p.english)), [pairs])
  const byHindi = useMemo(() => new Map(pairs.map((p) => [p.hindi, p])), [pairs])
  const hindiToEnglish = useMemo(() => new Map(pairs.map((p) => [p.hindi, p.english])), [pairs])

  const matchedEnglish = new Set(Object.values(value))

  const matchCount = Object.keys(value).length

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="text-sm font-semibold text-navy/70">Match the pairs</div>
        <div className="mt-2 text-xs text-navy/60">{matchCount} / {pairs.length} matched</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {hindiSide.map((h) => {
            const item = byHindi.get(h)!
            const isMatched = Boolean(value[h])
            const isActive = activeHindi === h
            return (
              <button
                key={h}
                type="button"
                disabled={isMatched}
                onClick={() => setActiveHindi(isActive ? null : h)}
                className={[
                  'w-full rounded-2xl p-4 text-left text-sm font-extrabold shadow-sm ring-1 transition',
                  isMatched
                    ? 'cursor-default bg-saffron/15 ring-saffron/40 text-navy'
                    : [
                        'bg-white/70 ring-navy/10 text-navy',
                        'hover:bg-[#FF8C00]/20 hover:ring-[#FF8C00]/25 hover:shadow-md',
                        isActive ? 'bg-[#FF8C00]/20 ring-[#FF8C00]/25 shadow-md' : '',
                      ].join(' '),
                ].join(' ')}
                aria-label={`Word card: ${item.english}`}
                aria-pressed={!isMatched && isActive}
              >
                <div className="flex items-center gap-3">
                  <VocabImage src={item.imageUrl} alt={item.english} />
                  <HindiWord
                    hindi={item.hindi}
                    transliteration={item.transliteration}
                    size="sm"
                    ariaLabel={item.english}
                  />
                </div>
              </button>
            )
          })}
        </div>

        <div className="space-y-3">
          {englishSide.map((e) => {
            const isUsed = matchedEnglish.has(e)
            const isCorrectForActive =
              activeHindi !== null && hindiToEnglish.get(activeHindi) === e
            return (
              <button
                key={e}
                type="button"
                disabled={isUsed || !activeHindi}
                onClick={() => {
                  if (!activeHindi) return
                  if (!isCorrectForActive) return
                  onChange({ ...value, [activeHindi]: e })
                  setActiveHindi(null)
                }}
                className={[
                  'w-full rounded-2xl px-5 py-4 text-left text-sm font-extrabold shadow-sm ring-1 transition',
                  isUsed
                    ? 'cursor-default bg-saffron/15 ring-saffron/40'
                    : [
                        'bg-white/70 ring-navy/10 text-navy',
                        activeHindi ? 'hover:bg-[#FF8C00]/20 hover:ring-[#FF8C00]/25 hover:shadow-md' : '',
                        'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white/70 disabled:hover:ring-navy/10 disabled:hover:shadow-none',
                      ].join(' '),
                ].join(' ')}
                aria-label={`English card: ${e}`}
              >
                <span className={isUsed ? 'text-navy/40' : 'text-navy'}>{e}</span>
                {isUsed ? <span className="ml-2 text-xs text-saffron">matched</span> : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-navy/70 ring-1 ring-navy/10">
        Matched pairs highlight in <span className="font-extrabold text-saffron">gold</span>. (You can only lock a correct match.)
      </div>
    </div>
  )
}

