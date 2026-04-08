import { HindiWord } from '../HindiWord'
import type { LessonItem } from '../../data/lessons'
import { speakTarget } from '../../utils/speech'
import { baseNormalizeAnswer, normalizeTransliterationForCompare } from '../../utils/typingNormalize'
import { VocabImage } from '../VocabImage'

export function TypeInWordExercise({
  item,
  value,
  onChange,
  ignoreTonesInTyping,
}: {
  item: LessonItem
  value: string
  onChange: (v: string) => void
  ignoreTonesInTyping: boolean
}) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF8C00]/12 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-navy/70">Type the word</div>
          <button
            type="button"
            onClick={() => speakTarget(item.hindi)}
            className="rounded-2xl bg-saffron/15 px-4 py-2 text-sm font-extrabold text-navy ring-1 ring-saffron/25 hover:bg-saffron/20"
            aria-label={`Play audio for: ${item.english}`}
          >
            ▶︎ Play
          </button>
        </div>

        <div className="mt-3 text-sm text-navy/70">
          English: <span className="font-extrabold text-navy">{item.english}</span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <VocabImage src={item.imageUrl} alt={item.english} />
          <HindiWord
            hindi={item.hindi}
            transliteration={item.transliteration}
            size="md"
            ariaLabel={item.english}
            showSpeaker={false}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
        <label className="text-sm font-semibold text-navy/70" htmlFor="type-in-target">
          Your answer (native script or romanization)
        </label>
        <input
          id="type-in-target"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g., namaste or नमस्ते"
          className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-navy ring-1 ring-navy/15 placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-saffron/40"
          aria-label={`Type the target language for: ${item.english}`}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="mt-3 text-xs text-navy/60">
          Accepted: <span className="font-bold">{item.transliteration}</span> or <span className="font-bold">{item.hindi}</span>
          {ignoreTonesInTyping ? (
            <span className="mt-1 block text-navy/50">
              Tone marks optional for romanization (plain keyboard OK).
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export function isTypeInWordCorrect(item: LessonItem, typed: string, ignoreTonesInTyping: boolean) {
  const tNative = baseNormalizeAnswer(typed)
  if (tNative === baseNormalizeAnswer(item.hindi)) return true
  const tRom = normalizeTransliterationForCompare(typed, ignoreTonesInTyping)
  const expectedRom = normalizeTransliterationForCompare(item.transliteration, ignoreTonesInTyping)
  return tRom === expectedRom
}

/** Listen step: English meaning, or same script / romanization rules as type-in (incl. optional tones). */
export function isListenAndTypeCorrect(
  item: LessonItem,
  typed: string,
  ignoreTonesInTyping: boolean,
) {
  if (baseNormalizeAnswer(typed) === baseNormalizeAnswer(item.english)) return true
  return isTypeInWordCorrect(item, typed, ignoreTonesInTyping)
}

