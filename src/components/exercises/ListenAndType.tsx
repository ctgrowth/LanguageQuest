import { useMemo } from 'react'
import { HindiWord } from '../HindiWord'
import { VocabImage } from '../VocabImage'
import type { LessonItem } from '../../data/lessons'
import { speakTarget } from '../../utils/speech'

export function ListenAndTypeExercise({
  item,
  value,
  onChange,
  showHint,
}: {
  item: LessonItem
  value: string
  onChange: (v: string) => void
  showHint: boolean
}) {
  const placeholder = useMemo(() => 'English, romanization, or native script…', [])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-navy/70">Listen and type</div>
          <button
            type="button"
            onClick={() => speakTarget(item.hindi)}
            className="rounded-2xl bg-saffron/15 px-4 py-2 text-sm font-extrabold text-navy ring-1 ring-saffron/25 hover:bg-saffron/20"
            aria-label={`Play audio for: ${item.english}`}
          >
            ▶︎ Play
          </button>
        </div>

        {showHint ? (
          <div className="mt-5 flex items-center gap-4">
            <VocabImage src={item.imageUrl} alt={item.english} />
            <HindiWord
              hindi={item.hindi}
              transliteration={item.transliteration}
              size="md"
              ariaLabel={item.english}
            />
          </div>
        ) : (
          <div className="mt-5 text-sm text-navy/60">
            Hint appears after 2 wrong attempts.
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <label className="text-sm font-semibold text-navy/70" htmlFor="listen-type">
          Your answer
        </label>
        <input
          id="listen-type"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-navy ring-1 ring-navy/15 placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
        />
      </div>
    </div>
  )
}

