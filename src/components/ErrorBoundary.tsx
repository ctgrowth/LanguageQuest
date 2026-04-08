import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      const e = this.state.error
      return (
        <div
          style={{
            padding: 24,
            maxWidth: 720,
            margin: '40px auto',
            fontFamily: 'system-ui, sans-serif',
            background: '#fff8f0',
            color: '#1a1f3a',
            borderRadius: 12,
            border: '1px solid #ff8c00',
          }}
        >
          <h1 style={{ fontSize: 20, marginTop: 0 }}>Something went wrong</h1>
          <p style={{ color: '#555', lineHeight: 1.5 }}>
            Copy the text below if you need help fixing this app.
          </p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#fff',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              color: '#a00',
              overflow: 'auto',
            }}
          >
            {e.name}: {e.message}
            {'\n\n'}
            {e.stack ?? '(no stack)'}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
