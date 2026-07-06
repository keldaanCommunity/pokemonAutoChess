import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  downloadReplay,
  getActiveGameRoom,
  getStoredReplayInfo
} from "../../../game/recorder"
import { useAppSelector } from "../../../hooks"
import "./replay-ui.css"

// "Download replay" button on the after-game screen; uses the game room the recorder retains (rooms.game is
// cleared at game end), so the just-played match is still downloadable. gated on the stored frame count, shown only for a non-empty capture
export default function RecorderEndGame() {
  const { t } = useTranslation()
  const uid = useAppSelector((s) => s.network.uid)
  const room = getActiveGameRoom()
  const roomId = room?.roomId
  const [info, setInfo] = useState<{ frames: number; ms: number } | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    const refresh = () =>
      getStoredReplayInfo(room ?? undefined)
        .then((i) => alive && setInfo(i))
        .catch(() => {})
    refresh()
    const id = setInterval(refresh, 1500) // converge as the last frames flush
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [roomId])

  if (!room || !info || info.frames === 0) return null

  return (
    <div className="recorder-endgame">
      <button
        className="bubbly blue"
        onClick={() => {
          // downloadReplay drains OPFS + reads the file; surface a failure, not a silent no-op
          setFailed(false)
          downloadReplay(room, uid).catch(() => setFailed(true))
        }}
      >
        ⬇ {t("replay.endgame.download")}
      </button>
      {failed && (
        <p className="recorder-endgame-error">
          {t("replay.endgame.download_failed")}
        </p>
      )}
    </div>
  )
}
