import Phaser from "phaser"
import MoveToPlugin from "phaser3-rex-plugins/plugins/moveto-plugin"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { DebugScene } from "../../../game/scenes/debug-scene"
import "./debug-scene.css"

export default function MapViewerContainer() {
  const gameRef = useRef<Phaser.Game>()
  const debugScene = useRef<DebugScene>()

  const width = 1950
  const height = 1000

  const initialized = useRef<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  const [statusMessage, setStatusMessage] = useState<string>("")
  const maps = Object.values(DungeonPMDO)
  const [map, setMap] = useState<DungeonPMDO | "town">("town")

  const [colorFilter, setColorFilter] = useState({ red: 255, green: 255, blue: 255, alpha: 0 })

  const onProgress = () =>
    setStatusMessage(debugScene?.current?.loadingManager?.statusMessage ?? "")

  const onComplete = useCallback(() => {
    setStatusMessage("Loading map...")
    debugScene.current?.updateMap(map).then(() => setLoaded(true))
  }, [map])

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
        scale: { mode: Phaser.Scale.FIT },
        dom: {
          createContainer: true
        },
        disableContextMenu: true,
        scene: [debugScene.current],
        backgroundColor: "var(--color-bg-primary)",
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
      debugScene.current?.updateMap(map)
    }
  }, [map])

  useEffect(() => {
    if (initialized.current === true && loaded === true) {
      debugScene.current?.updateColorFilter(colorFilter)
    }
  }, [colorFilter])

  return (
    <div id="debug-scene" className="map-viewer">
      {!loaded && <p id="status-message">{statusMessage}</p>}
      <div id="debug-scene-controls">
        <select
          onChange={(event) => setMap(event?.target.value as DungeonPMDO | "town")}
        >
          <option key="town" value="town">
            Treasure Town
          </option>
          {maps.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <details>
          <summary>Color filter</summary>
          <label>Red {colorFilter.red} <input type="range" min="0" max="255" value={colorFilter.red} onChange={e => setColorFilter({ ...colorFilter, red: +e.target.value })} /></label>
          <label>Green {colorFilter.green} <input type="range" min="0" max="255" value={colorFilter.green} onChange={e => setColorFilter({ ...colorFilter, green: +e.target.value })} /></label>
          <label>Blue {colorFilter.blue} <input type="range" min="0" max="255" value={colorFilter.blue} onChange={e => setColorFilter({ ...colorFilter, blue: +e.target.value })} /></label>
          <label>Alpha {colorFilter.alpha} <input type="range" min="0" max="100" value={colorFilter.alpha} onChange={e => setColorFilter({ ...colorFilter, alpha: +e.target.value })} /></label>
        </details>
      </div>
    </div>
  )
}
