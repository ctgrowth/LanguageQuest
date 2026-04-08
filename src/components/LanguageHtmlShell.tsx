import { useLayoutEffect } from 'react'
import { LANG_CONFIG } from '../languages/config'
import { useLanguage } from '../store/languageStore'

export function LanguageHtmlShell() {
  const lang = useLanguage()

  useLayoutEffect(() => {
    const c = LANG_CONFIG[lang] ?? LANG_CONFIG.hi
    document.documentElement.lang = c.htmlLang
    document.documentElement.dir = c.dir
    document.documentElement.style.setProperty('--font-target', c.fontFamily)
  }, [lang])

  return null
}
