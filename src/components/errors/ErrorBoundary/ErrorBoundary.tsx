import { Component } from 'react'

export type ErrorBoundaryState = {
  error: Error | null
}

export type ErrorBoundaryProps = {
  fallbackRender?: (error: Error | null) => JSX.Element
  FallbackComponent?: React.ReactNode
  onError?: (error: Error) => void
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { error: null }

  componentDidCatch(error: Error) {
    const { onError } = this.props

    if (onError) {
      onError(error)
    }

    this.setState({ error })
  }

  render() {
    const { error } = this.state
    const { fallbackRender, FallbackComponent, children } = this.props

    if (error !== null) {
      if (typeof fallbackRender === 'function') {
        return fallbackRender(error)
      } else if (typeof FallbackComponent === 'function') {
        return <FallbackComponent error={error} />
      } else {
        throw new Error(
          'Error404Component boundary requires either a fallbackRender, or FallbackComponent prop'
        )
      }
    }

    return children
  }
}

export default ErrorBoundary
