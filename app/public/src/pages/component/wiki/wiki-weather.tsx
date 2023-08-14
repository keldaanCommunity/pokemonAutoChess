import React, { useState } from "react"
import ReactTooltip from "react-tooltip"
import { Pokemon } from "../../../../../models/colyseus-models/pokemon"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm } from "../../../../../types/enum/Pokemon"
import {
  PassiveAssociatedToWeather,
  SynergyAssociatedToWeather,
  Weather
} from "../../../../../types/enum/Weather"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { useTranslation } from "react-i18next"

const pokemonsByWeather: Map<Weather, Pokemon[]> = new Map()
Object.values(Weather).forEach((weather) => {
  pokemonsByWeather.set(weather, getPokemonsInfluencingWeather(weather))
})

export default function WikiWeather() {
  const { t } = useTranslation()
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>()

  return (
    <div id="wiki-weather">
      <div className="nes-container">
        <p>{t("weather_dominant_hint")}</p>
        <p>{t("weather_dominant_hint2")}</p>
      </div>
      <ul>
        {Object.values(Weather).map((weather: Weather) => (
          <li key={weather} className="nes-container">
            <header>
              <img
                className="weather-icon"
                src={`/assets/icons/weather/${weather.toLowerCase()}.svg`}
              />
              <h2>{t(`weather.${weather}`)}</h2>
              <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
            </header>
            <p className="description">
              {addIconsToDescription(t(`weather_description.${weather}`))}
            </p>
            <ul>
              {(pokemonsByWeather.get(weather) ?? []).map((p) => (
                <li key={p.index}>
                  <div
                    key={p.name}
                    className={cc("pokemon-portrait", {
                      additional: isAdditionalPick(p.name)
                    })}
                    data-tip
                    data-for="pokemon-detail"
                    onMouseOver={() => {
                      setHoveredPokemon(p)
                    }}
                  >
                    <img
                      src={getPortraitSrc(p.index)}
                      alt={p.name}
                      title={p.name}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {hoveredPokemon && (
        <ReactTooltip
          id="pokemon-detail"
          className="customeTheme game-pokemon-detail-tooltip"
          effect="float"
        >
          <GamePokemonDetail pokemon={hoveredPokemon} />
        </ReactTooltip>
      )}
    </div>
  )
}

function getPokemonsInfluencingWeather(weather: Weather) {
  return Object.values(Pkm)
    .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
    .filter(
      (pkm) =>
        pkm.skill != Ability.DEFAULT &&
        pkm.passive != null &&
        (pkm.passive === PassiveAssociatedToWeather.get(weather) ||
          (pkm.name === Pkm.CASTFORM_SUN && weather === Weather.SUN) ||
          (pkm.name === Pkm.CASTFORM_RAIN && weather === Weather.RAIN) ||
          (pkm.name === Pkm.CASTFORM_HAIL && weather === Weather.SNOW))
    )
}
