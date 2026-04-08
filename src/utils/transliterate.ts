const VOWELS: Record<string, string> = {
  'अ': 'a',
  'आ': 'aa',
  'इ': 'i',
  'ई': 'ee',
  'उ': 'u',
  'ऊ': 'oo',
  'ए': 'e',
  'ऐ': 'ai',
  'ओ': 'o',
  'औ': 'au',
  'ऋ': 'ri',
}

const MARKS: Record<string, string> = {
  'ा': 'aa',
  'ि': 'i',
  'ी': 'ee',
  'ु': 'u',
  'ू': 'oo',
  'े': 'e',
  'ै': 'ai',
  'ो': 'o',
  'ौ': 'au',
  'ृ': 'ri',
  'ं': 'n',
  'ः': 'h',
  'ँ': 'n',
}

const CONSONANTS: Record<string, string> = {
  'क': 'k',
  'ख': 'kh',
  'ग': 'g',
  'घ': 'gh',
  'च': 'ch',
  'छ': 'chh',
  'ज': 'j',
  'झ': 'jh',
  'ट': 't',
  'ठ': 'th',
  'ड': 'd',
  'ढ': 'dh',
  'ण': 'n',
  'त': 't',
  'थ': 'th',
  'द': 'd',
  'ध': 'dh',
  'न': 'n',
  'प': 'p',
  'फ': 'ph',
  'ब': 'b',
  'भ': 'bh',
  'म': 'm',
  'य': 'y',
  'र': 'r',
  'ल': 'l',
  'व': 'v',
  'श': 'sh',
  'ष': 'sh',
  'स': 's',
  'ह': 'h',
}

const HALANT = '्'

export function transliterateFallback(hindi: string) {
  let out = ''
  const chars = Array.from(hindi)

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]

    if (c === ' ') {
      out += ' '
      continue
    }

    if (VOWELS[c]) {
      out += VOWELS[c]
      continue
    }

    if (CONSONANTS[c]) {
      const next = chars[i + 1]
      if (next && next !== HALANT && MARKS[next]) {
        out += CONSONANTS[c] + MARKS[next]
        i++
        continue
      }
      if (next === HALANT) {
        out += CONSONANTS[c]
        i++
        continue
      }
      out += CONSONANTS[c] + 'a'
      continue
    }

    if (MARKS[c]) {
      out += MARKS[c]
      continue
    }

    out += c
  }

  return out.replace(/\s+/g, ' ').trim()
}

export const PHONETIC_GUIDE = [
  { roman: 'a', devanagari: 'अ' },
  { roman: 'aa', devanagari: 'आ' },
  { roman: 'i', devanagari: 'इ' },
  { roman: 'ee', devanagari: 'ई' },
  { roman: 'u', devanagari: 'उ' },
  { roman: 'oo', devanagari: 'ऊ' },
  { roman: 'e', devanagari: 'ए' },
  { roman: 'ai', devanagari: 'ऐ' },
  { roman: 'o', devanagari: 'ओ' },
  { roman: 'au', devanagari: 'औ' },
]

