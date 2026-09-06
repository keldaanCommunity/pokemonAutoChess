import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { RarityColor, RarityCost, RegionDetails } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import type { Pkm } from "../../../../../types/enum/Pokemon"
import {
  selectConnectedPlayer,
  selectSpectatedPlayer,
  useAppSelector
} from "../../../hooks"
import SynergyIcon from "../icons/synergy-icon"
import { getCachedPortrait } from "./game-pokemon-portrait"
import "./game-regional-pokemons.css"

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
  const connectedPlayer = useAppSelector(selectConnectedPlayer)
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const regionalPokemons: Pkm[] = (
    spectatedPlayer?.regionalPokemons ?? new Array<Pkm>()
  )
    .slice()
    .sort((a, b) => {
      return (
        RarityCost[getPokemonData(a).rarity] -
        RarityCost[getPokemonData(b).rarity]
      )
    })

  if (!regionalPokemons || regionalPokemons.length === 0) {
    return (
      <div className="wrapper">
        <p className="help">{t("regional_pokemon_hint")}</p>
      </div>
    )
  } else {
    return (
      <div className="wrapper">
        <header>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{t("regional_pokemons")}</span>
            <div className="spacer"></div>
            {spectatedPlayer?.map && (
              <span className="map-information">
                {t(`map.${spectatedPlayer.map}`)}
                {RegionDetails[spectatedPlayer.map].synergies.map((synergy) => (
                  <SynergyIcon type={synergy} key={"map_type_" + synergy} />
                ))}
              </span>
            )}
          </div>
          <p className="help">{t("regional_pokemon_hint")}</p>
        </header>

        <div className="grid">
          {regionalPokemons.map((p, index) => {
            const pokemon = getPokemonData(p)
            const rarityColor = RarityColor[pokemon.rarity]

            return (
              <div
                className="my-box clickable game-pokemon-portrait"
                key={"game-regional-pokemons-" + index}
                style={{
                  backgroundColor: rarityColor,
                  borderColor: rarityColor,
                  backgroundImage: `url("${getCachedPortrait(pokemon.index, connectedPlayer?.pokemonCustoms)}")`
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
