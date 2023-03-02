import React from "react"
import { RarityColor } from "../../../../../types/Config"
import { Pkm, PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"

export function GamePoolSection(props: {
  pool: Map<Pkm, number>
  name: string
}) {
  return (
    <div>
      <span
        style={{
          color: RarityColor[props.name.toUpperCase()],
          fontSize: "2vw"
        }}
      >
        {props.name}
      </span>
      <div style={{ display: "flex" }}>
        {Array.from(props.pool)
          .sort((a, b) => b[1] - a[1])
          .map(([pokemon, value]) => (
            <div
              className="pool-item"
              key={pokemon}
              style={{
                backgroundImage: `url('${getPortraitSrc(PkmIndex[pokemon])}')`
              }}
            >
              <span className="pool-item-value">{value}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

export function CommonPoolSection() {
  const pool = useAppSelector((state) => state.game.commonPool)
  return <GamePoolSection pool={pool} name="Common" />
}

export function UncommonPoolSection() {
  const pool = useAppSelector((state) => state.game.uncommonPool)
  return <GamePoolSection pool={pool} name="Uncommon" />
}

export function RarePoolSection() {
  const pool = useAppSelector((state) => state.game.rarePool)
  return <GamePoolSection pool={pool} name="Rare" />
}

export function EpicPoolSection() {
  const pool = useAppSelector((state) => state.game.epicPool)
  return <GamePoolSection pool={pool} name="Epic" />
}

export function LegendaryPoolSection() {
  const pool = useAppSelector((state) => state.game.legendaryPool)
  return <GamePoolSection pool={pool} name="Legendary" />
}
