import React, { useCallback, useEffect, useRef, useState } from "react"
import Phaser from "phaser"
import { DebugScene } from "../../../game/scenes/debug-scene"
import { Pkm } from "../../../../../types/enum/Pokemon"
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin"
import { Orientation } from "../../../../../types/enum/Game"
import { Status } from "../../../../../types/enum/Status"
import "./debug-scene.css"
import { AnimationType } from "../../../../../types/Animation"

export default function DebugSceneContainer({
  pkm = Pkm.RATTATA,
  orientation = Orientation.DOWNLEFT,
  animationType = AnimationType.Idle,
  status,
  height = 100,
  width = 100
}: {
  pkm?: Pkm
  orientation?: Orientation
  animationType?: AnimationType
  status: Status | ""
  height?: number
  width?: number
}) {
  const gameRef = useRef<Phaser.Game>()
  const debugScene = useRef<DebugScene>()

  const initialized = useRef<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  const [statusMessage, setStatusMessage] = useState<string>("")

  const onProgress = () =>
    setStatusMessage(debugScene?.current?.loadingManager?.statusMessage ?? "")

  const onComplete = useCallback(() => {
    setLoaded(true)
    debugScene.current?.updateScene(pkm, orientation, animationType, status)
  }, [animationType, orientation, pkm, status])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      debugScene.current = new DebugScene(height, width, onProgress, onComplete)

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: "debug-scene",
        pixelArt: true,
        width,
        height,
        scene: [debugScene.current],
        backgroundColor: "#61738a",
        plugins: {
          global: [
            {
              key: "rexMoveTo",
              plugin: MoveToPlugin,
              start: true
            }
          ]
        }
      })
    }
  }, [height, initialized, onComplete, width])

  useEffect(() => {
    if (initialized.current === true && loaded === true) {
      debugScene.current?.updateScene(pkm, orientation, animationType, status)
    }
  }, [pkm, orientation, animationType, status, loaded])

  return (
    <div id="debug-scene">
      {!loaded && <p id="status-message">{statusMessage}</p>}
    </div>
  )
}
