import { Link } from 'react-router-dom'
import { HindiWord } from '../components/HindiWord'
import { PHONETIC_GUIDE } from '../utils/transliterate'
import { settingsActions, useSettings } from '../store/settingsStore'

export function SettingsScreen() {
  const settings = useSettings()
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold tracking-wide text-navy/60">Settings</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-navy">Transliteration guide</div>
        </div>
        <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
          Back
        </Link>
      </header>

      <main className="mt-8 space-y-6">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-navy/70">Pronunciation</div>
              <div className="mt-1 text-sm text-navy/60">Auto-pronounce at the start of each question.</div>
            </div>
            <button
              type="button"
              onClick={() => settingsActions.setAutoPronounce(!settings.autoPronounce)}
              className={[
                'rounded-full px-4 py-2 text-sm font-extrabold ring-1 transition',
                settings.autoPronounce
                  ? 'bg-saffron text-cream ring-saffron/30'
                  : 'bg-white text-navy ring-navy/10 hover:bg-white/90',
              ].join(' ')}
              aria-pressed={settings.autoPronounce}
            >
              {settings.autoPronounce ? 'On' : 'Off'}
            </button>
          </div>
          <div className="mt-4 text-xs text-navy/60">
            Tip: You can always tap a word card to hear it.
          </div>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-navy/70">Tone marks when typing</div>
              <div className="mt-1 text-sm text-navy/60">
                Off: roman answers accept a plain keyboard (e.g. <span className="font-bold">ni hao</span> matches{' '}
                <span className="font-bold">nǐ hǎo</span>). Native script answers unchanged.
              </div>
            </div>
            <button
              type="button"
              onClick={() => settingsActions.setIgnoreTonesInTyping(!settings.ignoreTonesInTyping)}
              className={[
                'rounded-full px-4 py-2 text-sm font-extrabold ring-1 transition',
                settings.ignoreTonesInTyping
                  ? 'bg-saffron text-cream ring-saffron/30'
                  : 'bg-white text-navy ring-navy/10 hover:bg-white/90',
              ].join(' ')}
              aria-pressed={settings.ignoreTonesInTyping}
              aria-label="Ignore tone marks in typed answers"
            >
              {settings.ignoreTonesInTyping ? 'Optional' : 'Required'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="text-sm font-semibold text-navy/70">How to read the sounds</div>
          <div className="mt-2 text-sm text-navy/70">
            Use this simple phonetic key:
            <span className="font-bold"> a=अ, aa=आ, i=इ, ee=ई, u=उ, oo=ऊ, e=ए, ai=ऐ, o=ओ, au=औ</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PHONETIC_GUIDE.map((g) => (
            <div
              key={g.roman}
              className="rounded-3xl bg-white/70 p-5 shadow-sm ring-1 ring-navy/10"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-navy/50">Roman</div>
              <div className="mt-1 text-lg font-extrabold text-navy">{g.roman}</div>
              <div className="mt-4">
                <HindiWord hindi={g.devanagari} transliteration={g.roman} size="md" ariaLabel={g.roman} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

