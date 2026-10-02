import { Component, type ReactNode } from "react"
import i18n from "../../../i18n"
import { getGameContainer } from "../../game"

// the app has no error boundaries, so a render error blanks the whole tree; this contains them to the
// replay viewer with a recoverable fallback (Resume re-mounts)
interface State {
  error: Error | null
}

export default class ReplayErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    console.error("[replay] contained render error:", error)
    // the fallback replaces <Game/> without going through leave(), so destroy the game here
    try {
      getGameContainer()?.game?.destroy(true)
    } catch {
      /* already torn down */
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="replay-overlay replay-boundary">
          <div className="replay-overlay-card my-container">
            <div className="replay-overlay-title">
              {i18n.t("replay.boundary_title")}
            </div>
            <div className="replay-boundary-msg">
              {this.state.error.message}
            </div>
            <div className="replay-boundary-actions">
              <button
                className="bubbly blue"
                onClick={() => this.setState({ error: null })}
              >
                {i18n.t("replay.resume")}
              </button>
              <button
                className="bubbly"
                onClick={() => window.location.reload()}
              >
                {i18n.t("replay.reload")}
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
