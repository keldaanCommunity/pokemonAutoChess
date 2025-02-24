import dotenv from "dotenv"
import { connect } from "mongoose"
import { nanoid } from "nanoid"
import { BotV2, IBot } from "../app/models/mongo-models/bot-v2"
import { logger } from "../app/utils/logger"
import { readFile } from "fs/promises"
import DetailledStatistic, {
  IDetailledStatistic,
  Pokemon as IDetailledStatisticPokemon
} from "../app/models/mongo-models/detailled-statistic-v2"
import { MAX_PLAYERS_PER_GAME } from "../app/types/Config"
import { computeSynergies } from "../app/models/colyseus-models/synergies"
import { PokemonClasses } from "../app/models/colyseus-models/pokemon"
import { Passive } from "../app/types/enum/Passive"
import { getAvatarString } from "../app/utils/avatar"

async function main() {
  dotenv.config()

  logger.debug("retrieving data ...")
  const data = await readFile(
    process.argv[2] || "db-commands/botv2.json",
    "utf8"
  )
  if (!data) {
    logger.error("Couldn't load botv2.json")
    process.exit(1)
  }

  logger.debug("parsing JSON data ...")
  let botData: IBot[]
  try {
    botData = JSON.parse(data)
  } catch (e) {
    logger.error("Parsing error:", e)
    process.exit(1)
  }

  const stats: IDetailledStatistic[] = []

  logger.debug("process data ...")
  for (let i = 0; i < botData.length; i += MAX_PLAYERS_PER_GAME) {
    const slice = botData
      .slice(i, Math.min(i + MAX_PLAYERS_PER_GAME, botData.length))
      .sort((a, b) => b.elo - a.elo)

    slice.forEach((bot, rank) => {
      bot.steps.forEach(({ board }) => {
        const pokemon = board
          .filter((botPokemon) => botPokemon.y != 0)
          .map((botPokemon) => ({
            pokemon: new PokemonClasses[botPokemon.name](
              botPokemon.shiny,
              botPokemon.emotion
            ),
            botPokemon
          }))
          .filter(({ pokemon }) => pokemon.passive !== Passive.INANIMATE)

        const statPokemon = pokemon.map(({ pokemon, botPokemon }) => {
          const avatar = getAvatarString(
            pokemon.index,
            pokemon.shiny,
            pokemon.emotion
          )
          const s: IDetailledStatisticPokemon = {
            name: botPokemon.name,
            avatar: avatar,
            items: botPokemon.items
          }
          return s
        })

        const synergiesMap = computeSynergies(pokemon.map((p) => p.pokemon))

        stats.push({
          time: Date.now(),
          name: bot.name,
          pokemons: statPokemon,
          rank: rank + 1,
          nbplayers: slice.length,
          avatar: bot.avatar,
          playerId: bot.id,
          elo: bot.elo,
          synergies: synergiesMap
        })
      })
    })
  }

  logger.debug("connect to db ...")
  const db = await connect(process.env.MONGO_URI!)

  logger.debug("import into db ...")
  await DetailledStatistic.create(stats)

  await db.disconnect()
  logger.debug("all done !")
}

main()
