import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { RarityColor } from "../../../../../types/Config"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { getPortraitSrc } from "../../../../../utils/avatar"
import SynergyIcon from "../icons/synergy-icon"
import { cc } from "../../utils/jsx"
import { usePreferences } from "../../../preferences"
import { getPkmWithCustom } from "../../../../../models/colyseus-models/pokemon-customs"

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
  const [{ antialiasing }] = usePreferences()
  const { t } = useTranslation()

  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const additionalPokemons = useAppSelector(
    (state) => state.game.additionalPokemons
  )
  const currentPlayer = useAppSelector(selectCurrentPlayer)

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
            const custom = getPkmWithCustom(pokemon.index, currentPlayer?.pokemonCustoms)

            return (
              <div
                className={cc(`my-box clickable game-pokemon-portrait`, { pixelated: !antialiasing })}
                key={"game-additional-pokemons-" + index}
                style={{
                  backgroundColor: rarityColor,
                  borderColor: rarityColor,
                  backgroundImage: `url("${getPortraitSrc(pokemon.index, custom.shiny, custom.emotion)}")`
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
