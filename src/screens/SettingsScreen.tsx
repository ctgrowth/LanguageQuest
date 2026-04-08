import { Link } from 'react-router-dom'
import { settingsActions, useSettings } from '../store/settingsStore'

export function SettingsScreen() {
  const settings = useSettings()
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold tracking-wide text-navy/60">Settings</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-navy">Preferences</div>
        </div>
        <Link to="/" className="text-sm font-bold text-navy/70 hover:text-navy">
          Back
        </Link>
      </header>

      <main className="mt-8 space-y-5">
        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-navy/70">Auto-pronounce</div>
              <div className="mt-1 text-sm text-navy/60">Speak the prompt when a new question appears.</div>
            </div>
            <button
              type="button"
              onClick={() => settingsActions.setAutoPronounce(!settings.autoPronounce)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ring-1 transition',
                settings.autoPronounce
                  ? 'bg-saffron text-cream ring-saffron/30'
                  : 'bg-white text-navy ring-navy/10 hover:bg-white/90',
              ].join(' ')}
              aria-pressed={settings.autoPronounce}
            >
              {settings.autoPronounce ? 'On' : 'Off'}
            </button>
          </div>
          <p className="mt-4 text-xs text-navy/55">You can still tap a word to hear it anytime.</p>
        </div>

        <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-navy/10">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-navy/70">Typing: ignore tone marks</div>
              <div className="mt-1 text-sm text-navy/60">
                When on, romanized type-in answers don’t require accents (e.g. <span className="font-semibold">ni hao</span> matches tonal spellings). Native script is unchanged.
              </div>
            </div>
            <button
              type="button"
              onClick={() => settingsActions.setIgnoreTonesInTyping(!settings.ignoreTonesInTyping)}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-extrabold ring-1 transition',
                settings.ignoreTonesInTyping
                  ? 'bg-saffron text-cream ring-saffron/30'
                  : 'bg-white text-navy ring-navy/10 hover:bg-white/90',
              ].join(' ')}
              aria-pressed={settings.ignoreTonesInTyping}
              aria-label="Ignore tone marks in typed answers"
            >
              {settings.ignoreTonesInTyping ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-navy/55">
          Learning language is set from the <Link to="/" className="font-bold text-navy/70 hover:text-navy">home</Link> screen.
        </p>
      </main>
    </div>
  )
}
