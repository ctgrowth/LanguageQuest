import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { LANG_CONFIG } from '../languages/config'
import { useLanguage } from '../store/languageStore'
import { speakTarget } from '../utils/speech'

export type HindiWordSize = 'sm' | 'md' | 'lg'

type Props = {
  hindi: string
  transliteration: string
  size?: HindiWordSize
  showTransliteration?: boolean
  showSpeaker?: boolean
  ariaLabel?: string
}

export function HindiWord({
  hindi,
  transliteration,
  size = 'lg',
  showTransliteration = true,
  showSpeaker = true,
  ariaLabel,
}: Props) {
  const lang = useLanguage()
  const langLabel = LANG_CONFIG[lang].label
  const [bumpKey, setBumpKey] = useState(0)

  const sizing = useMemo(() => {
    switch (size) {
      case 'sm':
        return { hindi: 'text-2xl', translit: 'text-sm', icon: 'h-7 w-7' }
      case 'md':
        return { hindi: 'text-4xl', translit: 'text-base', icon: 'h-8 w-8' }
      default:
        return { hindi: 'text-5xl', translit: 'text-base', icon: 'h-9 w-9' }
    }
  }, [size])

  return (
    <motion.div
      className="inline-flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-navy/10"
      key={bumpKey}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.04, 0.99, 1] }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      role="button"
      tabIndex={0}
      onClick={() => {
        speakTarget(hindi)
        setBumpKey((k) => k + 1)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          speakTarget(hindi)
          setBumpKey((k) => k + 1)
        }
      }}
      aria-label={ariaLabel ? `Pronounce: ${ariaLabel}` : `Pronounce ${langLabel}`}
    >
      <div className="text-left">
        <div
          className={[
            'font-semibold leading-none tracking-tight text-navy',
            sizing.hindi,
          ].join(' ')}
          style={{ fontFamily: 'var(--font-target)' }}
        >
          {hindi}
        </div>
        {showTransliteration ? (
          <div
            className={[
              'mt-1 font-[var(--font-ui)] italic text-navy/60',
              sizing.translit,
            ].join(' ')}
          >
            {transliteration}
          </div>
        ) : null}
      </div>

      {showSpeaker ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            speakTarget(hindi)
            setBumpKey((k) => k + 1)
          }}
          className={[
            'grid place-items-center rounded-full bg-saffron/15 text-navy ring-1 ring-saffron/25',
            'transition hover:bg-saffron/20 active:scale-95',
            sizing.icon,
          ].join(' ')}
          aria-label={ariaLabel ? `Speak: ${ariaLabel}` : `Speak ${langLabel}`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              fill="currentColor"
              d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77ZM16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02ZM3 9v6h4l5 5V4L7 9H3Z"
            />
          </svg>
        </button>
      ) : null}
    </motion.div>
  )
}

