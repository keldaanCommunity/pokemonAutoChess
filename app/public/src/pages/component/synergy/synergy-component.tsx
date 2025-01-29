import React from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { SynergyTriggers } from "../../../../../types/Config"
import { Synergy } from "../../../../../types/enum/Synergy"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import SynergyIcon from "../icons/synergy-icon"
import SynergyDetailComponent from "./synergy-detail-component"
import OutlinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin"

export default function SynergyComponent(props: {
  type: Synergy
  value: number
  index: number,
  tooltipPortal: boolean
}) {
  const { t } = useTranslation()
  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)

  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const hightlightSynergy = (type: Synergy) => {
    const scene = getGameScene()
    if (!scene) return
    const outline = scene.plugins.get("rexOutline") as OutlinePlugin
    if (!outline) return; // outline plugin doesnt work with canvas renderer
    currentPlayer?.board.forEach((p) => {
      if (p.types.has(type)) {
        const sprite = scene.board?.pokemons.get(p.id)?.sprite
        if (sprite) {
          outline.add(sprite, {
            thickness: 4,
            outlineColor: 0xffffff
          })
        }
      }
    })
  }

  const removeHightlightSynergy = (type: Synergy) => {
    const scene = getGameScene()
    if (!scene) return
    const outline = scene.plugins.get("rexOutline") as OutlinePlugin
    if (!outline) return; // outline plugin doesnt work with canvas renderer
    currentPlayer?.board.forEach((p) => {
      if (p.types.has(type)) {
        const sprite = scene.board?.pokemons.get(p.id)?.sprite
        if (sprite) {
          outline.remove(sprite)
        }
      }
    })
  }

  const tooltip = <Tooltip
    id={"detail-" + props.type}
    className="custom-theme-tooltip"
    place="right"
    data-tooltip-offset={{ bottom: (5 - props.index) * 50 }}
  >
    <SynergyDetailComponent type={props.type} value={props.value} />
  </Tooltip>

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 2ch 1fr",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor:
          props.value >= SynergyTriggers[props.type][0]
            ? "var(--color-bg-secondary)"
            : "rgba(84, 89, 107,0)",
        margin: "5px",
        borderRadius: "12px",
        padding: "2px",
        border:
          props.value >= SynergyTriggers[props.type][0]
            ? "var(--border-thin)"
            : "none",
        cursor: "var(--cursor-hover)"
      }}
      data-tooltip-id={"detail-" + props.type}
      onMouseEnter={() => { hightlightSynergy(props.type) }}
      onMouseLeave={() => { removeHightlightSynergy(props.type) }}
    >
      {props.tooltipPortal ? ReactDOM.createPortal(tooltip, document.body) : tooltip}

      <SynergyIcon type={props.type} size="40px" />
      <span
        style={{
          fontSize: "32px",
          textShadow: "2px 2px 2px #00000080",
          textAlign: "center"
        }}
      >
        {props.value}
      </span>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          lineHeight: 1.25
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          {SynergyTriggers[props.type].map((t) => {
            return (
              <span
                key={t}
                style={{
                  color:
                    levelReached === t
                      ? "#f7d51d"
                      : props.value >= t
                        ? "#ffffff"
                        : "#b8b8b8"
                }}
              >
                {t}
              </span>
            )
          })}
        </div>
        <p style={{ margin: "0px", textAlign: "center", fontWeight: "500" }}>
          {t(`synergy.${props.type}`)}
        </p>
      </div>
    </div>
  )
}
