import type { LanguageId } from '../languages/config'
import { lessonUnits } from './lessons'
import { internationalLessonUnits } from './lessons/international'

export { type LessonItem, type LessonUnit } from './lessons'

export function getLessonUnits(lang: LanguageId) {
  if (lang === 'hi') return lessonUnits
  return internationalLessonUnits[lang]
}
