import type { LessonItem } from '../data/lessons'
import type { LanguageId } from '../languages/config'
import { LANG_CONFIG } from '../languages/config'
import { transliterateFallback } from './transliterate'

export type TranslationTile = { hindi: string; transliteration: string }

function graphemeClusters(s: string): string[] {
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return [...seg.segment(s)].map((x) => x.segment)
  } catch {
    return [...s]
  }
}

function tryWordSegments(script: string, lang: LanguageId): string[] | null {
  const locale = LANG_CONFIG[lang]?.htmlLang
  if (!locale || typeof Intl.Segmenter !== 'function') return null
  try {
    const seg = new Intl.Segmenter(locale, { granularity: 'word' })
    const words = [...seg.segment(script)]
      .filter((x) => x.isWordLike)
      .map((x) => x.segment.trim())
      .filter(Boolean)
    return words.length > 0 ? words : null
  } catch {
    return null
  }
}

/** When native script is written without spaces but romanization has multiple tokens. */
function splitScriptToMatchRom(script: string, romWords: string[], lang: LanguageId): string[] {
  if (romWords.length === 0) return script ? [script] : []
  if (romWords.length === 1) return [script]

  const glyphs = graphemeClusters(script)
  if (glyphs.length === romWords.length) {
    return glyphs
  }

  const words = tryWordSegments(script, lang)
  if (words && words.length === romWords.length) {
    return words
  }

  const n = romWords.length
  const m = glyphs.length
  if (m < n) {
    return [script]
  }

  const weights = romWords.map((w) => Math.max(1, [...w].length))
  const totalW = weights.reduce((a, b) => a + b, 0)

  const chunks: string[] = []
  let ptr = 0
  for (let i = 0; i < n; i++) {
    if (i === n - 1) {
      chunks.push(glyphs.slice(ptr).join(''))
      break
    }
    const remainingChars = m - ptr
    const remainingSlots = n - i
    const share = (weights[i] / totalW) * remainingChars
    let take = Math.round(share)
    take = Math.max(1, Math.min(take, remainingChars - (remainingSlots - 1)))
    chunks.push(glyphs.slice(ptr, ptr + take).join(''))
    ptr += take
  }
  return chunks
}

/**
 * Builds word tiles for the translation exercise. Devanagari phrases usually
 * space-separate words; CJK and similar scripts often do not — align tiles to
 * romanization word count so every word is a separate tile.
 */
export function buildTranslationTiles(item: LessonItem, lang: LanguageId): TranslationTile[] {
  const rom = item.transliteration.trim().split(/\s+/).filter(Boolean)
  const spaced = item.hindi.trim().split(/\s+/).filter(Boolean)

  let scriptParts: string[]
  if (rom.length === 0) {
    scriptParts = [item.hindi.trim()]
  } else if (spaced.length === rom.length) {
    scriptParts = spaced
  } else {
    const merged = lang === 'hi' ? spaced.join(' ') : spaced.join('')
    scriptParts = splitScriptToMatchRom(merged, rom, lang)
  }

  return scriptParts.map((h, i) => ({
    hindi: h,
    transliteration:
      lang === 'hi' ? rom[i] ?? transliterateFallback(h) : rom[i] ?? '',
  }))
}

export function isTranslationOrderCorrect(
  lang: LanguageId,
  item: LessonItem,
  selectedIndices: number[],
  tiles: TranslationTile[],
): boolean {
  const parts = selectedIndices.map((i) => tiles[i]?.hindi).filter(Boolean)
  if (parts.length === 0) return false

  if (lang === 'hi') {
    const built = parts.join(' ').replace(/\s+/g, ' ').trim()
    const target = item.hindi.replace(/\s+/g, ' ').trim()
    return built === target
  }

  if (lang === 'zh' || lang === 'ja' || lang === 'ko') {
    const built = parts.join('').replace(/\s+/g, '')
    const target = item.hindi.replace(/\s+/g, '').trim()
    return built === target
  }

  const builtSpaced = parts.join(' ').replace(/\s+/g, ' ').trim()
  const targetSpaced = item.hindi.replace(/\s+/g, ' ').trim()
  if (builtSpaced === targetSpaced) return true

  const builtCompact = parts.join('').replace(/\s+/g, '')
  const targetCompact = item.hindi.replace(/\s+/g, '')
  return builtCompact === targetCompact
}
