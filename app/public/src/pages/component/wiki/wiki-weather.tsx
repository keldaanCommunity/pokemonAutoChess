import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getPokemonData } from "../../../../../models/precomputed/precomputed-pokemon-data"
import { WeatherThreshold } from "../../../../../types/Config"
import { Pkm } from "../../../../../types/enum/Pokemon"
import {
  SynergyAssociatedToWeather,
  Weather
} from "../../../../../types/enum/Weather"
import { getPortraitSrc } from "../../../../../utils/avatar"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"
import { usePreference } from "../../../preferences"


export default function WikiWeather() {
  const [antialiasing] = usePreference('antialiasing')
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
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {WeatherThreshold[weather]}
                <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
              </span>
            </header>
            <p className="description">
              {addIconsToDescription(t(`weather_description.${weather}`))}
            </p>
            <ul>
              {(pokemonsInfluencingWeather.get(weather) ?? [])
                .map(p => getPokemonData(p))
                .map((p) => (
                  <li key={p.index}>
                    <div
                      key={p.name}
                      className={cc("pokemon-portrait", {
                        additional: p.additional,
                        regional: p.regional
                      })}
                      data-tooltip-id={`pokemon-detail-${p.index}`}
                    >
                      <img src={getPortraitSrc(p.index)} className={cc({ pixelated: !antialiasing })} />
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

const pokemonsInfluencingWeather = new Map([
  [Weather.SUN, [Pkm.HO_OH, Pkm.SOLROCK, Pkm.CASTFORM_SUN]],
  [Weather.NIGHT, [Pkm.LUNATONE, Pkm.SHADOW_LUGIA]],
  [Weather.WINDY, [Pkm.LUGIA, Pkm.LANDORUS, Pkm.THUNDURUS, Pkm.TORNADUS, Pkm.ENAMORUS]],
  [Weather.MISTY, [Pkm.ENAMORUS, Pkm.XERNEAS]],
  [Weather.RAIN, [Pkm.PRIMAL_KYOGRE, Pkm.CASTFORM_RAIN,]],
  [Weather.SNOW, [Pkm.ARTICUNO, Pkm.CASTFORM_HAIL, Pkm.TORNADUS]],
  [Weather.STORM, [Pkm.ZAPDOS, Pkm.THUNDURUS]],
  [Weather.SANDSTORM, [Pkm.LANDORUS, Pkm.PRIMAL_GROUDON]],
  [Weather.NEUTRAL, [Pkm.MEGA_RAYQUAZA]],
])
