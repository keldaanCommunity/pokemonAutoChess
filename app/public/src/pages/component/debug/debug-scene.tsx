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

const MIN_PREVIEW_ZOOM = 0.5
const MAX_PREVIEW_ZOOM = 3
const PREVIEW_ZOOM_STEP = 0.25

export default function DebugSceneContainer({
  pkm = Pkm.RATTATA,
  speed,
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
  speed?: number
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
  const previewStage = useRef<HTMLDivElement>(null)
  const pendingDestruction = useRef<Promise<void>>(Promise.resolve())

  const [zoom, setZoom] = useState(1)
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
      speed,
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
      speed,
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
  const [seekTime, setSeekTime] = useState("")
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
      const { pkm, speed, orientation, animationType, status, shiny, preview } =
        spriteRequest
      debugScene.current?.updateSprite(
        pkm,
        orientation,
        animationType,
        status,
        shiny,
        preview,
        () => setReadySprites(spriteRequest),
        speed
      )
    }
  }, [loaded, spriteRequest])

  const isAttack = animationType === "Attack"
  const isTimelinePreview = isAbility || isAttack
  const canControlTimeline =
    ready && (isAbility || (isAttack && preview.target !== null))

  useEffect(() => {
    if (loadedScene)
      loadedScene.setPreviewPaused(isTimelinePreview && paused && ready)
  }, [loadedScene, isTimelinePreview, paused, ready])

  useEffect(() => {
    if (loadedScene) loadedScene.loopPreview = loop
  }, [loadedScene, loop])

  useEffect(() => {
    if (!ready || !loadedScene || !isTimelinePreview) return
    loadedScene.replayPreview()
    setElapsed(0)
  }, [ready, loadedScene, isTimelinePreview])

  useEffect(() => {
    if (!ready || !loadedScene || !isTimelinePreview || paused) return
    const timer = setInterval(() => setElapsed(loadedScene.previewElapsed), 50)
    return () => clearInterval(timer)
  }, [ready, loadedScene, isTimelinePreview, paused])

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
    if (!loadedScene || !canControlTimeline) return
    setPaused(true)
    loadedScene.setPreviewPaused(true)
    setElapsed(loadedScene.seekPreviewTime(time))
  }

  const adjustZoom = (amount: number) => {
    setZoom((current) =>
      Phaser.Math.Clamp(current + amount, MIN_PREVIEW_ZOOM, MAX_PREVIEW_ZOOM)
    )
  }

  useEffect(() => {
    const stage = previewStage.current
    if (!stage || zoom <= 1) return
    stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2
    stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2
  }, [zoom])

  useEffect(() => {
    const stage = previewStage.current
    if (!stage) return

    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      setZoom((current) =>
        Phaser.Math.Clamp(
          current + (event.deltaY < 0 ? PREVIEW_ZOOM_STEP : -PREVIEW_ZOOM_STEP),
          MIN_PREVIEW_ZOOM,
          MAX_PREVIEW_ZOOM
        )
      )
    }

    stage.addEventListener("wheel", handleWheel, { passive: false })
    return () => stage.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <div className="sprite-viewer-preview">
      <div className="sprite-viewer-playback my-box">
        <button
          type="button"
          id="preview-replay"
          disabled={!canControlTimeline}
          onClick={() => {
            loadedScene?.replayPreview()
            setElapsed(0)
          }}
        >
          Replay {isAbility ? "ability" : "attack"}
        </button>
        <button
          type="button"
          id="preview-pause"
          disabled={!canControlTimeline}
          onClick={() => {
            if (loadedScene) setElapsed(loadedScene.previewElapsed)
            setPaused(!paused)
          }}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          id="preview-step"
          disabled={!canControlTimeline || !paused}
          onClick={() => {
            if (!loadedScene) return
            loadedScene.stepPreviewFrame()
            setElapsed(loadedScene.previewElapsed)
          }}
        >
          Next frame
        </button>
        <Checkbox
          id="preview-loop"
          checked={loop}
          onToggle={setLoop}
          label="Loop preview"
          isDark
          disabled={!canControlTimeline}
        />
        <output
          id="preview-elapsed"
          aria-label="Preview elapsed time"
          aria-live="off"
        >
          {elapsed === null ? "-" : `${Math.round(elapsed)} ms`}
        </output>
        <div className="sprite-viewer-zoom-controls" aria-label="Canvas zoom">
          <button
            type="button"
            id="preview-zoom-out"
            aria-label="Zoom out"
            title="Zoom out"
            disabled={zoom <= MIN_PREVIEW_ZOOM}
            onClick={() => adjustZoom(-PREVIEW_ZOOM_STEP)}
          >
            -
          </button>
          <output id="preview-zoom-level" aria-label="Zoom level">
            {Math.round(zoom * 100)}%
          </output>
          <button
            type="button"
            id="preview-zoom-in"
            aria-label="Zoom in"
            title="Zoom in"
            disabled={zoom >= MAX_PREVIEW_ZOOM}
            onClick={() => adjustZoom(PREVIEW_ZOOM_STEP)}
          >
            +
          </button>
          <button
            type="button"
            id="preview-zoom-reset"
            aria-label="Reset zoom"
            title="Reset zoom to 100%"
            disabled={zoom === 1}
            onClick={() => setZoom(1)}
          >
            100%
          </button>
          <span className="sprite-viewer-zoom-hint">Ctrl/Cmd + wheel</span>
        </div>
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
            aria-label="Preview timeline"
            min={0}
            max={previewTimelineMax}
            step={previewFrameDuration}
            value={Math.min(
              Math.round((elapsed ?? 0) / previewFrameDuration) *
                previewFrameDuration,
              previewTimelineMax
            )}
            disabled={!canControlTimeline}
            onChange={(event) => seekTo(+event.currentTarget.value)}
          />
          <output id="preview-timeline-time" aria-live="off">
            {Math.round(elapsed ?? 0)} ms
          </output>
          <form
            className="sprite-viewer-timeline-seek"
            onSubmit={(event) => {
              event.preventDefault()
              seekTo(Number(seekTime))
              setSeekTime("")
            }}
          >
            <label htmlFor="preview-seek-ms">Jump to (ms)</label>
            <input
              id="preview-seek-ms"
              type="number"
              min={0}
              max={Math.round(previewTimelineMax)}
              step={1}
              required
              value={seekTime}
              disabled={!canControlTimeline}
              onChange={(event) => setSeekTime(event.currentTarget.value)}
            />
            <button type="submit" disabled={!canControlTimeline}>
              Go
            </button>
          </form>
        </div>
      </div>
      {mapError && <p role="alert">Background error: {mapError}</p>}
      <div
        className={`sprite-viewer-stage${fitBoard ? " fit-board" : ""}${zoom > 1 ? " zoomed" : ""}`}
        id="preview-stage"
        ref={previewStage}
        style={
          {
            "--preview-aspect": width / height,
            "--preview-height": `${height * zoom}px`,
            "--preview-width": `${width * zoom}px`,
            "--preview-zoom": zoom
          } as CSSProperties
        }
      >
        <div id="debug-scene" style={{ aspectRatio: `${width} / ${height}` }} />
      </div>
    </div>
  )
}
