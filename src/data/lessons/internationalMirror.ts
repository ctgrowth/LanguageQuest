import type { LanguageId } from '../../languages/config'
import {
  GRAMMAR_MINI_PACK,
  lessonUnits,
  type LessonItem,
  type LessonUnit,
} from '../lessons'

const GRAMMAR_TAIL_EN = GRAMMAR_MINI_PACK.map((x) => x.english)

export function stripGrammarCore(lessons: LessonItem[]): LessonItem[] {
  if (lessons.length < GRAMMAR_MINI_PACK.length) return lessons
  const tail = lessons.slice(-GRAMMAR_MINI_PACK.length).map((x) => x.english)
  const matches = GRAMMAR_TAIL_EN.every((en, i) => tail[i] === en)
  return matches ? lessons.slice(0, -GRAMMAR_MINI_PACK.length) : lessons
}

export function dictFromLessonCores(cores: LessonItem[][]): Record<string, { script: string; rom: string }> {
  const d: Record<string, { script: string; rom: string }> = {}
  for (const arr of cores) {
    for (const it of arr) {
      d[it.english] = { script: it.hindi, rom: it.transliteration }
    }
  }
  return d
}

function row(script: string, rom: string, english: string, imageUrl?: string): LessonItem {
  return imageUrl ? { hindi: script, transliteration: rom, english, imageUrl } : { hindi: script, transliteration: rom, english }
}

export function buildMirroredUnits(
  grammar: LessonItem[],
  dict: Record<string, { script: string; rom: string }>,
): LessonUnit[] {
  return lessonUnits.map((hiUnit) => {
    const coreHi = stripGrammarCore(hiUnit.lessons)
    const lessonsOut: LessonItem[] = coreHi.map((hi) => {
      const tr = dict[hi.english]
      if (tr) return row(tr.script, tr.rom, hi.english, hi.imageUrl)
      throw new Error(`Missing ${hi.english} in i18n dictionary`)
    })
    return {
      id: hiUnit.id,
      title: hiUnit.title,
      xpReward: hiUnit.xpReward,
      emoji: hiUnit.emoji,
      lessons: [...lessonsOut, ...grammar],
    }
  })
}

export type NonHindi = Exclude<LanguageId, 'hi'>
