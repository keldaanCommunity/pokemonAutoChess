import React from "react"
import { Tooltip } from "react-tooltip"
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
        <Tooltip
          id="detail-additional-pokemons"
          className="customeTheme"
          place="left"
        >
          <p className="help">{t("additional_pokemon_hint")}</p>
        </Tooltip>
        <div
          className="nes-container game-additional-pokemons"
          data-tooltip-id="detail-additional-pokemons"
        >
          {additionalPokemons.map((p, index) => {
            const pokemon = PokemonFactory.createPokemonFromName(p)
            return (
              <React.Fragment key={"additional-pokemon-tooltip-" + index}>
                <Tooltip
                  id={"additional-pokemon-" + p}
                  className="customeTheme game-pokemon-detail-tooltip"
                  place="top"
                  data-tooltip-offset={{ top: index < 4 ? 60 : 130 }}
                >
                  <GamePokemonDetail
                    pokemon={pokemon}
                    emotion={
                      pokemonCollection.get(pokemon.index)?.selectedEmotion
                    }
                    shiny={pokemonCollection.get(pokemon.index)?.selectedShiny}
                  />
                </Tooltip>
                <img
                  src={getPortraitSrc(PkmIndex[p])}
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
