import Phaser from "phaser"
import MoveToPlugin from "phaser4-rex-plugins/plugins/moveto-plugin"
import { useEffect, useRef, useState } from "react"
import type { DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Orientation } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import type { Status } from "../../../../../types/enum/Status"
import { Weather } from "../../../../../types/enum/Weather"
import { DebugScene } from "../../../game/scenes/debug-scene"
import { preference } from "../../../preferences"
import type { AbilityPreviewOptions } from "./ability-preview"
import "./debug-scene.css"

export default function DebugSceneContainer({
  pkm = Pkm.RATTATA,
  orientation = Orientation.DOWNLEFT,
  animationType = "Idle",
  shiny,
  status,
  preview,
  replay,
  map,
  weather,
  height = 100,
  width = 100
}: {
  pkm?: Pkm
  orientation?: Orientation
  animationType?: string
  shiny: boolean
  status: Status | ""
  preview: AbilityPreviewOptions
  replay: number
  map: DungeonPMDO | "plain"
  weather: Weather
  height?: number
  width?: number
}) {
  const debugScene = useRef<DebugScene>(null)
  const pendingDestruction = useRef<Promise<void>>(Promise.resolve())

  const [loadedScene, setLoadedScene] = useState<DebugScene | null>(null)
  const loaded = loadedScene !== null && loadedScene === debugScene.current
  const [mapLoading, setMapLoading] = useState(false)
  const [mapError, setMapError] = useState("")
  const [mapRevision, setMapRevision] = useState(0)
  const mapQueue = useRef<Promise<void>>(Promise.resolve())

  const [statusMessage, setStatusMessage] = useState<string>("")

  useEffect(() => {
    let active = true
    let game: Phaser.Game | undefined
    let scene: DebugScene | undefined
    setLoadedScene(null)
    // Phaser destroys games on the next frame; wait before sharing its plugin cache.
    pendingDestruction.current.then(() => {
      if (!active) return
      const nextScene = new DebugScene(
        height,
        width,
        () => {
          if (active)
            setStatusMessage(nextScene.loadingManager?.statusMessage ?? "")
        },
        () => {
          if (active) setLoadedScene(nextScene)
        }
      )
      scene = nextScene
      debugScene.current = nextScene
      game = new Phaser.Game({
        type: +(preference("renderer") ?? Phaser.AUTO),
        parent: "debug-scene",
        pixelArt: true,
        width,
        height,
        scene: [nextScene],
        backgroundColor: "#61738a",
        input: { mouse: { preventDefaultWheel: false } },
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
    })
    return () => {
      active = false
      if (scene) {
        clearInterval(scene.attackAnimInterval)
        scene.weatherManager?.clearWeather()
      }
      if (game) {
        const previousGame = game
        pendingDestruction.current = new Promise<void>((resolve) => {
          previousGame.events.once(Phaser.Core.Events.DESTROY, resolve)
          previousGame.destroy(true)
        })
      }
      debugScene.current = null
    }
  }, [height, width])

  useEffect(() => {
    if (loaded) {
      debugScene.current?.updateSprite(
        pkm,
        orientation,
        animationType,
        status,
        shiny,
        preview
      )
    }
  }, [
    pkm,
    orientation,
    animationType,
    status,
    loaded,
    shiny,
    preview,
    mapRevision
  ])

  useEffect(() => {
    if (loaded && replay > 0 && animationType === "Ability") {
      debugScene.current?.replayAbility()
    }
  }, [replay, loaded, animationType])

  useEffect(() => {
    if (!loaded) return
    let active = true
    setMapLoading(true)
    setMapError("")
    mapQueue.current = mapQueue.current.then(async () => {
      if (!active || !debugScene.current) return
      const scene = debugScene.current
      try {
        scene.setWeather(Weather.NEUTRAL)
        if (map === "plain") scene.clearPreviewMap()
        else await scene.updateMap(map, true)
        if (active) setMapRevision((revision) => revision + 1)
      } catch (error) {
        if (active) {
          scene.clearPreviewMap()
          setMapRevision((revision) => revision + 1)
          setMapError(error instanceof Error ? error.message : String(error))
        }
      } finally {
        if (active) setMapLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [loaded, map])

  useEffect(() => {
    if (loaded && !mapLoading) debugScene.current?.setWeather(weather)
  }, [loaded, mapLoading, mapRevision, weather])

  return (
    <div id="debug-scene">
      {!loaded && <p id="status-message">{statusMessage}</p>}
      {mapLoading && <p id="status-message">Loading preview background...</p>}
      {mapError && (
        <p role="alert" id="status-message">
          Background error: {mapError}
        </p>
      )}
    </div>
  )
}
