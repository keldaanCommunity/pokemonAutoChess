import React from "react"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { RarityColor } from "../../../../../types/Config"
import { PkmDuo, PkmDuos } from "../../../../../types/enum/Pokemon"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"
import { GamePokemonDetail } from "./game-pokemon-detail"
import { usePreference } from "../../../preferences"
import { getPkmWithCustom } from "../../../../../models/colyseus-models/pokemon-customs"
import "./game-pokemon-portrait.css"

export default function GamePokemonDuoPortrait(props: {
  index: number
  origin: string
  duo: PkmDuo
  click?: React.MouseEventHandler<HTMLDivElement>
}) {
  const [antialiasing] = usePreference("antialiasing")
  const duo = PkmDuos[props.duo].map((p) => getPokemonData(p))
  const rarityColor = RarityColor[duo[0].rarity]
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const duoCustom = duo.map((p) => getPkmWithCustom(p.index, currentPlayer?.pokemonCustoms))

  return (
    <div
      className={`my-container game-pokemon-portrait game-pokemon-portrait-duo`}
      style={{
        backgroundColor: rarityColor,
        borderColor: rarityColor
      }}
      onClick={props.click}
    >
      {duo.map((p, i) => (
        <React.Fragment key={"duo-" + i}>
          <div
            className={cc(
              "game-pokemon-portrait-duo-part",
              "game-pokemon-portrait-duo-part-" + (i === 0 ? "down" : "up"),
              { pixelated: !antialiasing }
            )}
            data-tooltip-id={`tooltip-${props.origin}-${props.index}-${p.index}`}
            style={{
              backgroundImage: `url("${getPortraitSrc(
                p.index,
                duoCustom[i]?.shiny,
                duoCustom[i]?.emotion
              )}")`
            }}
          ></div>
          <Tooltip
            id={`tooltip-${props.origin}-${props.index}-${p.index}`}
            className="custom-theme-tooltip game-pokemon-detail-tooltip"
            place="bottom"
          >
            <GamePokemonDetail
              pokemon={p.name}
              emotion={duoCustom[i]?.emotion}
              shiny={duoCustom[i]?.shiny}
            />
          </Tooltip>
        </React.Fragment>
      ))}
      <ul className="game-pokemon-portrait-types">
        {Array.from(duo[0].types.values()).map((type) => {
          return (
            <li key={type}>
              <SynergyIcon type={type} size="1.4vw" />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
