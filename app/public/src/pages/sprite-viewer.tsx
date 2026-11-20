import { t } from "i18next"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../config"
import { getPokemonData } from "../../../models/precomputed/precomputed-pokemon-data"
import { DungeonPMDO } from "../../../types/enum/Dungeon"
import { Orientation } from "../../../types/enum/Game"
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
  const [shiny, setShiny] = useState(scenario.shiny)
  const [orientation, setOrientation] = useState(scenario.orientation)
  const [animationType, setAnimType] = useState(scenario.animation)
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
  const [map, setMap] = useState(scenario.map)
  const [weather, setWeather] = useState(scenario.weather)
  const [fitBoard, setFitBoard] = useState(true)
  const [shareOpen, setShareOpen] = useState(false)

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
    () => ({ caster, target, flip, data: payload }),
    [caster, target, flip, payload]
  )

  const applyPayload = () => {
    try {
      setPayload(parseAbilityPreviewData(payloadText))
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
                <option value={v} key={v}>
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
            </div>
            {shareOpen && (
              <label className="sprite-viewer-share">
                Preview link
                <input
                  id="preview-share-url"
                  readOnly
                  onFocus={(event) => event.currentTarget.select()}
                  value={previewScenarioUrl(location.href, {
                    pokemon: pkm,
                    orientation,
                    animation: animationType,
                    shiny,
                    status,
                    caster,
                    targetMode,
                    customTarget,
                    flip,
                    map,
                    weather,
                    data: payload
                  })}
                />
              </label>
            )}
            <details className="sprite-viewer-payload-details">
              <summary>Ability data (JSON)</summary>
              <small>
                Presets use the current board positions; reapply after moving
                units. No affected targets keeps the selected target as an aim
                point.
              </small>
              <label htmlFor="preview-payload">
                Ability data (JSON object)
              </label>
              <div className="sprite-viewer-payload">
                <textarea
                  id="preview-payload"
                  value={payloadText}
                  onChange={(e) => setPayloadText(e.currentTarget.value)}
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
          </div>
        </div>
        <div className="sprite-viewer-sprite">
          <DebugScene
            pkm={pkm}
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
