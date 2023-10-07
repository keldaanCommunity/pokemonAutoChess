import React from "react"
import { Tooltip } from "react-tooltip"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { RarityColor } from "../../../../../types/Config"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { PkmDuo, PkmDuos } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import PokemonFactory from "../../../../../models/pokemon-factory"
import "./game-pokemon-portrait.css"
import { cc } from "../../utils/jsx"

export default function GamePokemonDuoPortrait(props: {
  index: number
  origin: string
  duo: PkmDuo
  click: React.MouseEventHandler<HTMLDivElement>
}) {
  const duo = PkmDuos[props.duo].map((p) =>
    PokemonFactory.createPokemonFromName(p)
  )
  const rarityColor = RarityColor[duo[0].rarity]
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )
  const duoConfig: (IPokemonConfig | undefined)[] = duo.map((p) =>
    pokemonCollection?.get(p.index)
  )

  return (
    <div
      className={`nes-container game-pokemon-portrait game-pokemon-portrait-duo`}
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
              backgroundImage: `url("${getPortraitSrc(
                p.index,
                duoConfig[i]?.selectedShiny,
                duoConfig[i]?.selectedEmotion
              )}")`
            }}
          ></div>
          <Tooltip
            id={`tooltip-${props.origin}-${props.index}-${p.index}`}
            className="custom-theme-tooltip game-pokemon-detail-tooltip"
            place="bottom"
          >
            <GamePokemonDetail
              pokemon={p}
              emotion={duoConfig[i]?.selectedEmotion}
              shiny={duoConfig[i]?.selectedShiny}
            />
          </Tooltip>
        </React.Fragment>
      ))}
      <ul className="game-pokemon-portrait-types">
        {duo[0].types.map((type) => {
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
