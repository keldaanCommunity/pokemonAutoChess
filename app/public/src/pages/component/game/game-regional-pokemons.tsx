import React from "react"
import ReactDOM from "react-dom"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed"
import { PkmIndex } from "../../../../../types/enum/Pokemon"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../utils"
import { GamePokemonDetail } from "./game-pokemon-detail"

export function GameRegionalPokemonsIcon() {
  return (
    <div className="my-box" style={{ padding: "5px" }}>
      <img
        src={`assets/ui/regional.png`}
        style={{ width: "2em", height: "2em" }}
        data-tooltip-id={"game-regional-pokemons"}
      />
      <Tooltip
        id="game-regional-pokemons"
        float
        place="top"
        className="custom-theme-tooltip"
      >
        <GameRegionalPokemons />
      </Tooltip>
    </div>
  )
}

export function GameRegionalPokemons() {
  const { t } = useTranslation()
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const pokemonCollection = useAppSelector(
    (state) => state.game.pokemonCollection
  )

  if (!additionalPokemons || additionalPokemons.length === 0) {
    return (
      <div className="my-box game-regional-pokemons">
        <p>{t("regional_pokemon_hint")}</p>
      </div>
    )
  } else {
    return (
      <div className="my-box game-regional-pokemons">
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
                    shiny={pokemonCollection.get(pokemon.index)?.selectedShiny}
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
    )
  }
}
