import { useTranslation } from "react-i18next"
import { SynergyTiersThresholds } from "../../../../../config"
import type { Synergy } from "../../../../../types/enum/Synergy"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"
import SynergyIcon from "../icons/synergy-icon"

export default function SynergyComponent(props: {
  type: Synergy
  value: number
  index: number
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const { t } = useTranslation()
  const thresholdReached =
    SynergyTiersThresholds[props.type].filter((n) => n <= props.value).at(-1) ??
    0
  const isActive = thresholdReached > 0

  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const highlightSynergy = (type: Synergy) => {
    const scene = getGameScene()
    if (!scene) return
    if (!spectatedPlayer?.board?.forEach) return
    spectatedPlayer.board.forEach((p) => {
      if (p.types.has(type)) {
        const sprite = scene.board?.pokemons.get(p.id)?.sprite
        if (sprite) {
          scene.setHovered(sprite, 4)
        }
      }
    })
  }

  const removeHighlightSynergy = (type: Synergy) => {
    const scene = getGameScene()
    if (!scene) return
    if (!spectatedPlayer?.board?.forEach) return
    spectatedPlayer?.board.forEach((p) => {
      if (p.types.has(type)) {
        const sprite = scene.board?.pokemons.get(p.id)?.sprite
        if (sprite) {
          scene.clearHovered(sprite)
        }
      }
    })
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "40px 2ch 1fr",
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: isActive
          ? "var(--color-bg-secondary)"
          : "rgba(84, 89, 107,0)",
        margin: "4px",
        borderRadius: "12px",
        padding: "2px 0",
        border: isActive ? "var(--border-thin)" : "none",
        cursor: "var(--cursor-hover)"
      }}
      data-tooltip-id="detail-synergy"
      onMouseEnter={() => {
        highlightSynergy(props.type)
        props.onMouseEnter()
      }}
      onMouseLeave={() => {
        removeHighlightSynergy(props.type)
        props.onMouseLeave()
      }}
    >
      <SynergyIcon type={props.type} />
      <span
        style={{
          fontSize: "2em",
          textShadow: "2px 2px 2px #000000c0",
          textAlign: "center",
          marginRight: "4px",
          color: thresholdReached > 0 ? "#ffffff" : "#b8b8b8"
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
          {SynergyTiersThresholds[props.type].map((t) => {
            return (
              <span
                key={t}
                style={{
                  color:
                    thresholdReached === t
                      ? "var(--color-fg-gold)"
                      : props.value >= t
                        ? "var(--color-fg-primary)"
                        : "var(--color-fg-secondary)"
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
