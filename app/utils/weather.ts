import { Passive } from "../types/enum/Passive"
import {
  Weather,
  WeatherAssociatedToSynergy,
  WeatherPassives
} from "../types/enum/Weather"

import { MapSchema } from "@colyseus/schema"
import { Pokemon } from "../models/colyseus-models/pokemon"
import { WeatherThreshold } from "../types/Config"

export function getWeather(
  playerBoard: MapSchema<Pokemon, string>,
  opponentBoard: MapSchema<Pokemon, string>
): Weather {
  function getDominantWeather(
    count: Map<Weather, number>,
    weathers: Weather[] = [...count.keys()]
  ): Weather | null {
    const sortedCount = weathers
      .map((w) => [w, count.get(w) ?? 0] as [Weather, number])
      .filter(([w, count]) => count >= WeatherThreshold[w])
      .sort((a, b) => b[1] - a[1])

    if (sortedCount.length === 0) return null
    if (sortedCount.length === 1) return sortedCount[0][0]
    if (sortedCount.length >= 2 && sortedCount[0][1] === sortedCount[1][1])
      return null
    return sortedCount[0][0]
  }

  const boardWeatherScore = new Map<Weather, number>()
  ;[playerBoard, opponentBoard].forEach((board) => {
    const playerWeatherScore = new Map<Weather, number>()
    board.forEach((pkm) => {
      if (pkm.positionY != 0) {
        if (WeatherPassives.has(pkm.passive)) {
          const weather = WeatherPassives.get(pkm.passive)!
          boardWeatherScore.set(
            weather,
            (boardWeatherScore.get(weather) ?? 0) + 100
          )
          playerWeatherScore.set(
            weather,
            (playerWeatherScore.get(weather) ?? 0) + 100
          )
        }
        pkm.types.forEach((type) => {
          if (WeatherAssociatedToSynergy.has(type)) {
            const weather = WeatherAssociatedToSynergy.get(type)!
            boardWeatherScore.set(
              weather,
              (boardWeatherScore.get(weather) ?? 0) + 1
            )
            if (
              pkm.passive === Passive.SAND_STREAM &&
              weather === Weather.SANDSTORM
            ) {
              boardWeatherScore.set(
                Weather.SANDSTORM,
                (boardWeatherScore.get(Weather.SANDSTORM) ?? 0) + 2
              )
              playerWeatherScore.set(
                Weather.SANDSTORM,
                (playerWeatherScore.get(Weather.SANDSTORM) ?? 0) + 2
              )
            }
            if (pkm.passive === Passive.DRIZZLE && weather === Weather.RAIN) {
              boardWeatherScore.set(
                Weather.RAIN,
                (boardWeatherScore.get(Weather.RAIN) ?? 0) + 2
              )
              playerWeatherScore.set(
                Weather.RAIN,
                (playerWeatherScore.get(Weather.RAIN) ?? 0) + 2
              )
            }
            if (pkm.passive !== Passive.CASTFORM) {
              playerWeatherScore.set(
                weather,
                (playerWeatherScore.get(weather) ?? 0) + 1
              )
            }
          }
        })
      }
    })

    // apply special weather passives
    board.forEach((pkm) => {
      if (pkm.positionY != 0) {
        if (pkm.passive === Passive.CASTFORM) {
          const dominant = getDominantWeather(playerWeatherScore, [
            Weather.SUN,
            Weather.RAIN,
            Weather.SNOW
          ])
          if (dominant) {
            boardWeatherScore.set(
              dominant,
              (boardWeatherScore.get(dominant) ?? 0) + 100
            )
          }
        }
      }
    })
  })

  //logger.debug("boardWeatherScore", boardWeatherScore)
  const dominantWeather = getDominantWeather(boardWeatherScore)
  if (
    dominantWeather &&
    boardWeatherScore.get(dominantWeather)! >= WeatherThreshold[dominantWeather]
  ) {
    return dominantWeather
  }
  return Weather.NEUTRAL
}
