import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { RarityColor } from "../../../../../types/Config"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { getGameScene } from "../../game"
import SynergyIcon from "../icons/synergy-icon"

export function GameAdditionalPokemonsIcon() {
  return (
    <div className="my-box" style={{ padding: "5px" }}>
      <img
        src={`assets/ui/addpicks.png`}
        style={{ width: "2em", height: "2em" }}
        data-tooltip-id={"game-additional-pokemons"}
      />
      <Tooltip
        id="game-additional-pokemons"
        float
        place="top"
        className="custom-theme-tooltip"
      >
        <GameAdditionalPokemons />
      </Tooltip>
    </div>
  )
}

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
      <div className="game-additional-pokemons">
        <p>{t("scribble.EVERYONE_IS_HERE")}</p>
      </div>
    )
  } else if (!additionalPokemons || additionalPokemons.length === 0) {
    return (
      <div className="game-additional-pokemons">
        <p className="help">{t("additional_pokemon_hint")}</p>
      </div>
    )
  } else {
    return (
      <div className="game-additional-pokemons">
        <h2>{t("additional_picks")}</h2>
        <p className="help">{t("additional_pokemon_hint")}</p>
        <div className="grid">
          {additionalPokemons.map((p, index) => {
            const pokemon = getPokemonData(p)
            const rarityColor = RarityColor[pokemon.rarity]
            const pokemonConfig: IPokemonConfig | undefined =
              pokemonCollection.get(pokemon.index)

            return (
              <div
                className={`my-box clickable game-pokemon-portrait`}
                key={"game-additional-pokemons-" + index}
                style={{
                  backgroundColor: rarityColor,
                  borderColor: rarityColor,
                  backgroundImage: `url("${getPortraitSrc(
                    pokemon.index,
                    pokemonConfig?.selectedShiny,
                    pokemonConfig?.selectedEmotion
                  )}")`
                }}
              >
                <ul className="game-pokemon-portrait-types">
                  {Array.from(pokemon.types.values()).map((type) => {
                    return (
                      <li key={type}>
                        <SynergyIcon type={type} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
