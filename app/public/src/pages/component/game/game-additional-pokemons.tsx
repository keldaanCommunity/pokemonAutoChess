import React from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import { getGameScene } from "../../game"
import { GamePokemonDetail } from "./game-pokemon-detail"

export function GameAdditionalPokemons() {
  const { t } = useTranslation()
  const specialGameRule = getGameScene()?.room?.state.specialGameRule
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )

  if (specialGameRule === SpecialGameRule.EVERYONE_IS_HERE) {
    return (
      <div className="nes-container game-additional-pokemons">
        <p>{t("scribble.EVERYONE_IS_HERE")}</p>
      </div>
    )
  } else if (!additionalPokemons || additionalPokemons.length === 0) {
    return null
  } else {
    return (
      <>
        <Tooltip
          id="detail-additional-pokemons"
          className="custom-theme-tooltip"
          place="left"
        >
          <p className="help">{t("additional_pokemon_hint")}</p>
        </Tooltip>
        <div
          className="nes-container game-additional-pokemons"
          data-tooltip-id="detail-additional-pokemons"
        >
          {additionalPokemons.map((p, index) => {
            const pokemon = getPokemonData(p)
            return (
              <React.Fragment key={"additional-pokemon-tooltip-" + index}>
                {ReactDOM.createPortal(
                  <Tooltip
                    id={"additional-pokemon-" + p}
                    className="custom-theme-tooltip game-pokemon-detail-tooltip"
                    place="top"
                    data-tooltip-offset={{ top: index < 4 ? 60 : 130 }}
                  >
                    <GamePokemonDetail
                      pokemon={pokemon.name}
                      emotion={
                        pokemonCollection.get(pokemon.index)?.selectedEmotion
                      }
                      shiny={
                        pokemonCollection.get(pokemon.index)?.selectedShiny
                      }
                    />
                  </Tooltip>,
                  document.body
                )}
                <img
                  src={getPortraitSrc(PkmIndex[p])}
                  className={pokemon.rarity.toLowerCase()}
                  data-tooltip-id={"additional-pokemon-" + p}
                />
              </React.Fragment>
            )
          })}
        </div>
      </>
    )
  }
}
