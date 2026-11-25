import { t } from "i18next"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../config"
import PokemonFactory from "../../../models/pokemon-factory"
import { getPokemonData } from "../../../models/precomputed/precomputed-pokemon-data"
import { Ability } from "../../../types/enum/Ability"
import { DungeonPMDO } from "../../../types/enum/Dungeon"
import { Orientation, OrientationFlip } from "../../../types/enum/Game"
import { Pkm } from "../../../types/enum/Pokemon"
import { Status } from "../../../types/enum/Status"
import { Weather } from "../../../types/enum/Weather"
import { OrientationVector } from "../../../utils/orientation"
import { DebugScene as PhaserDebugScene } from "../game/scenes/debug-scene"
import { Checkbox } from "./component/checkbox/checkbox"
import {
  type AbilityPreviewData,
  type AbilityPreviewPreset,
  createAbilityPreviewPreset,
  parseAbilityPreviewData
} from "./component/debug/ability-preview"
import DebugScene from "./component/debug/debug-scene"
import {
  DEFAULT_SCENARIO,
  EXTRA_PREVIEW_STATUSES,
  isPreviewStatus,
  PREVIEW_ANIMATIONS,
  previewScenarioUrl,
  readPreviewScenario
} from "./component/debug/preview-scenario"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { PokemonTypeahead } from "./component/typeahead/pokemon-typeahead"
import "./sprite-viewer.css"

export function SpriteDebug() {
  const navigate = useNavigate()
  const [{ scenario, linkError }] = useState(() => {
    try {
      return { scenario: readPreviewScenario(location.search), linkError: "" }
    } catch (error) {
      return { scenario: DEFAULT_SCENARIO, linkError: String(error) }
    }
  })
  const [pkm, setPkm] = useState(scenario.pokemon)
  const [speed, setSpeed] = useState<number | undefined>(scenario.speed)
  const defaultSpeed = useMemo(
    () => PokemonFactory.createPokemonFromName(pkm).speed,
    [pkm]
  )
  const [shiny, setShiny] = useState(scenario.shiny)
  const [orientation, setOrientation] = useState(scenario.orientation)
  const [animationType, setAnimType] = useState(scenario.animation)
  const [hyperBeam, setHyperBeam] = useState(
    scenario.ability === Ability.HYPER_BEAM
  )
  const [status, setStatus] = useState(scenario.status ?? "")
  const [caster, setCaster] = useState(scenario.caster)
  const [targetMode, setTargetMode] = useState<"auto" | "custom" | "none">(
    scenario.targetMode
  )
  const [customTarget, setCustomTarget] = useState(scenario.customTarget)
  const [flip, setFlip] = useState(scenario.flip)
  const [payloadText, setPayloadText] = useState(
    JSON.stringify(scenario.data, null, 2)
  )
  const [payload, setPayload] = useState<AbilityPreviewData>(scenario.data)
  const [payloadError, setPayloadError] = useState("")
  const [payloadOpen, setPayloadOpen] = useState(
    scenario.animation === "Ability"
  )
  const [map, setMap] = useState(scenario.map)
  const [weather, setWeather] = useState(scenario.weather)
  const [fitBoard, setFitBoard] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)
  const shareLinkInput = useRef<HTMLInputElement>(null)
  const [shareStatus, setShareStatus] = useState("")
  const [loadedClientSrc] = useState(
    () =>
      document.querySelector<HTMLScriptElement>('script[src*="index-"]')?.src ??
      ""
  )
  const [checkingClient, setCheckingClient] = useState(false)
  const [clientUpdateAvailable, setClientUpdateAvailable] = useState(false)
  const [clientCheckStatus, setClientCheckStatus] = useState("")
  const [clientCheckError, setClientCheckError] = useState("")

  const target = useMemo(() => {
    if (targetMode === "none") return null
    if (targetMode === "custom") return customTarget
    const range = Math.min(2, getPokemonData(pkm).range)
    const [dx, dy] = OrientationVector[orientation]
    return {
      x: Math.max(0, Math.min(BOARD_WIDTH - 1, caster.x + dx * range)),
      y: Math.max(0, Math.min(BOARD_HEIGHT - 1, caster.y + dy * range))
    }
  }, [caster, customTarget, orientation, pkm, targetMode])
  const preview = useMemo(
    () => ({
      caster,
      target,
      flip,
      data: payload,
      ability: hyperBeam ? Ability.HYPER_BEAM : undefined
    }),
    [caster, target, flip, payload, hyperBeam]
  )
  const payloadDirty = payloadText !== JSON.stringify(payload, null, 2)
  const shareUrl = useMemo(
    () =>
      previewScenarioUrl(location.href, {
        pokemon: pkm,
        orientation,
        animation: animationType,
        shiny,
        speed,
        status,
        caster,
        targetMode,
        customTarget,
        flip,
        map,
        weather,
        data: payload,
        ability: hyperBeam ? Ability.HYPER_BEAM : undefined
      }),
    [
      animationType,
      caster,
      customTarget,
      flip,
      hyperBeam,
      map,
      orientation,
      payload,
      pkm,
      speed,
      shiny,
      status,
      targetMode,
      weather
    ]
  )

  useEffect(() => {
    if (animationType === "Ability") setPayloadOpen(true)
  }, [animationType])

  useEffect(() => {
    setShareStatus("")
  }, [shareUrl])

  const applyPayload = () => {
    try {
      const data = parseAbilityPreviewData(payloadText)
      setPayload(data)
      setPayloadText(JSON.stringify(data, null, 2))
      setPayloadError("")
    } catch (error) {
      setPayloadError(error instanceof Error ? error.message : String(error))
    }
  }

  const applyPreset = (preset: AbilityPreviewPreset) => {
    const data = createAbilityPreviewPreset(preset, caster, target)
    setPayloadText(JSON.stringify(data, null, 2))
    setPayload(data)
    setPayloadError("")
  }

  const copyPreviewLink = async () => {
    const input = shareLinkInput.current
    if (!input) return
    if (payloadDirty) {
      setShareStatus("Apply the edited ability data before copying this link.")
      return
    }

    const link = input.value
    const url = new URL(link)
    navigate(`${url.pathname}${url.search}${url.hash}`, { replace: true })
    try {
      await navigator.clipboard.writeText(link)
      setShareStatus("Preview link copied.")
    } catch {
      input.focus()
      input.select()
      setShareStatus(
        "Clipboard unavailable. The link is selected for manual copy."
      )
    }
  }

  const checkClientUpdate = async () => {
    setCheckingClient(true)
    setClientCheckStatus("")
    setClientCheckError("")
    setClientUpdateAvailable(false)
    try {
      if (!loadedClientSrc) {
        throw new Error("Could not identify the loaded client bundle.")
      }
      const response = await fetch(location.href, { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`Preview page returned HTTP ${response.status}.`)
      }
      const html = await response.text()
      const latestSrc = new DOMParser()
        .parseFromString(html, "text/html")
        .querySelector<HTMLScriptElement>('script[src*="index-"]')
        ?.getAttribute("src")
      if (!latestSrc) {
        throw new Error("Could not find a client bundle in the preview page.")
      }

      const latestUrl = new URL(latestSrc, response.url).href
      const loadedUrl = new URL(loadedClientSrc, location.href).href
      const updateAvailable = latestUrl !== loadedUrl
      setClientUpdateAvailable(updateAvailable)
      setClientCheckStatus(
        updateAvailable
          ? "A newer client bundle is available."
          : "The loaded client bundle is current."
      )
    } catch (error) {
      setClientCheckError(
        error instanceof Error ? error.message : String(error)
      )
    } finally {
      setCheckingClient(false)
    }
  }

  return (
    <div className="sprite-viewer-root">
      <MainSidebar
        page="main_lobby"
        onClickLeave={() => navigate("/lobby")}
        leaveLabel={t("back_to_lobby")}
      />
      <div className="sprite-viewer-container">
        <div className="sprite-viewer-settings">
          {linkError && (
            <p role="alert">Preview link could not be loaded: {linkError}</p>
          )}
          <div className="sprite-viewer-toolbar my-box">
            <label htmlFor="pokemon-typeahead">Pokemon</label>
            <PokemonTypeahead
              value={pkm}
              options={Object.values(Pkm).sort((a, b) =>
                t(`pkm.${a}`).localeCompare(t(`pkm.${b}`))
              )}
              onChange={(pkm) => {
                if (pkm) {
                  setPkm(pkm)
                  setSpeed(undefined)
                }
              }}
            />
            <label htmlFor="preview-speed">Speed</label>
            <input
              id="preview-speed"
              type="number"
              min={0}
              max={300}
              step={1}
              value={speed ?? defaultSpeed}
              aria-label="Speed override"
              onChange={(event) => {
                const rawValue = event.currentTarget.value
                if (rawValue === "") {
                  setSpeed(undefined)
                  return
                }
                const value = Number(rawValue)
                if (Number.isFinite(value)) {
                  setSpeed(Math.max(0, Math.min(300, value)))
                }
              }}
            />
            <Checkbox
              checked={shiny}
              onToggle={setShiny}
              label={t("shiny")}
              isDark
            />

            <label htmlFor="sprite-viewer-orientation">Orientation</label>
            <select
              id="sprite-viewer-orientation"
              value={orientation}
              onChange={(e) =>
                setOrientation(e.currentTarget.value as Orientation)
              }
            >
              {Object.entries(Orientation).map(([k, v]) => (
                <option value={flip ? OrientationFlip[v] : v} key={v}>
                  {k}
                </option>
              ))}
            </select>

            <label htmlFor="sprite-viewer-anim-type">Anim type</label>
            <select
              id="sprite-viewer-anim-type"
              value={animationType}
              onChange={(e) => setAnimType(e.currentTarget.value)}
            >
              {PREVIEW_ANIMATIONS.map((animation) => (
                <option key={animation} value={animation}>
                  {animation}
                </option>
              ))}
            </select>

            <Checkbox
              id="preview-hyper-beam"
              checked={hyperBeam}
              onToggle={setHyperBeam}
              label="Preview Hyper Beam (TM)"
              isDark
            />

            <label htmlFor="sprite-viewer-status">Status</label>
            <select
              id="sprite-viewer-status"
              value={status}
              onChange={(e) => {
                const value = e.currentTarget.value
                if (isPreviewStatus(value)) setStatus(value)
              }}
            >
              <option value="">None</option>
              {Object.entries(Status).map(([k, v]) => (
                <option value={v} key={v}>
                  {k}
                </option>
              ))}
              {Object.entries(EXTRA_PREVIEW_STATUSES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="sprite-viewer-controls my-box">
            <div className="sprite-viewer-control-row">
              <label htmlFor="preview-caster-x">Caster X</label>
              <select
                id="preview-caster-x"
                value={caster.x}
                onChange={(e) =>
                  setCaster({ ...caster, x: +e.currentTarget.value })
                }
              >
                {Array.from({ length: BOARD_WIDTH }, (_, x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <label htmlFor="preview-caster-y">Y</label>
              <select
                id="preview-caster-y"
                value={caster.y}
                onChange={(e) =>
                  setCaster({ ...caster, y: +e.currentTarget.value })
                }
              >
                {Array.from({ length: BOARD_HEIGHT }, (_, y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label htmlFor="preview-target-mode">Selected target</label>
              <select
                id="preview-target-mode"
                value={targetMode}
                onChange={(e) =>
                  setTargetMode(e.currentTarget.value as typeof targetMode)
                }
              >
                <option value="auto">Auto</option>
                <option value="custom">Custom</option>
                <option value="none">None</option>
              </select>
              <label htmlFor="preview-target-x">X</label>
              <select
                id="preview-target-x"
                disabled={targetMode === "none"}
                value={target?.x ?? customTarget.x}
                onChange={(e) => {
                  setCustomTarget({
                    x: +e.currentTarget.value,
                    y: target?.y ?? customTarget.y
                  })
                  setTargetMode("custom")
                }}
              >
                {Array.from({ length: BOARD_WIDTH }, (_, x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
              <label htmlFor="preview-target-y">Y</label>
              <select
                id="preview-target-y"
                disabled={targetMode === "none"}
                value={target?.y ?? customTarget.y}
                onChange={(e) => {
                  setCustomTarget({
                    x: target?.x ?? customTarget.x,
                    y: +e.currentTarget.value
                  })
                  setTargetMode("custom")
                }}
              >
                {Array.from({ length: BOARD_HEIGHT }, (_, y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <label>
                <input
                  id="preview-flip"
                  type="checkbox"
                  checked={flip}
                  onChange={(event) => setFlip(event.currentTarget.checked)}
                />
                Flip board
              </label>
            </div>
            <div className="sprite-viewer-control-row">
              <label htmlFor="preview-map">Background</label>
              <select
                id="preview-map"
                value={map}
                onChange={(e) =>
                  setMap(e.currentTarget.value as DungeonPMDO | "plain")
                }
              >
                <option value="plain">Plain</option>
                {Object.values(DungeonPMDO).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <label htmlFor="preview-weather">Weather</label>
              <select
                id="preview-weather"
                value={weather}
                onChange={(e) => setWeather(e.currentTarget.value as Weather)}
              >
                {Object.values(Weather).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="sprite-viewer-control-row">
              <span>Payload presets:</span>
              <button
                id="preview-preset-target"
                type="button"
                onClick={() => applyPreset("target")}
              >
                Target
              </button>
              <button
                id="preview-preset-adjacent"
                type="button"
                onClick={() => applyPreset("adjacent")}
              >
                Target + adjacent
              </button>
              <button
                id="preview-preset-enemies"
                type="button"
                onClick={() => applyPreset("enemies")}
              >
                Adjacent enemies
              </button>
              <button
                id="preview-preset-allies"
                type="button"
                onClick={() => applyPreset("allies")}
              >
                Adjacent allies
              </button>
              <button
                id="preview-preset-none"
                type="button"
                onClick={() => applyPreset("none")}
              >
                No affected targets
              </button>
            </div>
            <div className="sprite-viewer-control-row">
              <button
                id="preview-fit"
                type="button"
                aria-pressed={fitBoard}
                onClick={() => setFitBoard(!fitBoard)}
              >
                Fit board
              </button>
              <button
                id="preview-share"
                type="button"
                aria-expanded={shareOpen}
                onClick={() => setShareOpen(!shareOpen)}
              >
                Share preview
              </button>
              <button
                id="preview-check-client"
                type="button"
                disabled={checkingClient}
                onClick={checkClientUpdate}
              >
                {checkingClient ? "Checking client..." : "Check for updates"}
              </button>
            </div>
            {(clientCheckStatus || clientCheckError) && (
              <div className="sprite-viewer-client-status">
                {clientCheckStatus && (
                  <span id="preview-client-status" role="status">
                    {clientCheckStatus}
                  </span>
                )}
                {clientCheckError && (
                  <span role="alert">
                    Client update check failed: {clientCheckError}
                  </span>
                )}
                {clientUpdateAvailable && (
                  <button
                    id="preview-reload-client"
                    type="button"
                    onClick={() => location.reload()}
                  >
                    Reload preview
                  </button>
                )}
              </div>
            )}
            {shareOpen && (
              <div className="sprite-viewer-share">
                <label htmlFor="preview-share-url">Preview link</label>
                <input
                  id="preview-share-url"
                  readOnly
                  ref={shareLinkInput}
                  onFocus={(event) => event.currentTarget.select()}
                  value={shareUrl}
                />
                <button
                  id="preview-copy-link"
                  type="button"
                  disabled={payloadDirty}
                  onClick={copyPreviewLink}
                >
                  Copy link
                </button>
                <span id="preview-share-status" role="status">
                  {shareStatus}
                </span>
                {payloadDirty && (
                  <span role="status">
                    Apply the edited ability data before sharing it.
                  </span>
                )}
              </div>
            )}
            <details
              className="sprite-viewer-payload-details"
              open={payloadOpen}
              onToggle={(event) => setPayloadOpen(event.currentTarget.open)}
            >
              <summary>Ability data (JSON)</summary>
              <small>
                Presets use the current board positions; reapply after moving
                units. Adjacent enemies is centered on the caster. The selected
                target remains visible independently of the affected targets.
              </small>
              <label htmlFor="preview-payload">
                Ability data (JSON object)
              </label>
              <div className="sprite-viewer-payload">
                <textarea
                  id="preview-payload"
                  value={payloadText}
                  aria-invalid={Boolean(payloadError || payloadDirty)}
                  onChange={(e) => {
                    setPayloadText(e.currentTarget.value)
                    setPayloadError("")
                  }}
                  spellCheck={false}
                  rows={4}
                />
                <button id="preview-apply" type="button" onClick={applyPayload}>
                  Apply data
                </button>
              </div>
              {payloadError && (
                <p role="alert" className="sprite-viewer-error">
                  Invalid payload: {payloadError}
                </p>
              )}
            </details>
            <details className="sprite-viewer-payload-details">
              <summary>
                Applied ability data ({Object.keys(payload).length} fields)
              </summary>
              <pre id="preview-applied-data">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </details>
            {payloadDirty && (
              <p id="preview-payload-dirty" role="status">
                Ability data has unapplied edits. Preview and share link still
                use the applied data.
              </p>
            )}
          </div>
        </div>
        <div className="sprite-viewer-sprite">
          <DebugScene
            pkm={pkm}
            speed={speed}
            orientation={orientation}
            animationType={animationType}
            shiny={shiny}
            status={status}
            preview={preview}
            map={map}
            weather={weather}
            fitBoard={fitBoard}
            width={PhaserDebugScene.VIEW_WIDTH}
            height={PhaserDebugScene.VIEW_HEIGHT}
          />
        </div>
      </div>
    </div>
  )
}
