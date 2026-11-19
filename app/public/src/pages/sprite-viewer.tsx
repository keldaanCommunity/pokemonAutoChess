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
import { Checkbox } from "./component/checkbox/checkbox"
import {
  type AbilityPreviewData,
  type AbilityPreviewPreset,
  createAbilityPreviewPreset,
  type PreviewCell,
  parseAbilityPreviewData
} from "./component/debug/ability-preview"
import DebugScene from "./component/debug/debug-scene"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { PokemonTypeahead } from "./component/typeahead/pokemon-typeahead"
import "./sprite-viewer.css"

export function SpriteDebug() {
  const navigate = useNavigate()
  const [pkm, setPkm] = useState<Pkm>(Pkm.RATTATA)
  const [shiny, setShiny] = useState<boolean>(false)
  const [orientation, setOrientation] = useState<Orientation>(
    Orientation.DOWNLEFT
  )
  const [animationType, setAnimType] = useState<string>("Idle")
  const [status, setStatus] = useState<Status | "">("")
  const [caster, setCaster] = useState<PreviewCell>({ x: 3, y: 3 })
  const [targetMode, setTargetMode] = useState<"auto" | "custom" | "none">(
    "auto"
  )
  const [customTarget, setCustomTarget] = useState<PreviewCell>({ x: 4, y: 3 })
  const [flip, setFlip] = useState(false)
  const [payloadText, setPayloadText] = useState("{}")
  const [payload, setPayload] = useState<AbilityPreviewData>({})
  const [payloadError, setPayloadError] = useState("")
  const [replay, setReplay] = useState(0)
  const [map, setMap] = useState<DungeonPMDO | "plain">("plain")
  const [weather, setWeather] = useState<Weather>(Weather.NEUTRAL)

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
            <option value="Idle">Idle</option>
            <option value="Walk">Walk</option>
            <option value="Sleep">Sleep</option>
            <option value="Eat">Eat</option>
            <option value="Hurt">Hurt</option>
            <option value="Hop">Hop</option>
            <option value="Attack">Attack</option>
            <option value="Ability">Ability</option>
            <option value="Emote">Emote</option>
          </select>

          <label htmlFor="sprite-viewer-status">Status</label>
          <select
            id="sprite-viewer-status"
            value={status}
            onChange={(e) => setStatus(e.currentTarget.value as Status)}
          >
            <option value="">None</option>
            {Object.entries(Status).map(([k, v]) => (
              <option value={v} key={v}>
                {k}
              </option>
            ))}
            <option value="POISONNED_BADLY">Poisonned badly</option>
            <option value="BALM_MUSHROOM">Balm Mushroom</option>
            <option value="BOOST/ATK">Boost Attack</option>
            <option value="BOOST/DEF">Boost Defense</option>
            <option value="BOOST/SPE_DEF">Boost Special Defense</option>
            <option value="BOOST/SHIELD">Boost Shield</option>
            <option value="BOOST/SPEED">Boost Speed</option>
            <option value="BOOST/AP">Boost AP</option>
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
            <Checkbox
              checked={flip}
              onToggle={setFlip}
              label="Flip board"
              isDark
            />
            <button
              type="button"
              disabled={animationType !== "Ability"}
              onClick={() => setReplay((n) => n + 1)}
            >
              Replay ability
            </button>
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
            <button type="button" onClick={() => applyPreset("target")}>
              Target
            </button>
            <button type="button" onClick={() => applyPreset("adjacent")}>
              Target + adjacent
            </button>
            <button type="button" onClick={() => applyPreset("allies")}>
              Adjacent allies
            </button>
            <button type="button" onClick={() => applyPreset("none")}>
              No affected targets
            </button>
          </div>
          <details className="sprite-viewer-payload-details">
            <summary>Ability data (JSON)</summary>
            <small>
              Presets use the current board positions; reapply after moving
              units. No affected targets keeps the selected target as an aim
              point.
            </small>
            <label htmlFor="preview-payload">Ability data (JSON object)</label>
            <div className="sprite-viewer-payload">
              <textarea
                id="preview-payload"
                value={payloadText}
                onChange={(e) => setPayloadText(e.currentTarget.value)}
                spellCheck={false}
                rows={4}
              />
              <button type="button" onClick={applyPayload}>
                Apply data
              </button>
            </div>
            {payloadError && (
              <p role="alert" className="sprite-viewer-error">
                Invalid payload: {payloadError}
              </p>
            )}
          </details>
        </div>
        <div className="sprite-viewer-sprite">
          <DebugScene
            pkm={pkm}
            orientation={orientation}
            animationType={animationType}
            shiny={shiny}
            status={status}
            preview={preview}
            replay={replay}
            map={map}
            weather={weather}
            width={1950}
            height={1000}
          />
        </div>
      </div>
    </div>
  )
}
