import React from "react"
import { useTranslation } from "react-i18next"

import { WeatherThreshold } from "../../../../../config"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { Pkm } from "../../../../../types/enum/Pokemon"
import {
  SynergyAssociatedToWeather,
  Weather
} from "../../../../../types/enum/Weather"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetailTooltip } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"

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
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {WeatherThreshold[weather]}
                <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
              </span>
            </header>
            <p className="description">
              {addIconsToDescription(t(`weather_description.${weather}`))}
            </p>
            <ul>
              {(pokemonsInfluencingWeather.get(weather) ?? [])
                .map((p) => getPokemonData(p))
                .map((p) => (
                  <li key={p.index}>
                    <div
                      key={p.name}
                      className={cc("pokemon-portrait", {
                        additional: p.additional,
                        regional: p.regional
                      })}
                      data-tooltip-id="game-pokemon-detail-tooltip"
                      data-tooltip-content={p.name}
                    >
                      <img src={getPortraitSrc(p.index)} />
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
      <GamePokemonDetailTooltip origin="wiki" />
    </div>
  )
}

const pokemonsInfluencingWeather = new Map([
  [Weather.ZENITH, [Pkm.SHAYMIN_SKY, Pkm.CASTFORM_SUN]],
  [
    Weather.DROUGHT,
    [Pkm.PRIMAL_GROUDON, Pkm.MOLTRES, Pkm.SOLROCK, Pkm.CASTFORM_SUN]
  ],
  [Weather.NIGHT, [Pkm.LUNATONE]],
  [Weather.WINDY, [Pkm.LANDORUS, Pkm.THUNDURUS, Pkm.TORNADUS, Pkm.ENAMORUS]],
  [Weather.MISTY, [Pkm.ENAMORUS]],
  [Weather.RAIN, [Pkm.PRIMAL_KYOGRE, Pkm.CASTFORM_RAIN]],
  [Weather.SNOW, [Pkm.ARTICUNO, Pkm.CASTFORM_HAIL, Pkm.TORNADUS]],
  [Weather.STORM, [Pkm.ZAPDOS, Pkm.THUNDURUS, Pkm.PRIMAL_KYOGRE]],
  [Weather.SANDSTORM, [Pkm.LANDORUS, Pkm.PRIMAL_GROUDON]],
  [Weather.NEUTRAL, [Pkm.MEGA_RAYQUAZA]]
])
