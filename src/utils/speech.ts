import { LANG_CONFIG, type LanguageId } from '../languages/config'
import { getLanguage } from '../store/languageStore'

export function speakTarget(text: string, lang?: LanguageId) {
  if (typeof window === 'undefined') return
  if (!('speechSynthesis' in window)) return
  if (!text.trim()) return

  const id = lang ?? getLanguage()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = LANG_CONFIG[id].speechLang
  utterance.rate = 0.95
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

/** @deprecated Use speakTarget — kept for readability in legacy call sites. */
export function speakHindi(text: string) {
  speakTarget(text, 'hi')
}
