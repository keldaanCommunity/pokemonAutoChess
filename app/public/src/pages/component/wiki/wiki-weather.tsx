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
import {
  WeatherDescription,
  WeatherLabel
} from "../../../../../types/strings/Weather"
import { getPortraitSrc } from "../../../utils"
import { addIconsToDescription } from "../../utils/descriptions"
import { cc } from "../../utils/jsx"
import { GamePokemonDetail } from "../game/game-pokemon-detail"
import SynergyIcon from "../icons/synergy-icon"

const pokemonsByWeather: Map<Weather, Pokemon[]> = new Map()
Object.values(Weather).forEach((weather) => {
  pokemonsByWeather.set(weather, getPokemonsInfluencingWeather(weather))
})

export default function WikiWeather() {
  const [hoveredPokemon, setHoveredPokemon] = useState<Pokemon>()
  
  return (
    <div id="wiki-weather">
      <div className="nes-container">
        <p>
          The dominant type of pokemons on the board during a battle can
          influence the weather. The weather has various effects on all of your
          team's and opponent's pokemons.
        </p>
        <p>
          It will require at least 8 pokemons of this type on the board to
          change the weather. Some powerful pokemons also have the ability to
          change weather by their own.
        </p>
      </div>
      <ul>
        {Object.values(Weather).map((weather: Weather) => (
          <li key={weather} className="nes-container">
            <header>
              <img
                className="weather-icon"
                src={`/assets/icons/weather/${weather.toLowerCase()}.svg`}
              />
              <h2>{WeatherLabel[weather]}</h2>
              <SynergyIcon type={SynergyAssociatedToWeather.get(weather)!} />
            </header>
            <p className="description">
              {addIconsToDescription(WeatherDescription[weather])}
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
          place="bottom"
          offset={{ bottom: 20 }}
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
        (pkm.passive === PassiveAssociatedToWeather.get(weather)
        || (pkm.name === Pkm.CASTFORM_SUN && weather === Weather.SUN)
        || (pkm.name === Pkm.CASTFORM_RAIN && weather === Weather.RAIN)
        || (pkm.name === Pkm.CASTFORM_HAIL && weather === Weather.SNOW))
    )
}
