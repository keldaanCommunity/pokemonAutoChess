import React from "react"
import ReactTooltip from "react-tooltip"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import PokemonFactory from "../../../../../models/pokemon-factory"
import { GamePokemonDetail } from "./game-pokemon-detail"
import { useTranslation } from "react-i18next"

export function GameAdditionalPokemons() {
  const { t } = useTranslation()
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )

  if (!additionalPokemons || additionalPokemons.length === 0) {
    return null
  } else {
    return (
      <>
        <ReactTooltip
          id="detail-additional-pokemons"
          className="customeTheme"
          place="top"
        >
          <p className="help">{t("additional_pokemon_hint")}</p>
        </ReactTooltip>
        <div
          className="nes-container game-additional-pokemons"
          data-tip
          data-for="detail-additional-pokemons"
        >
          {additionalPokemons.map((p, index) => {
            const pokemon = PokemonFactory.createPokemonFromName(p)
            return (
              <React.Fragment key={"additional-pokemon-tooltip-" + index}>
                <ReactTooltip
                  id={"additional-pokemon-" + p}
                  className="customeTheme game-pokemon-detail-tooltip"
                  place="top"
                  offset={{ top: index < 4 ? 60 : 130 }}
                >
                  <GamePokemonDetail
                    pokemon={pokemon}
                    emotion={
                      pokemonCollection.get(pokemon.index)?.selectedEmotion
                    }
                    shiny={pokemonCollection.get(pokemon.index)?.selectedShiny}
                  />
                </ReactTooltip>
                <img
                  src={getPortraitSrc(PkmIndex[p])}
                  data-tip
                  data-for={"additional-pokemon-" + p}
                />
              </React.Fragment>
            )
          })}
        </div>
      </>
    )
  }
}
