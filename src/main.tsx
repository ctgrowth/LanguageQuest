import './index.css'

function showFatal(message: string) {
  const el = document.getElementById('root')
  const text = document.createElement('pre')
  text.style.cssText =
    'padding:24px;margin:0;font:14px/1.45 system-ui, sans-serif;white-space:pre-wrap;word-break:break-word;background:#fff8f0;color:#1a1f3a;border-top:4px solid #ff8c00'
  text.textContent = message
  if (el) {
    el.replaceChildren(text)
  } else {
    document.body.replaceChildren(text)
  }
}

const rootEl = document.getElementById('root')
if (!rootEl) {
  showFatal(
    'This page has no #root element. Make sure you are running the app with:\n\n  npm run dev\n\nThen open the URL it prints (usually http://localhost:5173).\n\nDo not open dist/index.html directly in the browser — that often shows a blank page.',
  )
} else {
  import('./rootMount.tsx')
    .then(({ mountApp }) => {
      mountApp(rootEl)
    })
    .catch((err: unknown) => {
      const e = err instanceof Error ? err : new Error(String(err))
      showFatal(
        [
          'The app failed to start (JavaScript error while loading).',
          '',
          e.name + ': ' + e.message,
          '',
          e.stack ?? '(no stack)',
          '',
          '---',
          'How to run this project:',
          '  1. Open Terminal in the hindi-duo folder',
          '  2. Run: npm run dev',
          '  3. Open the http://localhost… link in your browser',
          '',
          'Opening the HTML file from Finder usually does not work.',
        ].join('\n'),
      )
    })
}
