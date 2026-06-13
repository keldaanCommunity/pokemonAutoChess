import { useTranslation } from "react-i18next"
import { SynergyTriggers } from "../../../../../config"
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
  const levelReached = SynergyTriggers[props.type]
    .filter((n) => n <= props.value)
    .at(-1)

  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const highlightSynergy = (type: Synergy) => {
    const scene = getGameScene()
    if (!scene) return
    if (!spectatedPlayer?.board) return
    spectatedPlayer.board.forEach((p) => {
      if (p.hasSynergy(type)) {
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
    spectatedPlayer?.board.forEach((p) => {
      if (p.hasSynergy(type)) {
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
        backgroundColor:
          props.value >= SynergyTriggers[props.type][0]
            ? "var(--color-bg-secondary)"
            : "rgba(84, 89, 107,0)",
        margin: "4px",
        borderRadius: "12px",
        padding: "2px 0",
        border:
          props.value >= SynergyTriggers[props.type][0]
            ? "var(--border-thin)"
            : "none",
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
          color: levelReached ? "#ffffff" : "#b8b8b8"
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
