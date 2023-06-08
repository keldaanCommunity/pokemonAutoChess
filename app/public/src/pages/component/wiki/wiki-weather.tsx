import React from "react"
import PokemonFactory, {
  isAdditionalPick
} from "../../../../../models/pokemon-factory"
import { Pkm } from "../../../../../types/enum/Pokemon"
import {
  PassiveAssociatedToWeather,
  SynergyAssociatedToWeather,
  Weather
} from "../../../../../types/enum/Weather"
import {
  WeatherDescription,
  WeatherLabel
} from "../../../../../types/strings/Weather"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import SynergyIcon from "../icons/synergy-icon"

export default function WikiWeather() {
  return (
    <div className="wiki-weather">
      <p>The dominant type of pokemons on the board during a battle can influence the weather. The weather has various effects on all of your team's and opponent's pokemons.</p>
      <p>It will require at least 10 pokemons of this type on the board to change the weather. Some powerful pokemons also have the ability to change weather by their own.</p>
      <ul>
        {Object.values(Weather).map((weather: Weather) => (
          <li key={weather} className="nes-container">
            <header>
              <img
                className="weather-icon"
                src={`/assets/ui/weather/${weather.toLowerCase()}.svg`}
              />
              <h2>{WeatherLabel[weather]}</h2>
              <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
            </header>
            <p className="description">
              {addIconsToDescription(WeatherDescription[weather])}
            </p>
            <ul>
              <li></li>
              {getPokemonsInfluencingWeather(weather).map((p) => (
                <li key={p.index}>
                  <div
                    key={p.name}
                    className={cc("pokemon-portrait", {
                      additional: isAdditionalPick(p.name)
                    })}
                  >
                    <img
                      src={getPortraitSrc(p.index)}
                      alt={p.name}
                      title={p.name}
                      data-tip
                      data-for="pokemon-detail"
                    />
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
        pkm.passive != null &&
        pkm.passive === PassiveAssociatedToWeather.get(weather)
    )
}
