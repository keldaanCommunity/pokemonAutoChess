import React, { useState } from "react"
import { Tooltip } from "react-tooltip"
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
import { WeatherThreshold } from "../../../../../types/Config"

const pokemonsByWeather: Map<Weather, Pokemon[]> = new Map()
Object.values(Weather).forEach((weather) => {
  pokemonsByWeather.set(weather, getPokemonsInfluencingWeather(weather))
})

export default function WikiWeather() {
  const { t } = useTranslation()
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
              <span>
                {WeatherThreshold[weather]}
                <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
              </span>
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
                    data-tooltip-id={`pokemon-detail-${p.index}`}
                  >
                    <img src={getPortraitSrc(p.index)} />
                    <Tooltip
                      id={`pokemon-detail-${p.index}`}
                      className="custom-theme-tooltip game-pokemon-detail-tooltip"
                    >
                      <GamePokemonDetail pokemon={p} />
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
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
