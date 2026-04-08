import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { HindiWord } from '../HindiWord'
import { VocabImage } from '../VocabImage'
import type { LessonItem } from '../../data/lessons'

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MultipleChoiceExercise({
  item,
  pool,
  value,
  onChange,
}: {
  item: LessonItem
  pool: LessonItem[]
  value: string | null
  onChange: (english: string) => void
}) {
  const options = useMemo(() => {
    const distractors = shuffle(pool.filter((p) => p.english !== item.english)).slice(0, 3)
    return shuffle([item, ...distractors]).map((x) => x.english)
  }, [item, pool])

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF8C00]/15 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />

        <div className="text-sm font-semibold text-navy/70">Choose the meaning</div>
        <div className="mt-5 flex items-center gap-4">
          <VocabImage src={item.imageUrl} alt={item.english} />
          <HindiWord
            hindi={item.hindi}
            transliteration={item.transliteration}
            size="lg"
            ariaLabel={item.english}
          />
        </div>
      </div>

      <motion.div
        className="grid gap-3"
      >
        {options.map((opt) => {
          const isSelected = value === opt

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={[
                'rounded-2xl px-5 py-4 text-left text-sm font-extrabold shadow-sm ring-1 transition',
                isSelected ? 'bg-[#FF8C00]/20' : 'bg-white/70',
                'text-navy ring-navy/10',
                // Use explicit color values so the fill is always applied.
                'hover:bg-[#FF8C00]/20 hover:ring-[#FF8C00]/25 hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron/60',
                // Make selected as visibly "solid" as hover.
                isSelected ? 'ring-[#FF8C00]/25 shadow-md' : '',
              ].join(' ')}
              aria-label={`Option: ${opt}`}
              aria-pressed={isSelected}
            >
              {opt}
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}

