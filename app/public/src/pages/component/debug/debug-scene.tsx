import Phaser from "phaser"
import MoveToPlugin from "phaser4-rex-plugins/plugins/moveto-plugin"
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react"
import type { DungeonPMDO } from "../../../../../types/enum/Dungeon"
import { Orientation } from "../../../../../types/enum/Game"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { Weather } from "../../../../../types/enum/Weather"
import { DebugScene } from "../../../game/scenes/debug-scene"
import { preference } from "../../../preferences"
import { Checkbox } from "../checkbox/checkbox"
import type { AbilityPreviewOptions } from "./ability-preview"
import type { PreviewStatus } from "./preview-scenario"
import "./debug-scene.css"

export default function DebugSceneContainer({
  pkm = Pkm.RATTATA,
  orientation = Orientation.DOWNLEFT,
  animationType = "Idle",
  shiny,
  status,
  preview,
  map,
  weather,
  fitBoard,
  height = 100,
  width = 100
}: {
  pkm?: Pkm
  orientation?: Orientation
  animationType?: string
  shiny: boolean
  status: PreviewStatus
  preview: AbilityPreviewOptions
  map: DungeonPMDO | "plain"
  weather: Weather
  fitBoard: boolean
  height?: number
  width?: number
}) {
  const debugScene = useRef<DebugScene>(null)
  const pendingDestruction = useRef<Promise<void>>(Promise.resolve())

  const [loadedScene, setLoadedScene] = useState<DebugScene | null>(null)
  const loaded = loadedScene !== null && loadedScene === debugScene.current
  const [settledMap, setSettledMap] = useState<{
    scene: DebugScene
    map: DungeonPMDO | "plain"
  }>()
  const mapLoading =
    loaded && (settledMap?.scene !== loadedScene || settledMap.map !== map)
  const [mapError, setMapError] = useState("")
  const [mapRevision, setMapRevision] = useState(0)
  const mapQueue = useRef<Promise<void>>(Promise.resolve())

  const [statusMessage, setStatusMessage] = useState<string>("")
  const spriteRequest = useMemo(
    () => ({
      pkm,
      orientation,
      animationType,
      status,
      shiny,
      preview,
      mapRevision,
      loadedScene
    }),
    [
      pkm,
      orientation,
      animationType,
      status,
      shiny,
      preview,
      mapRevision,
      loadedScene
    ]
  )
  const [readySprites, setReadySprites] = useState<typeof spriteRequest>()
  const [paused, setPaused] = useState(false)
  const [loop, setLoop] = useState(false)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const ready = loaded && readySprites === spriteRequest && !mapLoading
  const isAbility = animationType === "Ability"
  const previewDuration = loadedScene?.previewDuration ?? 2000
  const previewFrameDuration = 1000 / 60
  const previewTimelineMax =
    Math.floor((previewDuration + 1e-8) / previewFrameDuration) *
    previewFrameDuration

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
      setElapsed(null)
      const { pkm, orientation, animationType, status, shiny, preview } =
        spriteRequest
      debugScene.current?.updateSprite(
        pkm,
        orientation,
        animationType,
        status,
        shiny,
        preview,
        () => setReadySprites(spriteRequest)
      )
    }
  }, [loaded, spriteRequest])

  useEffect(() => {
    if (loadedScene) loadedScene.setPreviewPaused(isAbility && paused && ready)
  }, [loadedScene, isAbility, paused, ready])

  useEffect(() => {
    if (loadedScene) loadedScene.loopAbility = loop
  }, [loadedScene, loop])

  useEffect(() => {
    if (!ready || !loadedScene || !isAbility) return
    loadedScene.replayAbility()
    setElapsed(0)
  }, [ready, loadedScene, isAbility])

  useEffect(() => {
    if (!ready || !loadedScene || !isAbility || paused) return
    const timer = setInterval(() => setElapsed(loadedScene.abilityElapsed), 50)
    return () => clearInterval(timer)
  }, [ready, loadedScene, isAbility, paused])

  useEffect(() => {
    if (!loaded) return
    let active = true
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
        if (active) setSettledMap({ scene, map })
      }
    })
    return () => {
      active = false
    }
  }, [loaded, map])

  useEffect(() => {
    if (loaded && !mapLoading) debugScene.current?.setWeather(weather)
  }, [loaded, mapLoading, mapRevision, weather])

  const seekTo = (time: number) => {
    if (!loadedScene || !ready || !isAbility) return
    setPaused(true)
    loadedScene.setPreviewPaused(true)
    setElapsed(loadedScene.seekPreviewTime(time))
  }

  return (
    <div className="sprite-viewer-preview">
      <div className="sprite-viewer-playback my-box">
        <button
          type="button"
          id="preview-replay"
          disabled={!ready || !isAbility}
          onClick={() => {
            loadedScene?.replayAbility()
            setElapsed(0)
          }}
        >
          Replay ability
        </button>
        <button
          type="button"
          id="preview-pause"
          disabled={!ready || !isAbility}
          onClick={() => {
            if (loadedScene) setElapsed(loadedScene.abilityElapsed)
            setPaused(!paused)
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          id="preview-step"
          disabled={!ready || !isAbility || !paused}
          onClick={() => {
            if (!loadedScene) return
            loadedScene.stepPreviewFrame()
            setElapsed(loadedScene.abilityElapsed)
          }}
        >
          Next frame
        </button>
        <Checkbox
          id="preview-loop"
          checked={loop}
          onToggle={setLoop}
          label="Loop ability"
          isDark
          disabled={!isAbility}
        />
        <output
          id="preview-elapsed"
          aria-label="Cast elapsed time"
          aria-live="off"
        >
          {elapsed === null ? "-" : `${Math.round(elapsed)} ms`}
        </output>
        <span id="preview-ready" role="status" data-ready={ready}>
          {ready
            ? mapError
              ? "Ready (plain background)"
              : "Ready"
            : mapLoading
              ? "Loading preview background..."
              : loaded
                ? "Loading sprites..."
                : statusMessage || "Loading preview..."}
        </span>
        <div className="sprite-viewer-timeline">
          <label htmlFor="preview-timeline">Timeline</label>
          <input
            type="range"
            id="preview-timeline"
            aria-label="Ability timeline"
            min={0}
            max={previewTimelineMax}
            step={previewFrameDuration}
            value={Math.min(
              Math.round((elapsed ?? 0) / previewFrameDuration) *
                previewFrameDuration,
              previewTimelineMax
            )}
            disabled={!ready || !isAbility}
            onChange={(event) => seekTo(+event.currentTarget.value)}
          />
          <output id="preview-timeline-time" aria-live="off">
            {Math.round(elapsed ?? 0)} ms
          </output>
        </div>
      </div>
      {mapError && <p role="alert">Background error: {mapError}</p>}
      <div
        className={`sprite-viewer-stage${fitBoard ? " fit-board" : ""}`}
        id="preview-stage"
        style={{ "--preview-aspect": width / height } as CSSProperties}
      >
        <div id="debug-scene" style={{ aspectRatio: `${width} / ${height}` }} />
      </div>
    </div>
  )
}
