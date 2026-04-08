import type { LessonItem } from '../../data/lessons'
import type { TranslationTile } from '../../utils/translationTiles'
import { HindiWord } from '../HindiWord'

export type { TranslationTile }

export function TranslationChallengeExercise({
  item,
  tiles,
  selectedIndices,
  onChange,
}: {
  item: LessonItem
  tiles: TranslationTile[]
  selectedIndices: number[]
  onChange: (indices: number[]) => void
}) {
  const selectedTiles = selectedIndices.map((i) => tiles[i]).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="text-sm font-semibold text-navy/70">Build the sentence</div>
        <div className="mt-2 text-sm text-navy/70">
          English: <span className="font-extrabold text-navy">{item.english}</span>
        </div>
      </div>

      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="text-xs font-bold uppercase tracking-wide text-navy/50">Your sentence</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTiles.length === 0 ? (
            <div className="text-sm text-navy/50">Tap tiles below to build the sentence.</div>
          ) : (
            selectedTiles.map((t, idx) => (
              <button
                key={`${t.hindi}-${idx}`}
                type="button"
                onClick={() => onChange(selectedIndices.filter((_, i) => i !== idx))}
                className="rounded-2xl bg-blue-50 px-3 py-2 ring-1 ring-blue-400/30"
                aria-label={`Remove tile ${t.hindi}`}
              >
                <HindiWord hindi={t.hindi} transliteration={t.transliteration} size="sm" ariaLabel={item.english} />
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="text-xs font-bold uppercase tracking-wide text-navy/50">Tiles</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tiles.map((t, i) => {
            const used = selectedIndices.includes(i)
            return (
              <button
                key={`${t.hindi}-${i}`}
                type="button"
                disabled={used}
                onClick={() => onChange([...selectedIndices, i])}
                className={[
                  'rounded-2xl px-3 py-2 ring-1 transition',
                  used ? 'bg-white/40 text-navy/30 ring-navy/10' : 'bg-white text-navy ring-navy/15 hover:bg-white/90',
                ].join(' ')}
                aria-label={`Tile ${t.hindi}`}
              >
                <HindiWord hindi={t.hindi} transliteration={t.transliteration} size="sm" ariaLabel={item.english} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

