/** Lowercase, trim, collapse spaces, normalize apostrophes. */
export function baseNormalizeAnswer(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
}

/**
 * Strip combining marks from Latin text (pinyin tones, ü → u, macrons, etc.)
 * so plain ASCII keyboard input can match lesson transliterations.
 */
/** Combining marks block (pinyin tones, umlaut decomposition, macrons, etc.). Avoid \p{M} for older browser support. */
const COMBINING_MARK = /[\u0300-\u036f\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g

export function stripLatinDiacritics(s: string) {
  return s.normalize('NFD').replace(COMBINING_MARK, '').normalize('NFC')
}

export function normalizeTransliterationForCompare(s: string, ignoreTones: boolean) {
  const base = baseNormalizeAnswer(s)
  return ignoreTones ? stripLatinDiacritics(base) : base
}
