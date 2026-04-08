export type LanguageId = 'hi' | 'zh' | 'ar' | 'he' | 'ja' | 'ko'

export const LANGUAGE_ORDER: LanguageId[] = ['hi', 'zh', 'ar', 'he', 'ja', 'ko']

export type LangUiConfig = {
  label: string
  htmlLang: string
  speechLang: string
  dir: 'ltr' | 'rtl'
  fontFamily: string
}

export const LANG_CONFIG: Record<LanguageId, LangUiConfig> = {
  hi: {
    label: 'Hindi',
    htmlLang: 'hi',
    speechLang: 'hi-IN',
    dir: 'ltr',
    fontFamily: '"Noto Sans Devanagari", "Noto Sans", system-ui, sans-serif',
  },
  zh: {
    label: 'Chinese',
    htmlLang: 'zh-Hans',
    speechLang: 'zh-CN',
    dir: 'ltr',
    fontFamily: '"Noto Sans SC", "Noto Sans", system-ui, sans-serif',
  },
  ar: {
    label: 'Arabic',
    htmlLang: 'ar',
    speechLang: 'ar-SA',
    dir: 'rtl',
    fontFamily: '"Noto Sans Arabic", "Noto Sans", system-ui, sans-serif',
  },
  he: {
    label: 'Hebrew',
    htmlLang: 'he',
    speechLang: 'he-IL',
    dir: 'rtl',
    fontFamily: '"Noto Sans Hebrew", "Noto Sans", system-ui, sans-serif',
  },
  ja: {
    label: 'Japanese',
    htmlLang: 'ja',
    speechLang: 'ja-JP',
    dir: 'ltr',
    fontFamily: '"Noto Sans JP", "Noto Sans", system-ui, sans-serif',
  },
  ko: {
    label: 'Korean',
    htmlLang: 'ko',
    speechLang: 'ko-KR',
    dir: 'ltr',
    fontFamily: '"Noto Sans KR", "Noto Sans", system-ui, sans-serif',
  },
}
