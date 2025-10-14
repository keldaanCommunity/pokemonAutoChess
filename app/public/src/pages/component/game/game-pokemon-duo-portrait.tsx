import React from "react"
import { Tooltip } from "react-tooltip"
import { getPkmWithCustom } from "../../../../../models/colyseus-models/pokemon-customs"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { RarityColor } from "../../../../../types/Config"
import { PkmDuo, PkmDuos } from "../../../../../types/enum/Pokemon"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"
import { GamePokemonDetail } from "./game-pokemon-detail"
import { getCachedPortrait } from "./game-pokemon-portrait"
import "./game-pokemon-portrait.css"

export default function GamePokemonDuoPortrait(props: {
  index: number
  origin: "proposition"
  duo: PkmDuo
  click?: React.MouseEventHandler<HTMLDivElement>
  inPlanner?: boolean
}) {
  const duo = PkmDuos[props.duo].map((p) => getPokemonData(p))
  const rarityColor = RarityColor[duo[0].rarity]
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const duoCustom = duo.map((p) =>
    getPkmWithCustom(p.index, currentPlayer?.pokemonCustoms)
  )

  return (
    <div
      className={cc(
        `my-container game-pokemon-portrait game-pokemon-portrait-duo`,
        { planned: props.inPlanner ?? false }
      )}
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
              "game-pokemon-portrait-duo-part-" + (i === 0 ? "down" : "up")
            )}
            data-tooltip-id={`tooltip-${props.origin}-${props.index}-${p.index}`}
            style={{
              backgroundImage: `url("${getCachedPortrait(p.index, currentPlayer?.pokemonCustoms)}")`
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
              origin={props.origin}
            />
          </Tooltip>
        </React.Fragment>
      ))}
      {props.inPlanner && (
        <img
          src="/assets/ui/planned.png"
          alt=""
          className="game-pokemon-portrait-planned-icon"
        />
      )}
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
