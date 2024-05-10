import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { WeatherThreshold } from "../../../../../types/Config"
import { Ability } from "../../../../../types/enum/Ability"
import { Pkm } from "../../../../../types/enum/Pokemon"
import {
  PassiveAssociatedToWeather,
  SynergyAssociatedToWeather,
  Weather
} from "../../../../../types/enum/Weather"
import { IPokemonData } from "../../../../../types/interfaces/PokemonData"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"

const pokemonsByWeather: Map<Weather, IPokemonData[]> = new Map()
Object.values(Weather).forEach((weather) => {
  pokemonsByWeather.set(weather, getPokemonsInfluencingWeather(weather))
})

export default function WikiWeather() {
  const { t } = useTranslation()
  return (
    <div id="wiki-weather">
      <div className="my-box" style={{ marginBottom: "0.5em" }}>
        <p>{t("weather_dominant_hint")}</p>
        <p>{t("weather_dominant_hint2")}</p>
      </div>
      <ul>
        {Object.values(Weather).map((weather: Weather) => (
          <li key={weather} className="my-box">
            <header>
              <img
                className="weather-icon"
                src={`/assets/icons/weather/${weather.toLowerCase()}.svg`}
              />
              <h2>{t(`weather.${weather}`)}</h2>
              <span style={{ fontSize: "1.5em" }}>
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
                      additional: p.additional,
                      regional: p.regional
                    })}
                    data-tooltip-id={`pokemon-detail-${p.index}`}
                  >
                    <img src={getPortraitSrc(p.index)} />
                    <Tooltip
                      id={`pokemon-detail-${p.index}`}
                      className="custom-theme-tooltip game-pokemon-detail-tooltip"
                    >
                      <GamePokemonDetail pokemon={p.name} />
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
    .map((pkm) => getPokemonData(pkm))
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
